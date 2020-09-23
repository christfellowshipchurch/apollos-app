import React from 'react';
import { SafeAreaView } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { styled } from '@apollosproject/ui-kit';
import { GET_MEDIA_PLAYER_VISIBILITY } from '../queries';
import { MINI_PLAYER_HEIGHT } from './MiniControls';

import MediaPlayerSafeLayout from './MediaPlayerSafeLayout';

const MediaPlayerSafeLayoutWithSpacing = styled(
  {
    paddingBottom: MINI_PLAYER_HEIGHT,
  },
  'ui-media.MediaPlayer.MediaPlayerSpacer.MediaPlayerSafeLayoutWithSpacing'
)(MediaPlayerSafeLayout);

const MediaPlayerSpacer = ({ Component, ...props }) => (
  <Query query={GET_MEDIA_PLAYER_VISIBILITY}>
    {({ data = {} }) =>
      get(data, 'mediaPlayer.isVisible') ? (
        <MediaPlayerSafeLayoutWithSpacing {...props} />
      ) : (
        Component ? (
          <Component {...props} />
        ) : (
          <SafeAreaView {...props} />
        )
      )
    }
  </Query>
);

export default MediaPlayerSpacer;
