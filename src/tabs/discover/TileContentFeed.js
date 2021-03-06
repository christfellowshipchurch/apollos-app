import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import {
  styled,
  withTheme,
  H4,
  H6,
  HorizontalTileFeed,
  ButtonLink,
  TouchableScale,
  Touchable,
  withIsLoading,
} from '@apollosproject/ui-kit';

import ContentCardConnected from 'ui/ContentCardConnected';
import { HorizontalDefaultCard } from 'ui/Cards';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
  paddingLeft: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(View);

const Name = styled({
  flex: 2,
})(View);

const AndroidTouchableFix = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius / 2,
}))(Touchable);

const ButtonLinkSpacing = styled(({ theme }) => ({
  flexDirection: 'row', // correctly positions the loading state
  justifyContent: 'flex-end', // correctly positions the loading state
  padding: theme.sizing.baseUnit, // UX hack to improve tapability.
}))(View);

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  paddingBottom: theme.sizing.baseUnit,
  zIndex: 1,
}))(HorizontalTileFeed);

const Container = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(View);

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
};

const TileContentFeed = ({ isLoading, id, name, content, viewAll }) => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableScale
      onPress={() => {
        navigation.push('ContentSingle', {
          itemId: item.id,
        });
      }}
    >
      <ContentCardConnected
        contentId={item.id}
        isLoading={isLoading}
        card={HorizontalDefaultCard}
      />
    </TouchableScale>
  );

  return (
    (isLoading || !isEmpty(content)) && (
      <Container>
        <RowHeader>
          <Name>
            <H4>{name}</H4>
          </Name>
          {viewAll && (
            <AndroidTouchableFix
              onPress={() => {
                navigation.navigate('ContentFeed', {
                  itemId: id,
                  itemTitle: name,
                  nested: true,
                });
              }}
            >
              <ButtonLinkSpacing>
                <H6>
                  <ButtonLink>View All</ButtonLink>
                </H6>
              </ButtonLinkSpacing>
            </AndroidTouchableFix>
          )}
        </RowHeader>
        <StyledHorizontalTileFeed
          content={content}
          renderItem={renderItem}
          loadingStateObject={loadingStateObject}
          isLoading={isLoading}
        />
      </Container>
    )
  );
};

TileContentFeed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  isLoading: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  content: PropTypes.arrayOf(
    PropTypes.any // this component doesn't care about the shape of `node`, just that it exists
  ),
  viewAll: PropTypes.bool,
};

TileContentFeed.propTypes = {
  content: [],
  cardsToShow: 0,
  viewAll: true,
};

export default withIsLoading(TileContentFeed);
