import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get, flatten } from 'lodash';
import PropTypes from 'prop-types';

import { FeedView } from '@apollosproject/ui-kit';

import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';
import StatusBar from '../../ui/StatusBar';

import { Feature } from '../../feature';
import { HorizontalDivider } from '../../ui/Dividers';
import Wordmark from '../../ui/Wordmark';
import LiveStreamsFeed from './LiveStreamsFeed';

import GET_FEED_FEATURES from './getFeedFeatures';

const mapDataToActions = (data) => flatten(data.map(({ actions }) => actions));

const renderItem = ({ item }) =>
  item.action ? (
    <>
      <Feature {...item} />
      <HorizontalDivider />
    </>
  ) : null;

const Home = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_FEED_FEATURES, {
    fetchPolicy: 'cache-and-network',
  });
  const { scrollY } = useHeaderScrollEffect({ navigation });
  const content = mapDataToActions(get(data, 'userFeedFeatures', []));

  return (
    <BackgroundView>
      <SafeAreaView forceInset={{ bottom: 'never', top: 'always' }}>
        <StatusBar />
        <FeedView
          renderItem={renderItem}
          content={content}
          isLoading={loading && !get(data, 'userFeedFeatures', []).length}
          error={error}
          refetch={refetch}
          ListHeaderComponent={
            <React.Fragment>
              <NavigationSpacer />
              <LiveStreamsFeed />
            </React.Fragment>
          }
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ])}
          removeClippedSubviews={false}
          numColumns={1}
        />
      </SafeAreaView>
    </BackgroundView>
  );
};

Home.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    headerTitle: <Wordmark />,
    title: 'Home',
  });

Home.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Home;
