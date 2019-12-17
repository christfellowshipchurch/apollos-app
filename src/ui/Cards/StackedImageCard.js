import React, { PureComponent } from 'react'
import { View, Platform } from 'react-native'
import PropTypes from 'prop-types'

import {
  H5,
  H6,
  styled,
  withTheme,
  withIsLoading,
  ConnectedImage,
  FlexedView,
} from '@apollosproject/ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const { ImageSourceType } = ConnectedImage

const CellImage = styled(({ theme }) => ({
  width: '100%',
  borderRadius: 8,
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View)

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6)

const Title = styled(({ theme }) => ({
  fontWeight: 'bold'
}))(H5)

const TextContainer = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
  justifyContent: 'center'
}))(FlexedView)

const Cell = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  marginVertical: theme.sizing.baseUnit * 0.75,
}))(View)

const Icon = withTheme(({ theme, name }) => ({
  icon: ['fal', name],
  fill: theme.colors.white,
  size: 16,
  style: {
    position: 'absolute',
    right: 5,
    top: 5,
    ...Platform.select(theme.shadows.default)
  }
}))(FontAwesomeIcon)

class StackedImageCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    coverImage: PropTypes.oneOfType([
      PropTypes.arrayOf(ImageSourceType),
      ImageSourceType,
    ]),
    label: PropTypes.string,
    summary: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
  }

  render() {
    return (
      <Cell>
        <CellImage>
          <ConnectedImage
            source={this.props.coverImage}
            isLoading
          />
          {this.props.icon && this.props.icon !== '' &&
            <Icon name={this.props.icon} />}
        </CellImage>
        <TextContainer>
          {this.props.label !== '' &&
            <StyledH6>
              {this.props.label}
            </StyledH6>}

          {this.props.title !== '' &&
            <Title numberOfLines={2} ellipsizeMode="tail">
              {this.props.title}
            </Title>}

          {this.props.summary !== '' &&
            <StyledH6 numberOfLines={2} ellipsizeMode="tail">
              {this.props.summary}
            </StyledH6>}
        </TextContainer>
      </Cell >
    )
  }
}

export default withIsLoading(StackedImageCard)