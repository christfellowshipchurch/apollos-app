import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import { BackgroundView } from '@apollosproject/ui-kit';

import { FeaturesFeedConnected } from 'features';
import TabHeader from '../TabHeader';

// getHomeFeed uses the HOME_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_GIVE_FEED = gql`
  query getGiveFeedFeatures {
    giveFeedFeatures {
      id
    }
  }
`;

const Give = () => {
  const { data, error, loading, refetch } = useQuery(GET_GIVE_FEED, {
    fetchPolicy: 'cache-first',
  });
  const featuresFeedId = data?.giveFeedFeatures?.id;

  return (
    <BackgroundView>
      <TabHeader title="Give" />
      <FeaturesFeedConnected
        featuresFeedId={featuresFeedId}
        refetch={refetch}
        isLoading={loading}
        error={error}
        removeClippedSubviews={false}
        numColumns={1}
      />
    </BackgroundView>
  );
};

Give.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Give;
