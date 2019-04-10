import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { FamilyComponent } from './components/family/family.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { FinancesComponent } from './components/finances/finances.component';
import { ServicesComponent } from './components/services/services.component';
import { CreateExpenseClaimComponent } from './components/create-expense-claim/create-expense-claim.component';
import { ServicesGuard } from '../shared/services/services.guard';

const routes: Routes = [
    {
        path: '',
        resolve: {viewer: ViewerResolver},
        children: [
            {
                path: '',
                component: ProfileComponent,
                children: [
                    {
                        path: '',
                        component: BookingHistoryComponent,
                    },
                    {
                        path: 'family',
                        component: FamilyComponent,
                    },
                    {
                        path: 'finances',
                        component: FinancesComponent,
                    },
                    {
                        path: 'services',
                        component: ServicesComponent,
                        canActivate: [ServicesGuard],
                    },
                ],
            }, {
                path: 'create-expense-claim',
                component: CreateExpenseClaimComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {
}
