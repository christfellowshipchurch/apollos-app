/**
 * Actions.js
 *
 * Author: Caleb Panza
 * Created: Mar 29, 2021
 *
 * Group of actions for a group including "check in", "join video", and "chat"
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Color from 'color';
import { isEmpty } from 'lodash';
import { useLazyQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import {
  InlineActivityIndicator,
  ThemeMixin,
  withTheme,
  styled,
  PaddedView,
} from '@apollosproject/ui-kit';
import ActionBar, { ActionBarItem } from 'ui/ActionBar';
import { useCheckIn } from '../../check-in';
import ZoomButton from './ZoomButton';

const GET_ACTION_PARTS = gql`
  query getActionParts($id: ID!) {
    node(id: $id) {
      id
      ... on StreamChatChannelNode {
        streamChatChannel {
          id
          channelId
        }
      }

      ... on Group {
        videoCall {
          link
          meetingId
          passcode
          labelText
        }
        parentVideoCall {
          link
          meetingId
          passcode
          labelText
        }
      }
    }
  }
`;

const renderChatButton = ({ id, channelId, name, navigation, theme }) => {
  const handlePress = () =>
    navigation.navigate('ChatChannel', {
      channelId,
      name,
    });

  if (!id || !channelId) return null;

  const themeOverride = {
    colors: {
      primary: theme.colors.warning,
    },
  };

  return (
    <ThemeMixin mixin={themeOverride}>
      <ActionBarItem
        label="Message Group"
        icon="chat-conversation"
        onPress={handlePress}
      />
    </ThemeMixin>
  );
};

const renderZoomButton = ({ id, videoCall, theme }) => {
  if (isEmpty(videoCall)) {
    return null;
  }

  return (
    <ThemeMixin mixin={theme}>
      <ZoomButton groupId={id} videoCall={videoCall} />
    </ThemeMixin>
  );
};

const renderCheckInButton = ({
  id,
  videoCall,
  parentVideoCall,
  theme,
  loading,
  options,
  checkInCompleted,
  checkInCurrentUser,
}) => {
  if (!id || videoCall || parentVideoCall) {
    return null;
  }

  const themeOverride = {
    colors: {
      primary:
        checkInCompleted || loading
          ? Color(theme.colors.success)
              .lighten(0.75)
              .hex()
          : theme.colors.success,
    },
  };

  const label = checkInCompleted ? 'Checked In' : 'Check In';
  const onPress = () => {
    if (!loading && !checkInCompleted && options.length) {
      checkInCurrentUser({
        optionIds: options.map(({ id: optionId }) => optionId),
      });
    }
  };

  return (
    <ThemeMixin mixin={themeOverride}>
      <ActionBarItem
        label={label}
        icon="check"
        onPress={onPress}
        isLoading={loading}
      />
    </ThemeMixin>
  );
};

const Actions = ({ id, name, theme }) => {
  const navigation = useNavigation();
  const checkIn = useCheckIn({ nodeId: id });
  const [getActionParts, { data, loading, error, called }] = useLazyQuery(
    GET_ACTION_PARTS
  );
  const streamChat = data?.node?.streamChatChannel;
  const videoCall = data?.node?.videoCall;
  const parentVideoCall = data?.node?.parentVideoCall;

  useEffect(
    () => {
      if (!loading && id && !isEmpty(id) && !called) {
        getActionParts({
          fetchPolicy: 'network-only',
          variables: {
            id,
          },
        });
      }
    },
    [id]
  );

  if (!id || (!data && loading)) {
    return (
      <ActionBar>
        <PaddedView>
          <InlineActivityIndicator />
        </PaddedView>
      </ActionBar>
    );
  }

  return (
    <ActionBar>
      {renderCheckInButton({
        id,
        videoCall,
        parentVideoCall,
        theme,
        ...checkIn,
      })}
      {renderZoomButton({
        id,
        videoCall: parentVideoCall,
        theme: {
          colors: {
            primary: theme.colors.alert,
          },
        },
      })}
      {renderZoomButton({
        id,
        videoCall: {
          ...videoCall,
          labelText:
            videoCall?.labelText ||
            (!isEmpty(parentVideoCall) ? 'Join Breakout' : 'Join Meeting'),
        },
        theme: {
          colors: {
            primary: theme.colors.success,
          },
        },
      })}
      {renderChatButton({ ...streamChat, name, theme, navigation })}
    </ActionBar>
  );
};

Actions.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
      secondary: PropTypes.string,
      tertiary: PropTypes.string,
      alert: PropTypes.string,
      success: PropTypes.string,
    }),
  }),
};
Actions.defaultProps = {
  id: null,
  name: 'My Group',
  theme: {},
};

export default withTheme()(Actions);
