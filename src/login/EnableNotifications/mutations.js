import gql from 'graphql-tag';

export const UPDATE_PROFILE = gql`
    mutation updateDetails($firstName:String!, $lastName:String!, $gender: String!, $birthDate: String!) {
        updateProfileFields(
        input: [
            { field: FirstName, value: $firstName }
            { field: LastName, value: $lastName }
            { field: Gender, value: $gender }
            { field: BirthDate, value: $birthDate }
        ]
        ) {
            firstName
        lastName
        gender
        birthDate
        id
        }
    }
`