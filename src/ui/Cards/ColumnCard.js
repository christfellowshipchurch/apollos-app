import React from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  H5,
  H6,
  styled,
  withTheme,
  withIsLoading,
  ConnectedImage,
  FlexedView,
  CardImage,
  Card,
} from '@apollosproject/ui-kit';
import BlurView from '../BlurView';
import ThemeMixin from '../DynamicThemeMixin';
import LiveLabel from '../LiveLabel';
import { Summary } from './components';

const { ImageSourceType } = ConnectedImage;

const Image = withTheme(({ theme, label }) => ({
  forceRatio: 1.5,
  imageStyle: { aspectRatio: 1.5 },
}))(CardImage);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(H5);

const Content = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.75,
  justifyContent: 'center',
  backgroundColor: theme.colors.background.paper,
}))(FlexedView);

const LiveLabelPositioning = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: theme.sizing.baseUnit * 0.75,
}))(LiveLabel);

const BlurLabel = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.5,
  borderRadius: theme.sizing.baseBorderRadius,
  position: 'absolute',
  bottom: 5,
  left: theme.sizing.baseUnit * 0.75 - theme.sizing.baseUnit * 0.5,
}))(BlurView);

const Label = withTheme(({ theme }) => ({
  numberOfLines: 1,
  style: {
    color: Platform.select({
      ios: theme.colors.white,
      android: theme.colors.text.primary,
    }),
  },
}))(H6);

const CardWithLayout = styled(({ theme }) => ({
  marginHorizontal: theme.sizing.baseUnit * 0.5,
  flex: 1,
}))(Card);

const StackedImageCard = ({
  placement,
  coverImage,
  labelText,
  title,
  summary,
  isLive,
  isLoading,
}) => (
  <ThemeMixin>
    <CardWithLayout placement={placement}>
      <View>
        <Image source={coverImage} label={labelText} />
        {isLive && <LiveLabelPositioning BackgroundComponent={BlurView} />}

        {!isEmpty(labelText) &&
          !isLive && (
            <BlurLabel blurType="ultraThinMaterial">
              <Label isLoading={isLoading}>{labelText}</Label>
            </BlurLabel>
          )}
      </View>
      <Content>
        {(title !== '' || isLoading) && (
          <Title numberOfLines={2} ellipsizeMode="tail" isLoading={isLoading}>
            {title}
          </Title>
        )}
        {(summary !== '' || isLoading) && (
          <Summary isLoading={isLoading}>{summary}</Summary>
        )}
      </Content>
    </CardWithLayout>
  </ThemeMixin>
);

StackedImageCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  labelText: PropTypes.string,
  summary: PropTypes.string,
  title: PropTypes.string,
  placement: PropTypes.oneOf(['', 'left', 'right']),
  isLive: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default withIsLoading(StackedImageCard);
