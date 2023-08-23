import {Component, OnInit} from '@angular/core';
import {
    IEnum,
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalEnumPipe,
    NaturalFixedButtonDetailComponent,
    NaturalRelationsComponent,
    NaturalSelectEnumComponent,
    NaturalSeoResolveData,
    NaturalStampComponent,
    NaturalSwissDatePipe,
    NaturalTableButtonComponent,
    NaturalTimeAgoPipe,
} from '@ecodev/natural';
import {UserRole} from '../../../shared/generated-types';
import {SessionService} from '../../sessions/services/session.service';
import {UserService} from '../services/user.service';
import {RouterOutlet} from '@angular/router';
import {OrdersComponent} from '../../order/orders/orders.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AddressComponent} from '../../../shared/components/address/address.component';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        CommonModule,
        MatToolbarModule,
        MatTabsModule,
        FlexModule,
        AddressComponent,
        MatFormFieldModule,
        MatInputModule,
        NaturalSelectEnumComponent,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDividerModule,
        NaturalRelationsComponent,
        NaturalTableButtonComponent,
        NaturalStampComponent,
        OrdersComponent,
        NaturalFixedButtonDetailComponent,
        RouterOutlet,
        NaturalEnumPipe,
        NaturalSwissDatePipe,
        NaturalTimeAgoPipe,
    ],
})
export class UserComponent extends NaturalAbstractDetail<UserService, NaturalSeoResolveData> implements OnInit {
    public UserService = UserService;
    private userRolesAvailable: UserRole[] = [];

    public constructor(
        private readonly userService: UserService,
        public readonly sessionService: SessionService,
    ) {
        super('user', userService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        // Disable fields that should be imported from Cresus
        ['phone', 'membership'].forEach(path => {
            const control = this.form.get(path);
            if (control) {
                control.disable();
            }
        });
    }

    protected override initForm(): void {
        super.initForm();

        this.userService.getUserRolesAvailable(this.data.model).subscribe(userRoles => {
            this.userRolesAvailable = userRoles;
        });
    }

    public roleDisabled(): (item: IEnum) => boolean {
        return item => {
            return !this.userRolesAvailable.includes(item.value as UserRole);
        };
    }
}
