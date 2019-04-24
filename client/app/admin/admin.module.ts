import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarModule } from 'ngx-avatar';
import { ProfileModule } from '../profile/profile.module';
import { EmmyModule } from '../shared/modules/emmy.module';
import { MaterialModule } from '../shared/modules/material.module';
import { AccountComponent } from './accounts/account/account.component';
import { AccountsComponent } from './accounts/accounts/accounts.component';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { ExpenseClaimComponent } from './expenseClaim/expenseClaim/expenseClaim.component';
import { ExpenseClaimsComponent } from './expenseClaim/expenseClaims/expenseClaims.component';
import { ProductMetadataComponent } from './product-metadata/product-metadata.component';
import { ProductComponent } from './products/product/product.component';
import { ProductsComponent } from './products/products/products.component';
import { ProductTagComponent } from './productTags/productTag/productTag.component';
import { ProductTagsComponent } from './productTags/productTags/productTags.component';
import { EditableTransactionLinesComponent } from './transactions/editable-transaction-lines/editable-transaction-lines.component';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { TransactionLinesComponent } from './transactions/transactionLines/transaction-lines.component';
import { TransactionTagComponent } from './transactionTags/transactionTag/transactionTag.component';
import { TransactionTagsComponent } from './transactionTags/transactionTags/transactionTags.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';

@NgModule({
    declarations: [
        ProductsComponent,
        ProductComponent,
        AdminComponent,
        UsersComponent,
        UserComponent,
        UserTagsComponent,
        UserTagComponent,
        ProductTagsComponent,
        ProductTagComponent,
        TransactionComponent,
        TransactionLinesComponent,
        AccountsComponent,
        AccountComponent,
        ExpenseClaimsComponent,
        ExpenseClaimComponent,
        TransactionTagsComponent,
        TransactionTagComponent,
        EditableTransactionLinesComponent,
        ProductMetadataComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MaterialModule,
        EmmyModule,
        AvatarModule,
        ProfileModule,
    ],
    entryComponents: [],
})
export class AdminModule {
}
