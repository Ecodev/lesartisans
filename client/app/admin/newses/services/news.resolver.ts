import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {NewsResolve} from '../news';
import {NewsService} from './news.service';

@Injectable({
    providedIn: 'root',
})
export class NewsResolver implements Resolve<NewsResolve> {
    constructor(private productService: NewsService, private errorService: ErrorService) {}

    /**
     * Resolve product data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<NewsResolve> {
        const observable = this.productService.resolve(route.params.newsId);

        return this.errorService.redirectIfError(observable);
    }
}
