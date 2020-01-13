import gql from 'graphql-tag';
import { permissionsFragment, userMetaFragment } from '../../../shared/queries/fragments';

// Fragment for single display usage. Too much data for listings, and unused fields for mutations.
export const userFieldsFragment = gql`
    fragment userFields on User {
        id
        login
        firstName
        lastName
        name
        email
        phone
        postcode
        street
        locality
        country {
            id
            name
            code
        }
        role
        code
        membershipBegin
        membershipEnd
        url
        firstLogin
        lastLogin
        internalRemarks
        owner {
            id
            name
            email
        }
        creationDate
        creator {
            ...userMeta
        }
        updateDate
        updater {
            ...userMeta
        }
    }
`;

export const usersQuery = gql`
    query Users($filter: UserFilter, $sorting: [UserSorting!], $pagination: PaginationInput) {
        users(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                login
                code
                name
                updateDate
                creationDate
                email
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const emailUsersQuery = gql`
    query EmailUsers($filter: UserFilter, $sorting: [UserSorting!], $pagination: PaginationInput) {
        users(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

export const userQuery = gql`
    query User($id: UserID!) {
        user(id: $id) {
            ...userFields
            permissions {
                ...permissions
            }
        }
    }
    ${userFieldsFragment}
    ${userMetaFragment}
    ${permissionsFragment}
`;

export const userByTokenQuery = gql`
    query UserByToken($token: Token!) {
        userByToken(token: $token) {
            ...userFields
        }
    }
    ${userFieldsFragment}
    ${userMetaFragment}
`;

export const updateUser = gql`
    mutation UpdateUser($id: UserID!, $input: UserPartialInput!) {
        updateUser(id:$id, input:$input) {
            id
            name
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const createUser = gql`
    mutation CreateUser ($input: UserInput!) {
        createUser (input: $input) {
            id
            name
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const logoutMutation = gql`
    mutation Logout {
        logout
    }`;

export const loginMutation = gql`
    mutation Login($login: Login!, $password: String!) {
        login(login:$login, password:$password) {
            ...userFields
        }
    }
    ${userFieldsFragment}
    ${userMetaFragment}
`;

export const currentUserForProfileQuery = gql`
    query CurrentUserForProfile {
        viewer {
            ...userFields
        }
    }
    ${userFieldsFragment}
    ${userMetaFragment}
`;

export const nextCodeAvailableQuery = gql`
    query NextUserCode {
        nextUserCode
    }
`;

export const unregisterMutation = gql`
    mutation Unregister($id: UserID!) {
        unregister(id: $id)
    }
`;

