/**
 * ChatChannelSingle.js
 *
 * Author: Caleb Panza
 * Created: Mar 30, 2021
 *
 * A view that renders a full screen, single Chat Channel. It is assumed that this component will sit inside of a Navigation Stack and expects to properties formatted as Navigation Params.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { OverlayProvider as ChatOverlayProvider } from 'stream-chat-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeMixin, styled, withTheme } from '@apollosproject/ui-kit';
import NavigationHeader from 'ui/NavigationHeader';
import ChatChannel from './ChatChannel';

const BackgroundView = compose(
  withTheme(({ theme }) => ({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0.5 },
    colors: [theme.colors.background.screen, theme.colors.background.paper],
  })),
  styled({ flex: 1, height: '100%' })
)(LinearGradient);

const ChatChannelSingle = ({ route }) => {
  const { bottom } = useSafeAreaInsets();

  const itemId = route?.params?.itemId;
  const relatedNode = route?.params?.relatedNode;

  return (
    <ThemeMixin>
      <ChatOverlayProvider bottomInset={bottom} topInset={0}>
        <BackgroundView>
          <SafeAreaView>
            <NavigationHeader />
            <ChatChannel
              relatedNode={relatedNode}
              streamChatChannel={{ id: itemId }}
            />
          </SafeAreaView>
        </BackgroundView>
      </ChatOverlayProvider>
    </ThemeMixin>
  );
};

ChatChannelSingle.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemId: PropTypes.string,
      relatedNode: {
        id: PropTypes.string,
        title: PropTypes.string,
      },
    }),
  }),
};
ChatChannelSingle.defaultProps = {};

export default ChatChannelSingle;