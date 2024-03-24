import {Component, OnInit} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {
    NaturalAbstractDetail,
    NaturalSelectComponent,
    NaturalSelectEnumComponent,
    NaturalSeoResolveData,
} from '@ecodev/natural';
import {ProductService} from '../../products/services/product.service';
import {OrderLineService} from '../services/order-lines.service';
import {SubscriptionService} from '../../../front-office/modules/shop/components/subscriptions/subscription.service';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-order-line',
    templateUrl: './order-line.component.html',
    styleUrl: './order-line.component.scss',
    standalone: true,
    imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        NaturalSelectComponent,
        MatDividerModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        NaturalSelectEnumComponent,
        MatButtonModule,
    ],
})
export class OrderLineComponent
    extends NaturalAbstractDetail<OrderLineService, NaturalSeoResolveData>
    implements OnInit
{
    public constructor(
        orderLineService: OrderLineService,
        public readonly productService: ProductService,
        public readonly subscriptionService: SubscriptionService,
    ) {
        super('orderLine', orderLineService);
    }
}
