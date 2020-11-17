import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import {
  styled,
  BodyText,
  ActivityIndicator,
  ErrorCard,
  H3,
  H4,
  BackgroundView,
  FlexedView,
  withMediaQuery,
  Button,
} from '@apollosproject/ui-kit';

// import NavigationHeader from '../ui/NavigationHeader';

import { useGroup } from '../hooks';
import GET_GROUP_COVER_IMAGES from './getGroupCoverImages';

// :: Styled Components
// ------------------------------------------------------------------

export const ContentContainer = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
  })),
  styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 1.5,
    backgroundColor: theme.colors.transparent,
    width: 500,
    alignSelf: 'center',
  }))
)(View);

// Read Only Fields that show on the Profile
export const FieldContainer = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit * 1.5,
  marginVertical: theme.sizing.baseUnit * 0.75,
}))(View);

const Overlay = styled(({ theme }) => ({
  alignContent: 'center',
  justifyContent: 'center',
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: Color(theme.colors.background.screen).fade(0.75),
  top: 0,
  left: 0,
  zIndex: 1,
}))(FlexedView);

const StyledH3 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
  ...Platform.select({
    android: {
      paddingTop: theme.sizing.baseUnit,
    },
  }),
}))(H3);

// :: Core Component
// ------------------------------------------------------------------

const EditGroup = ({ navigation, group, loading, error }) => {
  // const currentCoverImage = get(group, 'coverImage.sources[0].uri', null);

  if (loading)
    return (
      <BackgroundView>
        <StatusBar hidden />
        <ActivityIndicator />
      </BackgroundView>
    );

  if (error) return <ErrorCard />;

  return (
    <View>
      {loading && (
        <Overlay>
          <ActivityIndicator />
        </Overlay>
      )}

      <FieldContainer>
        <StyledH3>Customize my Group</StyledH3>
      </FieldContainer>
      <FieldContainer>
        <H4>Cover Photo</H4>
        <Button
          title="Update"
          onPress={() => navigation.navigate('EditGroupCoverImage')}
        />
      </FieldContainer>
      <FieldContainer>
        <H4>Resources</H4>
      </FieldContainer>
    </View>
  );
};

EditGroup.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

EditGroup.defaultProps = {
  loading: false,
  error: null,
};

// :: Connected Component
// ------------------------------------------------------------------
const EditGroupConnected = (props) => {
  // Group data
  const id = props.navigation.getParam('id');
  const { group } = useGroup(id);

  // Cover images
  const coverImagesQuery = useQuery(GET_GROUP_COVER_IMAGES, {
    fetchPolicy: 'cache-and-network',
  });

  const coverImages = {
    loading: coverImagesQuery.loading,
    error: coverImagesQuery.error,
    data: get(coverImagesQuery, 'data.groupCoverImages', []),
  };

  console.log('[EditGroupConnected] group:', group);
  console.log('[EditGroupConnected] coverImages:', coverImages);

  return <EditGroup {...props} group={group} coverImages={coverImages} />;
};

// EditGroupConnected.navigationOptions = {
//   header: NavigationHeader,
//   headerTransparent: true,
//   headerMode: 'float',
// };

export default EditGroupConnected;
