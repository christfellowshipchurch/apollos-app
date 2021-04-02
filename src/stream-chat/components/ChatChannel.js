/**
 * ChatChannel.js
 *
 * Author: Caleb Panza
 * Created: Mar 29, 2021
 *
 * A single Channel used for chatting with Stream.IO
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { View, StyleSheet } from 'react-native';
import {
  Card,
  Chat,
  Channel,
  MessageList,
  MessageInput,
  MessageTextContainer,
  renderText,
  useTheme,
} from 'stream-chat-react-native';
import {
  BackgroundView,
  ActivityIndicator,
  UIText,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import { useStreamChat } from '../context';
import { Streami18n } from '../client';
import supportedReactions from '../supportedReactions';
import { mapThemeValues } from '../utils';

// :: Styles
// :: ======================================
const ErrorContainer = styled(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}))(BackgroundView);

// :: Components
// :: ======================================
const UrlPreview = (props) => <Card {...props} />;
// todo : if the only thing in the message is a single Url, just don't render the text
const MessageText = (props) => {
  const theme = useTheme();

  const {
    theme: {
      colors,
      messageSimple: {
        content: {
          markdown,
          textContainer: { onlyEmojiMarkdown, ...textContainer },
        },
      },
    },
  } = theme;

  return renderText({ colors, ...props });
};

const ChatChannel = ({
  keyboardVerticalOffset,
  theme,
  withMedia,
  children,
}) => {
  const { isConnecting, chatClient, channel } = useStreamChat();

  if (isConnecting)
    return (
      <BackgroundView>
        <ActivityIndicator />
      </BackgroundView>
    );

  if (!channel && !chatClient && !isConnecting)
    return (
      <ErrorContainer>
        <UIText>Oops!</UIText>
      </ErrorContainer>
    );

  const chatTheme = mapThemeValues(theme);

  // note : special consideration made for Stream with a Media Player attached to the top
  // :: Split screen between video and chat : https://github.com/GetStream/stream-chat-react-native/wiki/Cookbook-v3.0
  if (withMedia) {
    return (
      <Chat client={chatClient} i18nInstance={Streami18n} style={chatTheme}>
        <Channel
          channel={channel}
          keyboardVerticalOffset={keyboardVerticalOffset}
          supportedReactions={supportedReactions}
          UrlPreview={UrlPreview}
          // MessageText={MessageText}
          //   thread={thread}
        >
          {children}
          <MessageList
          // onThreadSelect={(thread) => {
          //   setThread(thread);
          //   navigation.navigate('Thread');
          // }}
          />
          <MessageInput />
        </Channel>
      </Chat>
    );
  }

  return (
    <Chat client={chatClient} i18nInstance={Streami18n} style={chatTheme}>
      <Channel
        channel={channel}
        keyboardVerticalOffset={keyboardVerticalOffset}
        supportedReactions={supportedReactions}
        UrlPreview={UrlPreview}
        // MessageText={MessageText}
        //   thread={thread}
      >
        <View style={StyleSheet.absoluteFill}>
          <MessageList
          // onThreadSelect={(thread) => {
          //   setThread(thread);
          //   navigation.navigate('Thread');
          // }}
          />
          <MessageInput />
        </View>
      </Channel>
    </Chat>
  );
};

ChatChannel.propTypes = {
  channel: PropTypes.shape({}),
  keyboardVerticalOffset: PropTypes.number,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({
      primary: PropTypes.string,
      alert: PropTypes.string,
      success: PropTypes.string,
      text: PropTypes.shape({
        primary: PropTypes.string,
        secondary: PropTypes.string,
        tertiary: PropTypes.string,
      }),
      background: PropTypes.shape({
        screen: PropTypes.string,
        paper: PropTypes.string,
      }),
    }),
  }),
  withMedia: PropTypes.bool,
  relatedNode: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
};

ChatChannel.defaultProps = {
  keyboardVerticalOffset: 0,
  withMedia: false,
};

export default withTheme()(ChatChannel);
