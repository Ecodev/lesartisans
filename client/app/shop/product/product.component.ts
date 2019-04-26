import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService } from '../../admin/products/services/product.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

    public CartService = CartService;
    public data: any;
    public quantityForm = new FormControl(1, [Validators.required, Validators.min(0)]);
    public edit = false;
    public price;
    private routeSnapshot;

    constructor(@Inject(MAT_DIALOG_DATA) data: any,
                private cartService: CartService,
                productService: ProductService,
                private router: Router) {

        this.routeSnapshot = data.routeSnapshot;
        this.data = {model: this.routeSnapshot.data.product.model}; // to respect our template standard

        if (this.data.model) {
            if (this.routeSnapshot.params.quantity) {
                this.edit = true;
                this.quantityForm.setValue(this.routeSnapshot.params.quantity);
            }

            this.computePrice();
            this.quantityForm.valueChanges.subscribe(() => this.computePrice(true));

            // Fetch permissions if they are missing
            if (!this.data.model.permissions) {
                productService.getOne(this.data.model.id).subscribe(productWithPermissions => this.data.model = productWithPermissions);
            }
        }

    }

    ngOnInit() {
    }

    public computePrice(skipFormat = false) {

        if (!skipFormat) {
            const qty = +this.quantityForm.value;
            if (!this.data.model.unit && Math.floor(qty) !== qty) {
                this.quantityForm.setValue(Math.round(qty));
            }
        }

        this.price = CartService.getPriceTaxInc(this.data.model, this.quantityForm.value);
    }

    public addToCart() {
        this.cartService.add(this.data.model, this.quantityForm.value);
        this.router.navigateByUrl('/');
    }

    public updateCart() {
        this.cartService.setQuantity(this.data.model, +this.quantityForm.value);
        this.router.navigateByUrl('/');
    }

    public removeFromCart() {
        this.cartService.remove(this.data.model);
        this.router.navigateByUrl('/');
    }

    public increase() {
        this.quantityForm.setValue(+this.quantityForm.value + 1);
        this.quantityForm.markAsDirty();
    }

    public decrease() {
        const value = +this.quantityForm.value - 1;
        this.quantityForm.setValue(value < 0 ? 0 : value);
        this.quantityForm.markAsDirty();

    }

}
