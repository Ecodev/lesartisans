import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewerResolver} from './admin/users/services/viewer.resolver';
import {FrontOfficeComponent} from './front-office/front-office.component';

export const routes: Routes = [
    {path: 'shell', component: FrontOfficeComponent},
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    },
    {
        // Registration
        path: 'user',
        component: FrontOfficeComponent,
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    },
    {
        path: '',
        component: FrontOfficeComponent,
        loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            paramsInheritanceStrategy: 'always',
            scrollPositionRestoration: 'top',
            relativeLinkResolution: 'legacy',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
