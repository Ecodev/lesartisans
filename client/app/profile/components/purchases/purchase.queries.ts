import gql from 'graphql-tag';

export const purchasesQuery = gql`
    query Purchases($filter: ProductFilter, $sorting: [ProductSorting!], $pagination: PaginationInput) {
        purchases(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                type
                product {
                    id
                    name
                    code
                    reviewNumber
                    image {
                        id
                        width
                        height
                        mime
                    }
                    file {
                        id
                        mime
                    }
                }
            }
            pageSize
            pageIndex
            length
        }
    }`;


