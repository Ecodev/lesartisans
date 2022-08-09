import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {EventResolve} from '../event';
import {EventService} from './event.service';

@Injectable({
    providedIn: 'root',
})
export class EventResolver implements Resolve<EventResolve> {
    public constructor(private readonly productService: EventService, private readonly errorService: ErrorService) {}

    /**
     * Resolve product data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<EventResolve> {
        const observable = this.productService.resolve(route.params.eventId).pipe(last());

        return this.errorService.redirectIfError(observable);
    }
}
