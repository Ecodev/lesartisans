import { Injectable } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { Relationship, UserRole } from '../../../shared/generated-types';
import { FormValidators } from '@ecodev/natural';
import { CartService } from '../../../shop/services/cart.service';

@Injectable({
    providedIn: 'root',
})
export class FamilyUserService extends UserService {

    constructor(apollo: Apollo,
                router: Router,
                permissionsService: PermissionsService,
                cartService: CartService,
    ) {
        super(apollo, router, permissionsService, cartService);
    }

    protected getDefaultForClient() {
        return {
            role: UserRole.individual,
            termsAgreement: false,
            familyRelationship: Relationship.partner,
        };
    }

    public getFormValidators(): FormValidators {

        const validators = {
            termsAgreement: [],
            locality: [],
            street: [],
            postcode: [],
        };

        return Object.assign(super.getFormValidators(), validators);
    }
}
