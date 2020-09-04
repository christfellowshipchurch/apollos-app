import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

const GET_CONTENT_CARD = gql`
  query getContentCard($contentId: ID!) {
    node(id: $contentId) {
      id
      __typename
      ...contentCardFragment
      ...accessoryFragment
      ...PrayerRequestFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.ACCESSORY_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.PRAYER_REQUEST_FRAGMENT}
`;

export default GET_CONTENT_CARD;
