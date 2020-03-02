import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderModule } from '../admin/order/order.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';
import { AccountComponent } from './components/account/account.component';
import { HistoryComponent } from './components/history/history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
    declarations: [
        ProfileComponent,
        HistoryComponent,
        PurchasesComponent,
        AccountComponent,
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MaterialModule,
        ArtisansModule,
        OrderModule,
    ],
    exports: [],
})
export class ProfileModule {
}
