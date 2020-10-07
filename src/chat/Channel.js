import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { createStackNavigator } from 'react-navigation';
import { SafeAreaView, Platform } from 'react-native';
import { get } from 'lodash';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ThemeProvider as ChatThemeProvider } from '@stream-io/styled-components';

import { styled, withTheme } from '@apollosproject/ui-kit';
import MediaPlayerSpacer from '../media-player/controls/MediaPlayerSpacer';
import { MINI_PLAYER_HEIGHT } from '../media-player/controls/MiniControls';
import { useCurrentUser } from '../hooks';
import { navigationOptions, NavigationSpacer } from '../navigation';

import {
  Chat,
  Channel as ChannelInner,
  MessageList,
  MessageInput,
  LoadingMessages,
} from './components';
import chatClient, { streami18n } from './client';
import mapChatTheme from './styles/mapTheme';

const KeyboardAvoider = Platform.OS === 'ios' ? KeyboardSpacer : React.Fragment;

const SafeChatContainer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.paper,
}))(SafeAreaView);

const FlexedMediaSpacer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.paper,
}))(MediaPlayerSpacer);

const themed = withTheme();

const Channel = themed((props) => {
  const userId = props.navigation.getParam('userId');

  const [connecting, setConnecting] = useState(true);
  const [playerVisible, setPlayerVisible] = useState(false);

  const { loading, data = {} } = useCurrentUser();

  const channel = useRef(null);

  const connect = async () => {
    try {
      const firstName = get(data, 'currentUser.profile.firstName', '');
      const lastName = get(data, 'currentUser.profile.lastName', '');
      const curId = get(data, 'currentUser.id', '').split(':')[1];
      const user = {
        id: curId,
        name: `${firstName} ${lastName}`,
        image: get(data, 'currentUser.profile.photo.uri'),
      };

      if (!chatClient.userID) {
        await chatClient.setUser(
          user,
          get(data, 'currentUser.streamChatToken')
        );
      }

      channel.current = chatClient.channel('messaging', {
        members: [userId, curId],
      });

      await channel.current.watch();

      const response = await chatClient.queryUsers({ id: { $in: [userId] } });
      props.navigation.setParams({ name: get(response, 'users[0].name') });

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
      return () => {
        if (get(chatClient, 'listeners.all.length', 0) < 2) {
          chatClient.disconnect();
        }
      };
    },
    [data.currentUser]
  );

  if (loading || connecting) {
    return (
      <ChatThemeProvider theme={mapChatTheme(props.theme)}>
        <Chat client={chatClient} i18nInstance={streami18n}>
          <FlexedMediaSpacer>
            <SafeChatContainer>
              <LoadingMessages />
              <MessageInput disabled />
            </SafeChatContainer>
          </FlexedMediaSpacer>
        </Chat>
      </ChatThemeProvider>
    );
  }

  return (
    <ChatThemeProvider theme={mapChatTheme(props.theme)}>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <FlexedMediaSpacer
          onOpen={() => setPlayerVisible(true)}
          onClose={() => setPlayerVisible(false)}
        >
          <ChannelInner channel={channel.current}>
            <SafeChatContainer>
              <NavigationSpacer />
              <MessageList />
            </SafeChatContainer>
            <MessageInput />
            <KeyboardAvoider
              topSpacing={playerVisible ? -MINI_PLAYER_HEIGHT : 0}
            />
          </ChannelInner>
        </FlexedMediaSpacer>
      </Chat>
    </ChatThemeProvider>
  );
});

Channel.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }),
  theme: PropTypes.shape({
    colors: PropTypes.shape({}),
  }),
};

Channel.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: navigation.getParam('name', '…'),
    blur: false,
    headerLeft: null,
  });

const ChannelNavigator = createStackNavigator(
  {
    Channel,
  },
  {
    initialRouteName: 'Channel',
    headerLayoutPreset: 'left',
  }
);

export { Channel };

export default ChannelNavigator;
