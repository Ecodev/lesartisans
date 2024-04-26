import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {keyBy} from 'lodash-es';
import {ProductType, Subscriptions} from '../../../../../shared/generated-types';
import {EmailsComponent} from '../emails/emails.component';
import {SubscriptionService} from './subscription.service';
import {GlobalCartService} from '../../../cart/services/global-cart.service';
import {MatButtonModule} from '@angular/material/button';
import {PriceComponent} from '../../../../../shared/components/price/price.component';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrl: './subscriptions.component.scss',
    standalone: true,
    imports: [FlexModule, PriceComponent, MatButtonModule],
})
export class SubscriptionsComponent implements OnInit {
    public subscriptions: Record<string, Subscriptions['subscriptions']['items'][0]> | null = null;

    public ProductType = ProductType;

    public constructor(
        private readonly subscriptionService: SubscriptionService,
        private readonly router: Router,
        public readonly dialog: MatDialog,
        private readonly route: ActivatedRoute,
        private readonly globalCartService: GlobalCartService,
    ) {}

    public ngOnInit(): void {
        this.subscriptionService
            .getAll(new NaturalQueryVariablesManager())
            .subscribe(res => (this.subscriptions = keyBy(res.items, 'id')));
    }

    public order(id: string, type: ProductType, withEmails?: boolean): void {
        const subscribeFn = (emails?: string[]): void => {
            if (!this.subscriptions) {
                return;
            }
            const cart = this.globalCartService.cart;
            cart.setSubscription(this.subscriptions[id], type, emails);
            this.router.navigateByUrl('/panier/' + cart.id);
        };

        if (!withEmails) {
            subscribeFn();
        } else {
            const viewer = this.route.snapshot.data.viewer;

            const dialogData: MatDialogConfig = {
                data: {
                    emails: [viewer ? viewer.email : '', '', ''], // prefill with user email if logged in
                    title: "Emails des bénéficiaires de l'abonnement profesionnel",
                },
            };

            this.dialog
                .open(EmailsComponent, dialogData)
                .afterClosed()
                .subscribe(result => {
                    if (result) {
                        subscribeFn(result);
                    }
                });
        }
    }
}
