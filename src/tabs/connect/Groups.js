import React from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import {
  styled,
  HorizontalTileFeed,
  TouchableScale,
  H4,
  PaddedView,
} from '@apollosproject/ui-kit';

import { HorizontalGroupCard } from '../../ui/Cards';

import { GET_USER_GROUPS } from './queries';

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  paddingBottom: theme.sizing.baseUnit,
  zIndex: 1,
}))(HorizontalTileFeed);

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
};

const Groups = ({ navigation }) => {
  const { data, loading, error } = useQuery(GET_USER_GROUPS);
  const content = get(data, 'currentUser.profile.groups', []);

  const renderItem = ({ item }) => {
    const members = get(item, 'members', []);
    const avatars = [];
    members.map(
      (member) => (member.photo.uri ? avatars.push(member.photo.uri) : null)
    );
    return (
      <TouchableScale
        onPress={() => {
          navigation.push('ContentSingle', {
            itemId: item.id,
          });
        }}
      >
        <HorizontalGroupCard
          coverImage={[
            {
              uri: 'https://picsum.photos/800',
            },
          ]}
          avatars={avatars}
          isLoading={loading}
          {...item}
        />
      </TouchableScale>
    );
  };

  return (
    <View>
      <PaddedView>
        <H4>Groups</H4>
      </PaddedView>

      <StyledHorizontalTileFeed
        content={content}
        renderItem={renderItem}
        loadingStateObject={loadingStateObject}
        isLoading={loading}
      />
    </View>
  );
};

Groups.propTypes = {};

export default Groups;
