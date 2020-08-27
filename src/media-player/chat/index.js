import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
} from 'stream-chat-react-native';

import { styled, ActivityIndicator } from '@apollosproject/ui-kit';
import { useCurrentUser } from '../../hooks';

import MediaPlayerSafeLayout from '../controls/MediaPlayerSafeLayout';
import chatClient, { streami18n } from './client';

const ChatContainer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.screen,
}))(MediaPlayerSafeLayout);

const LiveStreamChat = ({ isPortrait, contentId }) => {
  const [connecting, setConnecting] = useState(true);

  const { loading, data } = useCurrentUser();

  const channel = useRef(null);

  const connect = async () => {
    try {
      await chatClient.setUser(
        {
          id: data?.currentUser?.id.split(':')[1],
          name: `${data?.currentUser?.profile?.firstName} ${
            data?.currentUser?.profile?.lastName
          }`,
          image: data?.currentUser?.profile?.photo?.uri,
        },
        data?.currentUser?.streamChatToken
      );
      channel.current = chatClient.channel('livestream', contentId);
      await channel.current.watch();
      setConnecting(false);
    } catch (e) {
      console.error(e.message); // eslint-disable-line no-console
    }
  };

  useEffect(
    () => {
      if (!loading) {
        connect();
      }
      return () => chatClient.disconnect();
    },
    [loading]
  );

  if (loading || connecting) {
    return (
      <ChatContainer>
        <ActivityIndicator size={'large'} />
      </ChatContainer>
    );
  }

  if (isPortrait) {
    return null;
  }

  return (
    <Chat client={chatClient} i18nInstance={streami18n}>
      <ChatContainer>
        <Channel channel={channel.current}>
          <MessageList />
          <MessageInput />
        </Channel>
      </ChatContainer>
    </Chat>
  );
};

LiveStreamChat.propTypes = {
  isPortrait: PropTypes.bool,
  contentId: PropTypes.string,
};

export default LiveStreamChat;
