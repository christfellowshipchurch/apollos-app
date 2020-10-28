import React from 'react';
import { View, Animated, ImageBackground } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  styled,
  withTheme,
  BackgroundView,
  PaddedView,
  H4,
  UIText,
  Icon,
  StretchyView,
} from '@apollosproject/ui-kit';
import {
  HorizontalContentSeriesFeedConnected,
  MediaControlsConnected,
  LiveConsumer,
} from '@apollosproject/ui-connected';

import LiveLabel from 'ui/LiveLabel';
import { HorizontalDivider } from 'ui/Dividers';
import ButtonWithLinkRouting from 'ui/ButtonWithLinkRouting';
import Color from 'color';
import Features from '../Features';
import EventGroupings from '../EventGroupings';
import Title from '../Title';
import HTMLContent from '../HTMLContent';
import CheckInButton from '../CheckInButton';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const StyledMediaControlsConnected = styled(({ theme }) => ({
  marginTop: -(theme.sizing.baseUnit * 2.5),
}))(MediaControlsConnected);

const StyledCheckInButton = styled(({ theme, mediaControlSpacing }) => ({
  ...(mediaControlSpacing ? { paddingBottom: theme.sizing.baseUnit * 3 } : {}),
}))(CheckInButton);

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(ButtonWithLinkRouting);

const StyledImageBackground = styled(({ theme }) => ({
  flex: 1,
  width: '100%',
  aspectRatio: 1,
  resizeMode: 'cover',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  // using middle gray as the starting point, let's mix our paper color with it
  // so that we can use a gray tone that fits within the context of our theme
  backgroundColor: Color('#7F7F7F')
    .mix(Color(theme.colors.background.paper))
    .hex(),
}))(ImageBackground);

const EventContentItem = ({ content, loading }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  const callsToAction = get(content, 'callsToAction', []);
  const hideLabel = get(content, 'hideLabel', false);
  const buttonLabel = hideLabel
    ? 'Get Started'
    : 'Check Back Soon for More Information';
  const events = get(content, 'events', []);
  const hasVideo = get(content, 'videos[0].sources[0]', []).length > 0;
  const checkin = get(content, 'checkin', {});

  return (
    <LiveConsumer contentId={content.id}>
      {(liveStream) => {
        const isLive = !!(liveStream && liveStream.isLive);

        return (
          <BackgroundView>
            <StretchyView>
              {({ Stretchy, ...scrollViewProps }) => (
                <FlexedScrollView {...scrollViewProps}>
                  <View>
                    {coverImageSources.length || loading ? (
                      <Stretchy>
                        <View
                          style={{
                            width: '100%',
                            aspectRatio: 1,
                          }}
                        >
                          <StyledImageBackground
                            isLoading={!coverImageSources.length && loading}
                            source={coverImageSources}
                          >
                            {!loading &&
                              checkin && (
                                <StyledCheckInButton
                                  contentId={content.id}
                                  mediaControlSpacing={isLive || hasVideo}
                                />
                              )}
                          </StyledImageBackground>
                        </View>
                      </Stretchy>
                    ) : null}
                  </View>

                  <StyledMediaControlsConnected contentId={content.id} />
                  <PaddedView>
                    {isLive && (
                      <View style={{ position: 'relative' }}>
                        <LiveLabel />
                      </View>
                    )}
                    <Title contentId={content.id} isLoading={loading} />

                    <EventGroupings contentId={content.id} />

                    {callsToAction.length > 0 &&
                      callsToAction.map((n) => (
                        <StyledButton
                          key={`${n.call}:${n.action}`}
                          title={n.call}
                          pill={false}
                          url={n.action}
                        />
                      ))}

                    <HorizontalDivider />
                    <HTMLContent contentId={content.id} />
                    <Features contentId={content.id} />
                  </PaddedView>
                  <HorizontalContentSeriesFeedConnected
                    contentId={content.id}
                    relatedTitle="Events"
                  />
                </FlexedScrollView>
              )}
            </StretchyView>
          </BackgroundView>
        );
      }}
    </LiveConsumer>
  );
};

EventContentItem.propTypes = {
  content: PropTypes.shape({
    __typename: PropTypes.string,
    parentChannel: PropTypes.shape({
      name: PropTypes.string,
    }),
    id: PropTypes.string,
    htmlContent: PropTypes.string,
    title: PropTypes.string,
    scriptures: PropTypes.arrayOf(
      PropTypes.shape({
        /** The ID of the verse (i.e. '1CO.15.57') */
        id: PropTypes.string,
        /** A human readable reference (i.e. '1 Corinthians 15:57') */
        reference: PropTypes.string,
        /** The scripture source to render */
        html: PropTypes.string,
      })
    ),
    callsToAction: PropTypes.arrayOf(
      PropTypes.shape({
        call: PropTypes.string,
        action: PropTypes.string,
      })
    ),
    events: PropTypes.array,
    summary: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

export default EventContentItem;
