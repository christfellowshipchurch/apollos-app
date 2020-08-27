import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import LiveStreamPlayer from './LiveStreamPlayer';
import FullscreenPlayer from './FullscreenPlayer';

/*
 * From https://github.com/ApollosProject/apollos-apps/blob/master/packages/apollos-ui-media-player/src/MediaPlayer/queries.js
 */
const GET_MEDIA_PLAYER_VISIBILITY = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isVisible
      currentTrack {
        mediaSource {
          uri
        }
      }
    }
  }
`;

/*
 * From https://github.com/ApollosProject/apollos-apps/blob/master/packages/apollos-ui-connected/src/live/getLiveContent.js
 */
const GET_LIVE_CONTENT = gql`
  query getLiveContent {
    liveStreams {
      isLive
      media {
        sources {
          uri
        }
      }
      contentItem {
        id
      }
    }
  }
`;

/**
 * Selectively renders FullscreenPlayer component is MediaPlayer is visible
 */
class MediaPlayer extends Component {
  shouldComponentUpdate() {
    return false; // 🚀
  }

  render() {
    return (
      <Query query={GET_MEDIA_PLAYER_VISIBILITY}>
        {({ data = {} }) => {
          if (!data.mediaPlayer || !data.mediaPlayer.isVisible) return null;
          const uri = get(data, 'mediaPlayer.currentTrack.mediaSource.uri');
          return (
            <Query query={GET_LIVE_CONTENT}>
              {({ loading, data: liveData }) => {
                if (loading) return null;

                const liveStreams = get(liveData, 'liveStreams', []).filter(
                  (s) => s.isLive
                );
                const liveStream = liveStreams.find(
                  (l) => uri === get(l, 'media.sources[0].uri')
                );
                const contentId = get(liveStream, 'contentItem.id', '').split(
                  ':'
                )[1];

                if (liveStream)
                  return <LiveStreamPlayer contentId={contentId} />;
                return <FullscreenPlayer />;
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export { MediaPlayer };

export default {};
