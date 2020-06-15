import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NaturalAbstractDetail, NaturalDialogTriggerProvidedData} from '@ecodev/natural';
import {merge, omit} from 'lodash';
import {
    OrderLine,
    OrderLineVariables,
    UpdateOrderLine,
    UpdateOrderLineVariables,
} from '../../../shared/generated-types';
import {ProductService} from '../../products/services/product.service';
import {OrderLineService} from '../services/order-lines.service';
import {SubscriptionService} from '../../../front-office/modules/shop/components/subscriptions/subscription.service';

@Component({
    selector: 'app-order-line',
    templateUrl: './order-line.component.html',
    styleUrls: ['./order-line.component.scss'],
})
export class OrderLineComponent
    extends NaturalAbstractDetail<
        OrderLine['orderLine'],
        OrderLineVariables,
        never,
        never,
        UpdateOrderLine['updateOrderLine'],
        UpdateOrderLineVariables,
        never,
        never
    >
    implements OnInit {
    constructor(
        private orderLineService: OrderLineService,
        public productService: ProductService,
        public subscriptionService: SubscriptionService,
        injector: Injector,
        @Inject(MAT_DIALOG_DATA) private dialogData: NaturalDialogTriggerProvidedData,
    ) {
        super('orderLine', orderLineService, injector);
    }

    /**
     * Override parent to populate data from dialog data instead of standard route data
     */
    public ngOnInit(): void {
        this.dialogData.activatedRoute.data.subscribe(data => {
            const key = 'orderLine';
            this.data = merge({model: this.service.getConsolidatedForClient()}, data[key]);
            this.data = merge(this.data, omit(data, [key]));
            this.initForm();
        });
    }
}
