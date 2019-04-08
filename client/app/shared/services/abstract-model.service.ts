import { Apollo } from 'apollo-angular';
import { Observable, of, OperatorFunction, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { Literal } from '../types';
import { DocumentNode } from 'graphql';
import { debounce, defaults, isArray, merge, mergeWith, omit, pick } from 'lodash';
import { Utility } from '../classes/utility';
import { FetchResult } from 'apollo-link';
import { QueryVariablesManager } from '../classes/query-variables-manager';
import { ExtendedFormControl } from '../classes/ExtendedFormControl';
import { ValidatorFn } from '@angular/forms';
import { AbstractController } from '../components/AbstractController';

export interface FormValidators {
    [key: string]: ValidatorFn[];
}

export interface VariablesWithInput {
    input: Literal;
}

export abstract class AbstractModelService<Tone,
    Vone,
    Tall,
    Vall,
    Tcreate,
    Vcreate extends VariablesWithInput,
    Tupdate,
    Vupdate extends { id: string; input: Literal; },
    Tdelete> {

    /**
     * Stores the debounced update function
     */
    protected debouncedUpdateCache = new Map<string, (object: Literal, resultObservable: Subject<Tupdate>) => void>();

    private creatingIdTmp = 1;

    /**
     * Store the creation mutations that are pending
     */
    private creatingCache: Literal = {};

    constructor(protected readonly apollo: Apollo,
                protected readonly name: string,
                protected oneQuery: DocumentNode | null,
                protected allQuery: DocumentNode | null,
                protected createMutation: DocumentNode | null,
                protected updateMutation: DocumentNode | null,
                protected deleteMutation: DocumentNode | null) {
    }

    public static mergeOverrideArray(dest, src) {
        if (isArray(src)) {
            return src;
        }
    }

    /**
     * Return empty object with some default values from server perspective
     *
     * This is typically useful when showing a form for creation
     */
    public getEmptyObject(): Vcreate['input'] | Vupdate['input'] {
        return {};
    }

    /**
     * Return empty object with some default values from frontend perspective
     *
     * Where empty object must respect graphql XXXInput type, may need some default values for other fields
     */
    public getDefaultValues(): Literal {
        return {};
    }

    /**
     * List of individual fields validators
     */
    public getFormValidators(): FormValidators {
        return {};
    }

    /**
     * List of grouped fields validators (like password + confirm password)
     */
    public getFormGroupValidators(): ValidatorFn[] {
        return [];
    }

    public getFormConfig(model: Literal): Literal {
        const values = Object.assign(this.getEmptyObject(), this.getDefaultValues());
        const validators = this.getFormValidators();
        const config = {};
        const disabled = model.permissions ? !model.permissions.update : false;

        if (model.id) {
            config['id'] = new ExtendedFormControl({value: model.id, disabled: true});
        }

        // Configure form for each field of model
        for (const key of Object.keys(values)) {
            const value = model[key] !== undefined ? model[key] : values[key];
            const formState = {
                value: value,
                disabled: disabled,
            };
            const validator = typeof validators[key] !== 'undefined' ? validators[key] : null;

            config[key] = new ExtendedFormControl(formState, validator);
        }

        // Configure form for extra validators that are not on a specific field
        for (const key of Object.keys(validators)) {
            if (!config[key]) {
                const formState = {
                    value: model[key] ? model[key] : null,
                    disabled: disabled,
                };

                config[key] = new ExtendedFormControl(formState, validators[key]);
            }
        }

        return config;
    }

    /**
     * Fetch an object
     */
    public getOne(id: string): Observable<Tone> {
        this.throwIfObservable(id);
        this.throwIfNotQuery(this.oneQuery);

        return this.apollo.query<Tone, Vone>({
            query: this.oneQuery,
            variables: this.getVariablesForOne(id),
        }).pipe(this.mapOne());
    }

    public watchOne(id: string): Observable<Tone> {
        this.throwIfObservable(id);
        this.throwIfNotQuery(this.oneQuery);

        const resultObservable = new Subject<Tone>();

        const queryRef = this.apollo.watchQuery<Tone, Vone>({
            query: this.oneQuery,
            variables: this.getVariablesForOne(id),
        });

        const subscription = queryRef
            .valueChanges
            .pipe(filter(r => !!r.data))
            .subscribe(result => {
                const data = result.data ? result.data[this.name] : result.data;
                resultObservable.next(data);
                if (result.networkStatus === 7) {
                    resultObservable.complete();
                    subscription.unsubscribe();
                }
            });

        return resultObservable.asObservable();
    }

    public getAll(queryVariablesManager: QueryVariablesManager<Vall>): Observable<Tall> {
        this.throwIfNotQuery(this.allQuery);

        const manager = new QueryVariablesManager<Vall>(queryVariablesManager); // "copy" qvm
        manager.merge('context', this.getContextForAll());

        return this.apollo.query<Tall, Vall>({
            query: this.allQuery,
            variables: manager.variables.value,
        }).pipe(this.mapAll());
    }

    /**
     * Watch query considering an observable variables set
     * Only sends query when variables are different of undefined.
     */
    public watchAll(queryVariablesManager: QueryVariablesManager<Vall>, expire: AbstractController['ngUnsubscribe']): Observable<Tall> {
        this.throwIfNotQuery(this.allQuery);

        // Expire all subscriptions when completed (when calling result.unsubscribe())
        let lastSubscription: Subscription | null = null;

        // Observable that wraps the result from apollo queryRef
        // const resultObservable = new ExpireSubject<Tall>();
        const resultObservable = new Subject<Tall>();

        const expireFn = () => {
            if (lastSubscription) {
                lastSubscription.unsubscribe();
                lastSubscription = null;
            }
        };

        expire.subscribe(expireFn);

        // Wait for variables to be defined (different from undefined)
        // Null is accepted value for "no variables"
        queryVariablesManager.variables.pipe(debounceTime(20), takeUntil(expire)).subscribe(variables => {

            if (typeof variables !== 'undefined') {

                expireFn();

                // Apply context from service
                // Copy manager to prevent to apply internal context to external QueryVariablesManager
                const manager = new QueryVariablesManager<Vall>(queryVariablesManager);
                manager.merge('context', this.getContextForAll());

                const lastQueryRef = this.apollo.watchQuery<Tall, Vall>({
                    query: this.allQuery,
                    variables: manager.variables.value,
                });

                // Subscription cause query to be sent
                // First run must occur after first variables changes to prevent duplicate query : with and without variables
                lastSubscription = lastQueryRef.valueChanges
                                               .pipe(filter(r => !!r.data), this.mapAll())
                                               .subscribe(result => resultObservable.next(result));
            }
        });

        return resultObservable.asObservable();
    }

    /**
     * This functions allow to fastly create or update objects.
     * Manages a "creation is pending" status, and update when creation is ready.
     * Uses regular update/updateNow and create methods.
     * Used mainly when editing multiple objects in same controller (like in editable arrays)
     */
    public createOrUpdate(object: Literal, now: boolean = false): Observable<Tcreate | Tupdate> {
        this.throwIfObservable(object);
        this.throwIfNotQuery(this.createMutation);
        this.throwIfNotQuery(this.updateMutation);

        // If creation is pending, listen to creation observable and when ready, fire update
        if (object.creatingId) {
            const resultObservable = new Subject<Tupdate>();
            this.creatingCache[object.creatingId].subscribe(createdItem => {
                this.update(createdItem).subscribe(updatedModel => {
                    resultObservable.next(updatedModel);
                    resultObservable.complete();
                });
            });

            return resultObservable;
        }

        // If object has Id, just save it
        if (object.id) {
            if (now) { // used mainly for tests, because lodash debounced used in update() does not work fine with fakeAsync and tick()
                return this.updateNow(object);
            } else {
                return this.update(object);
            }
        }

        // If object was not saving, and has no ID, create it

        // Increment temporary id and set it as object attribute "creatingId"
        this.creatingIdTmp++;
        const id = this.creatingIdTmp;
        object.creatingId = this.creatingIdTmp;
        this.creatingCache[id] = new Subject<Tcreate>(); // stores creating observable in a cache

        return this.create(object).pipe(map(newObject => {
            delete newObject['creatingId']; // remove temp id
            this.creatingCache[id].next(newObject); // update creating observable
            this.creatingCache[id].complete(); // unsubscribe everybody
            delete this.creatingCache[id]; // remove from cache

            return newObject;
        }));

    }

    /**
     * Create an object in DB and then refetch the list of objects
     * When creation starts, object receives an unique negative ID and the mutation observable is stored in a cache
     * When creation is ready, the cache is removed and the model received his real ID
     */
    public create(object: Vcreate['input']): Observable<Tcreate> {
        this.throwIfObservable(object);
        this.throwIfNotQuery(this.createMutation);

        const variables = merge({}, {input: this.getInput(object)}, this.getContextForCreation(object));
        const observable = new Subject<Tcreate>();

        this.apollo.mutate<Tcreate, Vcreate>({
            mutation: this.createMutation,
            variables: variables,
        }).subscribe(result => {
            this.apollo.getClient().reFetchObservableQueries();
            const newObject = this.mapCreation(result);
            observable.next(mergeWith(object, newObject, AbstractModelService.mergeOverrideArray));
            observable.complete();
        });

        return observable.asObservable(); // hide type Subject and prevent user to miss use .next() or .complete() functions
    }

    /**
     * Update an object
     */
    public update(object: Vupdate['input']): Observable<Tupdate> {
        this.throwIfObservable(object);
        this.throwIfNotQuery(this.updateMutation);

        const objectKey = this.getKey(object);

        // Keep a single instance of the debounced update function
        if (!this.debouncedUpdateCache[objectKey]) {

            // Create debounced update function
            this.debouncedUpdateCache[objectKey] = debounce((o: Literal, resultObservable: Subject<Tupdate>) => {
                this.updateNow(o).subscribe(data => {
                    resultObservable.next(data);
                    resultObservable.complete();
                });
            }, 2000); // Wait 2sec.
        }

        // Call debounced update function each time we call this update() function
        const result = new Subject<Tupdate>();
        this.debouncedUpdateCache[objectKey](object, result);

        // Return and observable that is updated when mutation is done
        return result;
    }

    /**
     * Update an object
     */
    public updateNow(object: Vupdate['input']): Observable<Tupdate> {
        this.throwIfObservable(object);
        this.throwIfNotQuery(this.updateMutation);

        const observable = new Subject<Tupdate>();
        const variables = merge({
            id: object.id as string,
            input: this.getInput(object),
        }, this.getContextForUpdate(object));

        this.apollo.mutate<Tupdate, Vupdate>({
            mutation: this.updateMutation,
            variables: variables,
        }).subscribe((result: any) => {
            this.apollo.getClient().reFetchObservableQueries();
            result = this.mapUpdate(result);
            mergeWith(object, result, AbstractModelService.mergeOverrideArray);
            observable.next(result);
            observable.complete(); // unsubscribe all after first emit, nothing more will come;
        });

        return observable.asObservable();  // hide type Subject and prevent user to miss use .next() or .complete() functions
    }

    /**
     * Accepts a partial input for an update mutation
     */
    public updatePartially(object) {
        this.throwIfObservable(object);
        this.throwIfNotQuery(this.updateMutation);

        const variables = {
            id: object.id as string,
            input: omit(Utility.relationsToIds(object), 'id'),
        } as Vupdate;

        return this.apollo.mutate<Tupdate, Vupdate>({
            mutation: this.updateMutation,
            variables: variables,
        }).pipe(map((result) => {
            this.apollo.getClient().reFetchObservableQueries();
            return this.mapUpdate(result);
        }));

    }

    /**
     * Delete objects and then refetch the list of objects
     */
    public delete(objects: { id: string; }[]): Observable<Tdelete> {
        this.throwIfObservable(objects);
        this.throwIfNotQuery(this.deleteMutation);

        const ids = objects.map(o => o.id);

        const observable = new Subject<Tdelete>();

        this.apollo.mutate<Tdelete, { ids: string[] }>({
            mutation: this.deleteMutation,
            variables: {
                ids: ids,
            },
        }).subscribe((result: any) => {
            this.apollo.getClient().reFetchObservableQueries();
            result = this.mapDelete(result);
            observable.next(result);
            observable.complete();
        });

        return observable.asObservable();
    }

    public mutate(mutation, variables: any): Observable<any> {

        const observable = new Subject();

        this.apollo.mutate<Tupdate, Vupdate>({
            mutation: mutation,
            variables: variables,
        }).subscribe((result: any) => {
            this.apollo.getClient().reFetchObservableQueries();
            result = this.mapUpdate(result);
            observable.next(result);
            observable.complete(); // unsubscribe all after first emit, nothing more will come;
        });

        return observable.asObservable();  // hide type Subject and prevent user to miss use .next() or .complete() functions
    }

    /**
     * Resolve model and items related to the model, if the id is provided, in order to show a form
     */
    public resolve(id: string): Observable<{ model: Tone }> {
        // Load model if id is given
        let observable;
        if (id) {
            observable = this.watchOne(id);
        } else {
            observable = of(this.getEmptyObject() as Tone);
        }

        return observable.pipe(map(result => {
            return {model: result};
        }));
    }

    /**
     * Get item key to be used as cache index : action-123
     */
    protected getKey(object: Literal) {

        if (!object.__typename) {
            return 'default' + '-' + object.id;
        }

        return object.__typename + '-' + object.id;
    }

    /**
     * This is used to extract only the fetched object out of the entire fetched data
     */
    protected mapOne(): OperatorFunction<FetchResult<Tone>, Tone> {
        return map((result) => {
            return result.data[this.name];
        });
    }

    /**
     * This is used to extract only the array of fetched objects out of the entire fetched data
     */
    protected mapAll(): OperatorFunction<FetchResult<any>, Tall> {
        const plural = Utility.makePlural(this.name);
        return map(result => {
            return result.data ? result.data[plural] : result.data;
        });
    }

    /**
     * This is used to extract only the created object out of the entire fetched data
     */
    protected mapCreation(result): OperatorFunction<FetchResult<any>, Tcreate> {
        const name = 'create' + Utility.upperCaseFirstLetter(this.name);
        return result.data[name];
    }

    /**
     * This is used to extract only the updated object out of the entire fetched data
     */
    protected mapUpdate(result): OperatorFunction<FetchResult<any>, Tupdate> {
        const name = 'update' + Utility.upperCaseFirstLetter(this.name);
        return result.data[name];
    }

    /**
     * This is used to extract only flag when deleting an object
     */
    protected mapDelete(result): OperatorFunction<FetchResult<any>, Tdelete> {
        const name = 'delete' + Utility.makePlural(Utility.upperCaseFirstLetter(this.name));
        return result.data[name];
    }

    /**
     * Return an object that match the GraphQL input type.
     * It creates an object with manually filled data and add uncompleted data (like required attributes that can be empty strings)
     */
    public getInput(object: Literal): Vcreate['input'] | Vupdate['input'] {

        // Convert relations to their IDs for mutation
        object = Utility.relationsToIds(object);

        // Pick only attributes that we can find in the empty object
        // In other words, prevent to select data that has unwanted attributes
        const emptyObject = this.getEmptyObject();
        let input = pick(object, Object.keys(emptyObject));

        // Complete a potentially uncompleted object with default values
        input = defaults(input, emptyObject);

        return input;
    }

    /**
     * Returns an additional context to be used in variables when getting a single object
     *
     * This is typically a site or state ID, and is needed to get appropriate access rights
     */
    protected getContextForOne(): Vone {
        return {} as Vone;
    }

    /**
     * Returns an additional context to be used in variables.
     *
     * This is typically a site or state ID, but it could be something else to further filter the query
     */
    protected getContextForAll(): Vall {
        return {} as Vall;
    }

    /**
     * Returns an additional context to be used when creating an object
     *
     * This is typically a site or state ID
     */
    protected getContextForCreation(object: Literal): Literal {
        return {} as Literal;
    }

    /**
     * Returns an additional context to be used when creating an object
     *
     * This is typically a site or state ID
     */
    protected getContextForUpdate(object: Literal): Literal {
        return {} as Literal;
    }

    /**
     * Throw exception to prevent executing null queries
     */
    protected throwIfObservable(value): void {
        if (value instanceof Observable) {
            throw new Error('Cannot use Observable as variables. Instead you should use .subscribe() to call the method with a real value');
        }
    }

    /**
     * Merge given ID with context if there is any
     */
    private getVariablesForOne(id: string): Vone {
        return merge({}, {id: id}, this.getContextForOne());
    }

    /**
     * Throw exception to prevent executing null queries
     */
    private throwIfNotQuery(query): void {
        if (!query) {
            throw new Error('GraphQL query for this method was not configured in this service constructor');
        }
    }

}
