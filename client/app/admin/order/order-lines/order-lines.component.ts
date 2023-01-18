import {Component, Injector, Input, OnInit} from '@angular/core';
import {NaturalAbstractList} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {OrderLineService} from '../services/order-lines.service';

@Component({
    selector: 'app-order-lines',
    templateUrl: './order-lines.component.html',
    styleUrls: ['./order-lines.component.scss'],
})
export class OrderLinesComponent extends NaturalAbstractList<OrderLineService> implements OnInit {
    /**
     *
     */
    @Input() public showTotals = false;

    /**
     * If true, hides natural search and transcluded components
     */
    @Input() public hideHeader = false;

    /**
     * If true, hides pagination
     */
    @Input() public hidePaginator = false;

    /**
     * Force page size
     */
    @Input() public paginatorPageSize?: number;

    /**
     * Override page size options list
     */
    @Input() public override pageSizeOptions = [5, 10, 25, 50, 100, 200];

    public constructor(
        service: OrderLineService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(service, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('orderLines');
    }
}
