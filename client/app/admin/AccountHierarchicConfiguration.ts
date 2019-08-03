import { AccountService } from './accounts/services/account.service';
import { AccountType } from '../shared/generated-types';
import { NaturalHierarchicConfiguration } from '@ecodev/natural';

export const accountHierarchicConfiguration: NaturalHierarchicConfiguration[] = [
    {
        service: AccountService,
        parentsFilters: ['parent'],
        childrenFilters: ['parent'],
        selectableAtKey: 'account',
        isSelectableCallback: (account) => account.type !== AccountType.group
    },
];

