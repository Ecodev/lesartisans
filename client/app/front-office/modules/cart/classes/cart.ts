import Decimal from 'decimal.js';
import {
    Product_product,
    Products_products_items,
    ProductType,
    Subscription_subscription,
    Subscriptions_subscriptions_items,
} from '../../../../shared/generated-types';
import {Currency} from '../../../../shared/services/currency.service';
import {moneyRoundUp} from '../../../../shared/utils';
import {CartCollectionService} from '../services/cart-collection.service';

export type CartLineProduct = Products_products_items | Product_product;

export type CartLineSubscription = Subscriptions_subscriptions_items | Subscription_subscription;

export interface CartLine {
    /**
     * Related product
     */
    product: CartLineProduct;

    /**
     * Type (paper/web) of product added to cart
     */
    type: ProductType;

    /**
     * Number of instances of given product added to cart
     */
    quantity: number;

    /**
     * Total in current currency
     */
    totalTaxInc: number;
}

export class Cart {
    /**
     * Cart detail
     */
    public productLines: CartLine[] = [];

    /**
     * Total including taxes
     */
    public totalTaxInc = 0;

    /**
     * Single donation amount
     */
    public donationAmount = 0;

    /**
     * Single subscription setup
     */
    public subscription: null | {subscription: CartLineSubscription; emails?: string[]; type: ProductType} = null;

    /**
     * Cart identification
     */
    private readonly _id: number;

    /**
     * On new cart, never recover from session storage
     * @param id Use id param only for global cart
     */
    public constructor(private readonly cartCollectionService: CartCollectionService, id?: number) {
        this._id = id ?? this.cartCollectionService.length;
        this.cartCollectionService.add(this);
    }

    public get id(): number {
        return this._id;
    }

    private getPriceTaxInc(
        product: {pricePerUnitCHF: Decimal.Value; pricePerUnitEUR: Decimal.Value},
        quantity: number,
    ): number {
        const quantifiedPrice = Decimal.mul(this.getPriceByCurrency(product), quantity);
        return moneyRoundUp(+quantifiedPrice);
    }

    private getPriceByCurrency(product: {
        pricePerUnitCHF: Decimal.Value;
        pricePerUnitEUR: Decimal.Value;
    }): Decimal.Value {
        const currency = this.cartCollectionService.currency;
        if (currency === Currency.CHF) {
            return product.pricePerUnitCHF;
        } else if (currency === Currency.EUR) {
            return product.pricePerUnitEUR;
        }

        throw new Error('Unsupported currency: ' + currency);
    }

    public update() {
        this.computeTotals();
        this.cartCollectionService.persist(this);
    }

    /**
     * Add product to cart or increase quantity of existing product
     * Return true if the product is inserted into cart (opposed to increment from already existing in cart)
     */
    public addProduct(product: CartLineProduct, type: ProductType, quantity: number = 1): boolean {
        let isNewItem = false;
        const line = this.getLineByProduct(product, type);

        if (line) {
            line.quantity += quantity;
            line.totalTaxInc = this.getPriceTaxInc(product, line.quantity);
        } else {
            isNewItem = true;
            this.productLines.push({
                product: product,
                type: type,
                quantity: quantity,
                totalTaxInc: this.getPriceTaxInc(product, quantity),
            });
        }

        this.update();

        return isNewItem;
    }

    public removeProduct(product: CartLineProduct, type: ProductType, quantity: number) {
        const line = this.getLineByProduct(product, type);

        if (line) {
            const newQuantity = line.quantity - quantity;

            if (newQuantity <= 0) {
                // If quantity is falsey, remove from cart
                this.remove(product);
            } else {
                // If product exist and quantity is truey, update existing entry
                line.quantity = newQuantity;
                line.totalTaxInc = this.getPriceTaxInc(line.product, line.quantity);
            }
        }

        this.update();
    }

    /**
     * A subscription is a standalone buy. There can't be more than one, and should not share order with products
     */
    public setSubscription(subscription: CartLineSubscription, type: ProductType, emails?: string[]) {
        this.subscription = {subscription, type, emails};
        this.update();
    }

    public unsetSubscription() {
        this.subscription = null;
        this.update();
    }

    /**
     * A donation is a unique amount in an order.
     */
    public setDonation(value: number) {
        this.donationAmount = value;
        this.update();
    }

    public unsetDonation() {
        this.donationAmount = 0;
        this.update();
    }

    /**
     * Return a line from cart where product, quantity are identical
     */
    public getLineByProduct(product: CartLineProduct, type: ProductType): CartLine | undefined {
        return this.productLines.find(line => line.product.id === product.id && line.type === type);
    }

    public remove(product: CartLineProduct) {
        const index = this.productLines.findIndex(line => line.product.id === product.id);
        this.productLines.splice(index, 1);
        this.update();
    }

    public empty() {
        this.productLines = [];
        this.donationAmount = 0;
        this.subscription = null;
        this.update();
    }

    public setLines(lines: CartLine[]) {
        this.productLines = lines;
        this.computeTotals();
    }

    public computeTotals() {
        let totals = this.productLines.reduce((a, line) => {
            line.totalTaxInc = this.getPriceTaxInc(line.product, line.quantity); // update line total
            return a + line.totalTaxInc; // stack for cart total
        }, 0);

        if (this.subscription) {
            totals += this.getPriceTaxInc(this.subscription.subscription, 1);
        }

        if (this.donationAmount > 0) {
            totals += this.donationAmount;
        }

        this.totalTaxInc = totals;
    }

    public isEmpty(): boolean {
        return !this.productLines.length && !this.subscription && !this.donationAmount;
    }
}
