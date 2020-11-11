import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Literal, NaturalAbstractModelService} from '@ecodev/natural';
import {map} from 'rxjs/operators';
import {
    CreateOrder,
    CreateOrderVariables,
    Order,
    Orders,
    OrderStatus,
    OrdersVariables,
    OrderVariables,
    UpdateOrderStatus,
    UpdateOrderStatusVariables,
} from '../../../shared/generated-types';
import {OrderLineService} from './order-lines.service';
import {createOrder, orderQuery, ordersQuery, updateOrderStatus} from './order.queries';

@Injectable({
    providedIn: 'root',
})
export class OrderService extends NaturalAbstractModelService<
    Order['order'],
    OrderVariables,
    Orders['orders'],
    OrdersVariables,
    CreateOrder['createOrder'],
    CreateOrderVariables,
    any,
    any,
    any,
    any
> {
    constructor(apollo: Apollo, private orderLineService: OrderLineService) {
        super(apollo, 'order', orderQuery, ordersQuery, createOrder, null, null);
    }

    public getInput(object: Literal) {
        const orderLinesInput = object.orderLines.map((line: Literal) => this.orderLineService.getInput(line));
        object.orderLines = orderLinesInput;

        return object;
    }

    public changeStatus(id: string, status: OrderStatus) {
        return this.apollo
            .mutate<UpdateOrderStatus, UpdateOrderStatusVariables>({
                mutation: updateOrderStatus,
                variables: {id, status},
            })
            .pipe(
                map(result => {
                    this.apollo.client.reFetchObservableQueries();
                    return result;
                }),
            );
    }
}
