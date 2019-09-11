import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NaturalAbstractList } from '@ecodev/natural';
import { Product, Products, ProductsVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { CreateStockMovementComponent } from '../../stockMovement/create-stock-movement/create-stock-movement.component';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends NaturalAbstractList<Products['products'], ProductsVariables> implements OnInit {

    public initialColumns = [
        'image',
        'name',
        'code',
        'supplierPrice',
        'pricePerUnit',
        'quantity',
        'changeQuantity',
        'verificationDate',
    ];

    constructor(route: ActivatedRoute,
                productService: ProductService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector,
                private dialog: MatDialog,
    ) {

        super(productService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get(route.snapshot.data.isAdmin ? 'productsAdmin' : 'productsFrontend');
    }

    createStockMovement(product: Product['product']): void {
        const config = {data: {product: product}};
        this.dialog.open(CreateStockMovementComponent, config).afterClosed().subscribe(newStockMovement => {
            if (newStockMovement) {
                this.alertService.info('Stock modifié');
            }
        });
    }
}
