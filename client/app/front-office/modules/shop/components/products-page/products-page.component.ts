import {Component, Injector, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {fromUrl, memoryStorageProvider, NaturalPersistenceService} from '@ecodev/natural';
import {ProductTagService} from '../../../../../admin/product-tags/services/product-tag.service';
import {ProductService} from '../../../../../admin/products/services/product.service';
import {AbstractInfiniteLoadList} from '../../../../../shared/classes/AbstractInfiniteLoadList';
import {Products, Products_products_items, ProductsVariables} from '../../../../../shared/generated-types';

export enum ProductsViewMode {
    grid = 'grid',
    list = 'list',
}

@Component({
    selector: 'app-products-page',
    templateUrl: './products-page.component.html',
    styleUrls: ['./products-page.component.scss'],
    providers: [
        // Provide a NaturalPersistenceService instance only for this component,
        // but with a memoryStorage to avoid storing pagination in session and
        // keep it only in URL instead
        {
            provide: NaturalPersistenceService,
            useClass: NaturalPersistenceService,
        },
        memoryStorageProvider,
    ],
})
export class ProductsPageComponent
    extends AbstractInfiniteLoadList<Products['products'], ProductsVariables>
    implements OnInit {
    /**
     * If true, the three first items of grid have highlighted layout
     */
    @Input() highlightFirstItems = true;

    /**
     * Display tags over products
     * Configurable by routing
     */
    public showTagsOnProducts = true;

    /**
     * Display tag navigation
     * Configurable by routing
     */
    public showTagsNavigation = true;

    /**
     * Display as grid or as list
     */
    public viewMode: ProductsViewMode = ProductsViewMode.grid;

    /**
     * Items to display
     */
    public products: Products_products_items[] = [];

    /**
     * Page main title
     */
    public title: string;

    /**
     * Template access
     */
    public ProductsViewMode = ProductsViewMode;

    /**
     * Pagination with page size as multiple of 3 to end correctly before "show more" button.
     */
    public defaultPagination = {pageSize: 12, pageIndex: 0, offset: null};

    constructor(
        public route: ActivatedRoute,
        productService: ProductService,
        injector: Injector,
        public productTagService: ProductTagService,
    ) {
        super(productService, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.title = this.route.snapshot.params.productTagName || this.route.snapshot.data.title;

        this.route.data.subscribe(data => {
            this.showTagsOnProducts = !!data.showTagsOnProducts;
            this.showTagsNavigation = !!data.showTagsNavigation;
            this.viewMode = data.viewMode || ProductsViewMode.grid;

            if (data.productTag && data.productTag.model) {
                this.pagination({offset: null, pageIndex: 0, pageSize: 10});
                this.variablesManager.set('category', {
                    filter: {groups: [{conditions: [{productTags: {have: {values: [data.productTag.model.id]}}}]}]},
                });
            }
        });

        this.route.params.subscribe(params => {
            if (params['ns']) {
                this.search(fromUrl(this.persistenceService.getFromUrl('ns', this.route)));
            }
        });
    }

    public getDetailLink(product) {
        return ['/larevuedurable', product.reviewNumber ? 'numero' : 'article', product.id];
    }
}
