import {Component, Injector, OnInit} from '@angular/core';
import {formatIsoDateTime, NaturalAbstractDetail, NaturalQueryVariablesManager} from '@ecodev/natural';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {UserService} from '../../../admin/users/services/user.service';
import {
    CurrentUserForProfile,
    Session,
    Sessions,
    SessionsVariables,
    UserRole,
    Users,
} from '../../../shared/generated-types';

@Component({
    selector: 'app-session-page',
    templateUrl: './session-page.component.html',
    styleUrls: ['./session-page.component.scss'],
})
export class SessionPageComponent extends NaturalAbstractDetail<SessionService> implements OnInit {
    /**
     * Session animators/facilitators
     */
    public facilitators: Users['users']['items'][0][] = [];

    /**
     * Other sessions in same place
     */
    public otherSessions: Sessions['sessions']['items'][0][] = [];

    /**
     * For template usage
     */
    public UserRole = UserRole;

    public viewer: CurrentUserForProfile['viewer'] = null;

    public constructor(
        private readonly sessionService: SessionService,
        injector: Injector,
        public readonly userService: UserService,
    ) {
        super('session', sessionService, injector);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer.model : null;

        this.route.data.subscribe(data => {
            if (data.session) {
                // this.refreshFacilitators(data.session.model);
                this.refreshOtherSessions(data.session.model);
            }
        });
    }

    /**
     * Fetch other future sessions (5 max) in same locality
     */
    private refreshOtherSessions(session: Session['session']): void {
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();
        qvm.set('variables', {
            filter: {
                groups: [
                    {
                        conditions: [
                            {locality: {in: {values: [session.locality]}}},
                            {id: {in: {values: [session.id], not: true}}},
                            {startDate: {greaterOrEqual: {value: formatIsoDateTime(new Date())}}},
                        ],
                    },
                ],
            },
            pagination: {pageSize: 5, pageIndex: 0},
        });
        this.service.getAll(qvm).subscribe(result => (this.otherSessions = result.items));
    }
}
