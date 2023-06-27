import {animate, group, query, sequence, state, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, Inject, InjectionToken} from '@angular/core';
import {MenuItem} from '../../services/navigation.service';
import {RouterLinkActive, RouterLink} from '@angular/router';
import {NgTemplateOutlet, NgIf, NgFor} from '@angular/common';

export interface MenuDropdownData {
    items: MenuItem[];
    originalNativeElement: HTMLElement;
    contentHeight: number;
}

export const APP_MENU_DATA = new InjectionToken<MenuDropdownData>('MenuDropdownData');

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    animations: [
        trigger('transformMenu', [
            state('void', style({opacity: 0, transform: 'scale(0.01, 0.01)'})),
            transition(
                'void => enter',
                sequence([
                    query('.mega-menu-content', style({opacity: 0})),
                    animate('100ms linear', style({opacity: 1, transform: 'scale(1, 0.5)'})),
                    group([
                        query(
                            '.mega-menu-content',
                            animate('402ms cubic-bezier(0.55, 0, 0.55, 0.2)', style({opacity: 1})),
                        ),
                        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({transform: 'scale(1, 1)'})),
                    ]),
                ]),
            ),
            transition('* => void', animate('150ms 50ms linear', style({opacity: 0}))),
        ]),
    ],
    standalone: true,
    imports: [NgTemplateOutlet, NgIf, NgFor, RouterLinkActive, RouterLink],
})
export class MenuComponent {
    /**
     * Align with main menu button
     */
    public offsetLeft = 0;

    /**
     * Current state of the panel animation.
     */
    public panelAnimationState: 'void' | 'enter' = 'void';

    public constructor(@Inject(APP_MENU_DATA) public readonly data: MenuDropdownData) {
        this.offsetLeft = data.originalNativeElement.offsetLeft - 20;
    }

    public startAnimation(): void {
        this.panelAnimationState = 'enter';
    }

    /**
     * Toggle open parent nodes, and allow navigation only on children
     */
    public clickAction(item: MenuItem, event: Event): void {
        this.data.items.forEach(i => (i.open = false));

        if (item.children?.length) {
            // Open / close
            item.open = !item.open;

            // Prevent router link
            event.stopPropagation();
            event.preventDefault();
        }
    }
}
