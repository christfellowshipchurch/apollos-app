import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { get } from 'lodash'

import { ContentCard, ErrorCard } from '@apollosproject/ui-kit'
import GET_CONTENT_CARD from './query'

export { TILE_CARD_FRAGMENT, LARGE_CARD_FRAGMENT, ACCESSORY_FRAGMENT } from './query'

const ContentCardConnected = ({
  contentId,
  isLoading,
  tile,
  card = ContentCard,
  ...otherProps
}) => {
  if (!contentId || isLoading)
    return React.createElement(
      card,
      {
        ...otherProps,
        tile,
        isLoading: true
      }
    )

  return (
    <Query query={GET_CONTENT_CARD} variables={{ contentId, tile: !!tile }}>
      {({ data: { node = {} } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />

        const metrics = [
          {
            icon: node.isLiked ? 'like-solid' : 'like',
            value: node.likedCount,
          },
        ]

        const coverImage = get(node, 'coverImage.sources', undefined)

        return React.createElement(
          card,
          {
            ...node,
            ...otherProps,
            coverImage,
            metrics,
            tile,
            isLoading: loading
          }
        )
      }}
    </Query>
  )
}

ContentCardConnected.propTypes = {
  isLoading: PropTypes.bool,
  contentId: PropTypes.string,
  tile: PropTypes.bool,
  card: PropTypes.func
}

// ContentCardConnected.defaultProps = {
//   card: ContentCard
// }

export default ContentCardConnected
