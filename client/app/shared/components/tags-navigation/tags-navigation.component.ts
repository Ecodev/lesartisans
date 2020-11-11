import {Component, Input, OnInit} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {ProductTagService} from '../../../admin/product-tags/services/product-tag.service';
import {ProductTags_productTags_items, ProductTagsVariables} from '../../generated-types';

@Component({
    selector: 'app-tags-navigation',
    templateUrl: './tags-navigation.component.html',
    styleUrls: ['./tags-navigation.component.scss'],
})
export class TagsNavigationComponent implements OnInit {
    /**
     * Items to list
     */
    @Input() public items: ProductTags_productTags_items[] = [];

    /**
     * Service to use to get items
     */
    @Input() public service!: ProductTagService;

    /**
     * Url base
     */
    @Input() linkBase: any[] = [];

    constructor() {}

    ngOnInit() {
        if (this.service) {
            const qvm = new NaturalQueryVariablesManager<ProductTagsVariables>();
            this.service.getAll(qvm).subscribe(result => {
                this.items = result.items;
            });
        }
    }

    getLink(item: ProductTags_productTags_items) {
        return [...this.linkBase, item.name];
    }
}
