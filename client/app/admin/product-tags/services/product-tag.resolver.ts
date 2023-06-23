import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {ProductTagResolve} from '../productTag';
import {ProductTagService} from './product-tag.service';

/**
 * Resolve productTag data for router
 */
export function resolveProductTag(route: ActivatedRouteSnapshot): Observable<ProductTagResolve> {
    const productTagService = inject(ProductTagService);
    const errorService = inject(ErrorService);
    const observable = productTagService.resolve(route.params.productTagId).pipe(last());

    return errorService.redirectIfError(observable);
}
