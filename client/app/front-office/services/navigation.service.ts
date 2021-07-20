import {Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {DOCUMENT} from '@angular/common';
import {ComponentRef, ElementRef, Inject, Injectable, Injector, StaticProvider} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {cloneDeep} from 'lodash-es';
import {merge, Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {APP_MENU_DATA, MenuComponent} from '../components/menu/menu.component';

export interface MenuItem {
    display: string;
    children?: MenuItem[];
    link?: RouterLink['routerLink'];
    highlight?: boolean;
    open?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    constructor(
        private readonly overlay: Overlay,
        private readonly injector: Injector,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        @Inject(DOCUMENT) private readonly document: Document,
    ) {}

    /**
     * Open menu
     */
    public open(connectedElement: ElementRef<HTMLElement>, items: MenuItem[], offsetTop: number): Observable<any> {
        // Check how many items to display to adjust menu height and prevent overflow (due to absolute positionning)
        let nbOfItems = items.reduce((max, item) => (item.children ? Math.max(item.children.length) : max), 0);
        nbOfItems = Math.max(nbOfItems, items.length);

        // Container data
        const providers: StaticProvider[] = [
            {
                provide: APP_MENU_DATA,
                useValue: {
                    items: cloneDeep(items),
                    originalNativeElement: connectedElement.nativeElement,
                    contentHeight: nbOfItems * 38,
                },
            },
        ];

        const containerInjector = Injector.create({providers: providers, parent: this.injector});

        const overlayConfig: OverlayConfig = new OverlayConfig({
            width: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - ' + (offsetTop + 20) + 'px)',
            disposeOnNavigation: true,
            positionStrategy: this.overlay
                .position()
                .global()
                .top(offsetTop + 'px')
                .centerHorizontally(),
            hasBackdrop: true,
            // backdropClass: 'cdk-overlay-transparent-backdrop',
        });

        // Container
        const overlayRef = this.overlay.create(overlayConfig);
        const containerPortal = new ComponentPortal(MenuComponent, undefined, containerInjector);
        const containerRef: ComponentRef<MenuComponent> = overlayRef.attach(containerPortal);

        // Start animation that shows menu
        containerRef.instance.startAnimation();

        // use subject because backdropClick() subscription don't allow two subscriptions (
        const onBackdropClick = new Subject<void>();
        overlayRef.backdropClick().subscribe(() => onBackdropClick.next());

        // Remove overlay on navigation event or on backdrop click
        const onNavigate = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
        const onClose = merge(onBackdropClick, onNavigate);
        onClose.subscribe(() => overlayRef.dispose());

        return onClose;
    }

    public scrollToTop(fragment?: string): void {
        const contentContainer = this.document.querySelector('.mat-sidenav-content');
        if (contentContainer) {
            const top = fragment ? this.document.getElementById(fragment)?.offsetTop || 0 : 0;
            // TODO test if method exist when SSR mode
            // contentContainer.scroll({top: top, behavior: top ? 'smooth' : undefined});
        }
    }
}
