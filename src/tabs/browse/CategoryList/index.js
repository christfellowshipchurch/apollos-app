import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { styled, FeedView } from '@apollosproject/ui-kit';
import CategoryTileFeed from '../CategoryTileFeed';
import { GET_CATEGORIES_FROM_FILTERS } from '../queries';

const feedItemLoadingState = {
  title: '',
  isLoading: true,
};

const StyledFeedView = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit,
}))(FeedView);

const CategoryList = ({ filterId }) => {
  const { loading, error, data, refetch } = useQuery(
    GET_CATEGORIES_FROM_FILTERS,
    { variables: { id: filterId } }
  );

  const renderItem = ({ item }) => <CategoryTileFeed id={item.id} />;

  return (
    <StyledFeedView
      error={error}
      content={get(data, 'node.childContentItemsConnection.edges', []).map(
        (edges) => edges.node
      )}
      isLoading={loading}
      refetch={refetch}
      renderItem={renderItem}
      loadingStateObject={feedItemLoadingState}
    />
  );
};

CategoryList.propTypes = {};

CategoryList.defaultProps = {};

export default CategoryList;
