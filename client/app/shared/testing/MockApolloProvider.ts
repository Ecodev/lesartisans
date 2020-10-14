import {Injectable, NgZone} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {SchemaLink} from 'apollo-link-schema';
import {buildClientSchema} from 'graphql';
import {addMockFunctionsToSchema} from 'graphql-tools';
import {apolloDefaultOptions} from '../config/apolloDefaultOptions';
import {schema as introspectionResult} from './../../../../data/tmp/schema';

/**
 * A mock Apollo to be used in tests only
 */
@Injectable({
    providedIn: 'root',
})
class MockApollo extends Apollo {
    constructor(ngZone: NgZone) {
        super(ngZone);
        const mockClient = this.createMockClient();
        super.setClient(mockClient);
    }

    /**
     * This will create a fake ApolloClient who can responds to queries
     * against our real schema with random values
     */
    private createMockClient() {
        const schema = buildClientSchema(introspectionResult.data as any);

        // Configure hardcoded mocked values on a type basis.
        // That means all data will look be very similar, but at least
        // tests are robust and won't change if/when random generators
        // would be used differently
        const mocks = {
            ID: () => '456',
            Int: () => 1,
            Float: () => 0.5,
            String: () => 'test string',
            Boolean: () => true,
            Chronos: () => '2018-01-18T11:43:31',
            Date: () => '2018-02-27',
            Email: () => 'test@example.com',
            UserRole: () => 'member',
            CHF: () => '1.25',
            EUR: () => '1.25',
        };

        addMockFunctionsToSchema({schema, mocks});

        const apolloCache = new InMemoryCache();

        return new ApolloClient({
            cache: apolloCache,
            link: new SchemaLink({schema}),
            defaultOptions: apolloDefaultOptions,
        });
    }
}

/**
 * This is the only way to use our MockApollo
 */
export const mockApolloProvider = {
    provide: Apollo,
    useClass: MockApollo,
};
