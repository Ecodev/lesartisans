import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    NaturalAlertModule,
    NaturalColumnsPickerModule,
    NaturalCommonModule,
    NaturalDetailHeaderModule, NaturalDialogTriggerModule,
    NaturalDropdownComponentsModule,
    NaturalFixedButtonDetailModule,
    NaturalFixedButtonModule,
    NaturalHierarchicSelectorModule,
    NaturalIconModule,
    NaturalIconsConfig,
    NaturalRelationsModule,
    NaturalSearchModule,
    NaturalSelectEnumModule,
    NaturalSelectModule,
    NaturalSidenavModule,
    NaturalStampModule,
    NaturalTableButtonModule,
} from '@ecodev/natural';
import { ngfModule } from 'angular-file';
import { ParticleEffectButtonModule } from 'angular-particle-effect-button';
import { AvatarModule } from 'ngx-avatar';
import { ProductsComponent } from '../../admin/products/products/products.component';
import { UsersComponent } from '../../admin/users/users/users.component';
import { AddressComponent } from '../components/address/address.component';
import { CardComponent } from '../components/card/card.component';
import { FileComponent } from '../components/file/file.component';
import { FileDropDirective } from '../components/file/services/file-drop.directive';
import { MoneyComponent } from '../components/money/money.component';
import { ParticleSwitchComponent } from '../components/particle-switch/particle-switch.component';
import { PriceComponent } from '../components/price/price.component';
import { ProductTagsNavigationComponent } from '../components/product-tags-navigation/product-tags-navigation.component';
import { FocusDirective } from '../directives/focus';
import { MaterialModule } from './material.module';

const iconsConfig: NaturalIconsConfig = {
    qr: {
        svg: 'assets/icons/qr.svg',
    },
    'simple-qr': {
        svg: 'assets/icons/simple-qr.svg',
    },
    own_product: {
        svg: 'assets/icons/swimsuit.svg',
    },
    code: {
        svg: 'assets/icons/input.svg',
    },
    doors: {
        svg: 'assets/icons/key.svg',
    },
    family: {
        svg: 'assets/icons/family.svg',
    },
    lake: {
        svg: 'assets/icons/lake.svg',
    },
    transactionHistory: {
        svg: 'assets/icons/history.svg',
    },
    claims: {
        svg: 'assets/icons/claims.svg',
    },
    finances: {
        svg: 'assets/icons/notes.svg',
    },
    browse_products: {
        svg: 'assets/icons/search.svg',
    },
    administrator: {
        svg: 'assets/icons/boss.svg',
    },
    exit: {
        svg: 'assets/icons/exit.svg',
    },
    shop: {
        svg: 'assets/icons/grocery.svg',
    },
    product: {
        svg: 'assets/icons/product.svg',
    },
    members: {
        svg: 'assets/icons/members.svg',
    },
    purchase_status_to_order: {
        svg: 'assets/icons/priority-normal.svg',
        class: 'negative',
    },
    purchase_status_preordered: {
        font: 'done',
        class: 'neutral',
    },
    purchase_status_ordered: {
        font: 'done_all',
        class: 'positive',
    },
    stock_change: {
        font: 'trending_up',
    },
};

const declarations = [
    AddressComponent,
    MoneyComponent,
    FocusDirective,
    CardComponent,
    FileDropDirective,
    FileComponent,
    ParticleSwitchComponent,
    UsersComponent,
    ProductsComponent,
    ProductTagsNavigationComponent,
    PriceComponent,
];

const imports = [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AvatarModule,
    ngfModule,
    ParticleEffectButtonModule,
    NaturalSearchModule,
    NaturalCommonModule,
    NaturalHierarchicSelectorModule,
    NaturalSidenavModule,
    NaturalSelectModule,
    NaturalRelationsModule,
    NaturalAlertModule,
    NaturalColumnsPickerModule,
    NaturalSelectEnumModule,
    NaturalStampModule,
    NaturalDetailHeaderModule,
    NaturalTableButtonModule,
    NaturalFixedButtonModule,
    NaturalFixedButtonDetailModule,
    NaturalDropdownComponentsModule,
    NaturalDialogTriggerModule
];

@NgModule({
    declarations: [...declarations],
    imports: [
        ...imports,
        NaturalIconModule.forRoot(iconsConfig),
    ],
    exports: [...imports, ...declarations, NaturalIconModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [],
})
export class ArtisansModule {
}
