import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import React, { useState, useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ThemeProvider as ChatThemeProvider } from '@stream-io/styled-components';

import { styled, withTheme } from '@apollosproject/ui-kit';
import { useCurrentUser } from '../hooks';

import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  LoadingMessages,
  LoadingErrorIndicator,
} from '../chat/components';
import { withPlayerContext } from '../chat/context';
import chatClient, { streami18n } from '../chat/client';
import mapChatTheme from '../chat/styles/mapTheme';

const GET_CURRENT_USER_ROLE_FOR_CHANNEL = gql`
  query getCurrentUserRoleForChannel($channelId: ID!) {
    currentUser {
      id
      streamChatRole(id: $channelId)
    }
  }
`;

const KeyboardAvoider = Platform.OS === 'ios' ? KeyboardSpacer : React.Fragment;

const ChatContainer = styled(({ theme }) => ({
  flex: 1,
  paddingBottom: theme.sizing.baseUnit,
  backgroundColor: theme.colors.background.paper,
}))(View);

const LiveStreamChat = (props) => {
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState(false);

  const { loading, data = {} } = useCurrentUser();

  const [fetchRole] = useLazyQuery(GET_CURRENT_USER_ROLE_FOR_CHANNEL, {
    fetchPolicy: 'network-only',
    variables: {
      channelId: props.channelId,
    },
  });

  const channel = useRef(null);

  // const handleChannelEvent = (e) => {
  //   console.log({ e });
  //   console.log('channel event recvd, showing state', {
  //     channel: channel.current.state,
  //   });
  // };

  const loadChannels = async () => {
    const filter = {
      type: 'messaging',
      members: { $in: [get(data, 'currentUser.id', '').split(':')[1]] },
    };
    const sort = { last_message_at: -1 };
    const options = { watch: false, state: false };

    const channels = await chatClient.queryChannels(filter, sort, options);
    const sinceYesterday = moment().subtract(12, 'hour');
    const recentOnly = channels.filter((c) =>
      moment(get(c, 'state.last_message_at')).isAfter(sinceYesterday)
    );
    props.onChannelsUpdated({ channels: recentOnly });
  };

  const handleClientEvent = (e) => {
    // console.log({ e });
    switch (e.type) {
      case 'notification.message_new': {
        loadChannels();
        break;
      }
      default:
        break;
    }
  };

  const connect = async () => {
    try {
      const firstName = get(data, 'currentUser.profile.firstName', '');
      const lastName = get(data, 'currentUser.profile.lastName', '');
      const user = {
        id: get(data, 'currentUser.id', '').split(':')[1],
        name: `${firstName} ${lastName}`,
        image: get(data, 'currentUser.profile.photo.uri'),
      };

      if (!chatClient.userID) {
        await chatClient.setUser(
          user,
          get(data, 'currentUser.streamChatToken')
        );
      }

      channel.current = chatClient.channel(
        'livestream',
        props.channelId,
        props.event
      );

      await channel.current.create();
      // await channel.current.watch();
      // channel.current.on(handleChannelEvent);

      if (get(chatClient, 'listeners.all.length', 0) < 2) {
        chatClient.on(handleClientEvent);
      }

      // Now that we're sure the channel exists, we can request the user's role for it. On the
      // server, this will either add or remove the user as a moderator while computing the result.
      // (So this is kind of a mutation.)
      fetchRole();

      setConnecting(false);
    } catch (e) {
      console.warn(e.message); // eslint-disable-line no-console
      setError(true);
    }
  };

  useEffect(
    () => {
      if (!loading) {
        connect();
      }
      return () => {
        // if (channel.current) {
        //   channel.current.off(handleChannelEvent);
        // }
        if (get(chatClient, 'listeners.all.length', 0) < 2) {
          chatClient.off(handleClientEvent);
          chatClient.disconnect();
        }
      };
    },
    [props.channelId, data.currentUser]
  );

  useEffect(
    () => {
      if (!loading && !connecting) loadChannels();
    },
    [loading, connecting]
  );

  if (loading || connecting) {
    return (
      <ChatThemeProvider theme={mapChatTheme(props.theme)}>
        <Chat client={chatClient} i18nInstance={streami18n}>
          <ChatContainer>
            <LoadingMessages />
            <MessageInput disabled />
          </ChatContainer>
        </Chat>
      </ChatThemeProvider>
    );
  }

  if (!props.isPortrait) {
    return null;
  }

  if (error) {
    return (
      <Chat client={chatClient} i18nInstance={streami18n}>
        <ChatContainer>
          <LoadingErrorIndicator
            listType={'message'}
            retry={() => setError(false)}
          />
        </ChatContainer>
      </Chat>
    );
  }

  return (
    <ChatThemeProvider theme={mapChatTheme(props.theme)}>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <ChatContainer>
          <Channel channel={channel.current}>
            <MessageList />
            <MessageInput />
            <KeyboardAvoider />
          </Channel>
        </ChatContainer>
      </Chat>
    </ChatThemeProvider>
  );
};

LiveStreamChat.propTypes = {
  isPortrait: PropTypes.bool,
  channelId: PropTypes.string,
  event: PropTypes.shape({
    parentId: PropTypes.string,
    name: PropTypes.string,
    startsAt: PropTypes.string,
    endsAt: PropTypes.string,
  }),
  onChannelsUpdated: PropTypes.func,
  theme: PropTypes.shape({
    colors: PropTypes.shape({}),
  }),
};

const themed = withTheme();

export default withPlayerContext(themed(LiveStreamChat));
