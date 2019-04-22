import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    NaturalAlertModule,
    NaturalColumnsPickerModule,
    NaturalCommonModule,
    NaturalDetailHeaderModule,
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
import { ParticleEffectButtonModule } from '@sambaptista/angular-particle-effect-button';
import { ngfModule } from 'angular-file';
import { AvatarModule } from 'ngx-avatar';
import { TimeagoModule } from 'ngx-timeago';
import { AccountingDocumentsComponent } from '../../admin/accounting-documents/accounting-documents.component';
import { AddressComponent } from '../components/address/address.component';
import { CardComponent } from '../components/card/card.component';
import { FileComponent } from '../components/file/file.component';
import { FileDropDirective } from '../components/file/services/file-drop.directive';
import { MoneyComponent } from '../components/money/money.component';
import { ParticleSwitchComponent } from '../components/particle-switch/particle-switch.component';
import { TransactionAmountComponent } from '../components/transaction-amount/transaction-amount.component';
import { FocusDirective } from '../directives/focus';
import { MaterialModule } from './material.module';

const iconsConfig: NaturalIconsConfig = {
    'qr': {
        svg: 'assets/icons/qr.svg',
    },
    'simple-qr': {
        svg: 'assets/icons/simple-qr.svg',
    },
    'own_product': {
        svg: 'assets/icons/swimsuit.svg',
    },
    'code': {
        svg: 'assets/icons/input.svg',
    },
    'doors': {
        svg: 'assets/icons/key.svg',
    },
    'family': {
        svg: 'assets/icons/family.svg',
    },
    'lake': {
        svg: 'assets/icons/lake.svg',
    },
    'transactionHistory': {
        svg: 'assets/icons/history.svg',
    },
    'claims': {
        svg: 'assets/icons/claims.svg',
    },
    'finances': {
        svg: 'assets/icons/notes.svg',
    },
    'browse_products': {
        svg: 'assets/icons/search.svg',
    },
    'administrator': {
        svg: 'assets/icons/boss.svg',
    },
    'exit': {
        svg: 'assets/icons/exit.svg',
    },
    'emmy': {
        svg: 'assets/logo.svg',
    },
    'shop': {
        svg: 'assets/icons/grocery.svg',
    },
};

const declarations = [
    AddressComponent,
    MoneyComponent,
    FocusDirective,
    CardComponent,
    FileDropDirective,
    FileComponent,
    TransactionAmountComponent,
    AccountingDocumentsComponent,
    ParticleSwitchComponent,
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
];

@NgModule({
    declarations: [...declarations],
    imports: [
        ...imports,
        NaturalIconModule.forRoot(iconsConfig),
    ],
    exports: [...imports, ...declarations, TimeagoModule, NaturalIconModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [],
})
export class EmmyModule {
}
