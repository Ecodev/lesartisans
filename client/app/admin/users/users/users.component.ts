import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAbstractList, NaturalQueryVariablesManager, NaturalSearchSelections } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { EmailUsers, EmailUsersVariables, Users, UsersVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { copy } from '../../../shared/utils';
import { emailUsersQuery } from '../services/user.queries';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends NaturalAbstractList<Users['users'], UsersVariables> implements OnInit {

    public initialColumns = [
        'name',
        'login',
        'email',
        'creationDate',
        'updateDate',
        'membershipBegin',
        'membershipEnd',
    ];

    public usersEmail: string | null = null;
    public usersEmailAndName: string | null = null;

    constructor(route: ActivatedRoute,
                private userService: UserService,
                injector: Injector,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                private apollo: Apollo,
    ) {

        super(userService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get(this.route.snapshot.data.isAdmin ? 'usersAdmin' : 'usersFrontend');
    }

    public search(naturalSearchSelections: NaturalSearchSelections): void {
        this.usersEmail = null;
        this.usersEmailAndName = null;
        super.search(naturalSearchSelections);
    }

    public download(): void {

        if (this.apollo) {
            const qvm = new NaturalQueryVariablesManager(this.variablesManager);
            qvm.set('pagination', {pagination: {pageIndex: 0, pageSize: 9999}});
            qvm.set('emailFilter', {filter: {groups: [{conditions: [{email: {null: {not: true}}}]}]}} as UsersVariables);

            this.apollo.query<EmailUsers, EmailUsersVariables>({
                query: emailUsersQuery,
                variables: qvm.variables.value,
            }).subscribe(result => {
                this.usersEmail = result.data['users'].items.map(u => u.email).join(' ;,'); // all separators for different mailboxes
                this.usersEmailAndName = result.data['users'].items.map(u => [u.email, u.firstName, u.lastName].join(';')).join('\n');
            });
        }
    }

    public copy(data: string): void {
        copy(data);
    }

}
