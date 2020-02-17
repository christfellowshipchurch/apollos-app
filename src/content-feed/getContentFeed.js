import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getContentFeed($itemId: ID!, $after: String, $first: Int) {
    node(id: $itemId) {
      ... on ContentChannel {
        childContentItemsConnection(after: $after, first: $first) {
          pageInfo {
            endCursor
          }
          edges {
            node {
              ...contentCardFragment
              ...accessoryFragment
            }
          }
        }
      }

      ... on ContentItem {
        id
        childContentItemsConnection(after: $after, first: $first) {
          pageInfo {
            endCursor
          }
          edges {
            node {
              ...contentCardFragment
              ...accessoryFragment
            }
          }
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.ACCESSORY_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;
