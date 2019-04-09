import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from '../../admin/users/services/user.service';

@Injectable({
    providedIn: 'root',
})
export class AdministrationGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) {
    }

    /**
     * Return if route is allowed or not considering the authenticated user.
     * Used by routing service.
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.userService.resolveViewer().pipe(map(user => {

            const granted = UserService.canAccessAdmin(user.model);

            if (!granted) {
                this.router.navigate(['/']);
                return false;
            }

            return true;
        }));
    }
}
