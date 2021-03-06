import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import BottomSheet from 'react-native-raw-bottom-sheet';
import {
  TouchableScale,
  PaddedView,
  Button,
  H3,
  BodyText,
  FlexedView,
  withTheme,
  styled,
} from '@apollosproject/ui-kit';

import useCheckIn from '../useCheckIn';
import {
  StyledButton,
  ButtonTitle,
  ButtonIcon,
  ActivityIndicator,
  FlexedSafeAreaView,
  BottomSheetTitle,
  CheckInContainer,
  StyledFlatList,
} from './Components';
import AnimatedCheckInIcon from './AnimatedCheckIcon';
import TouchableCheckBox from './TouchableCheckBox';

const CenterAlignedPaddedView = styled(() => ({
  alignItems: 'center',
}))(PaddedView);

const CenterAlignedBodyText = styled(() => ({
  textAlign: 'center',
}))(BodyText);

const DefaultButton = ({
  isLoading,
  disabled,
  isCheckedIn,
  checkInCompleted,
}) => (
  <StyledButton
    isLoading={isLoading}
    disabled={disabled}
    pill={false}
    isCheckedIn={isCheckedIn}
  >
    {isLoading ? (
      <ActivityIndicator />
    ) : (
      <>
        <ButtonIcon name={'check'} />
        <ButtonTitle bold>
          {checkInCompleted ? 'Checked In' : 'Check In'}
        </ButtonTitle>
      </>
    )}
  </StyledButton>
);

const CheckInButton = withTheme()(
  ({ id, sheetRef, theme, ButtonComponent }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [checkInSuccess, setCheckInSuccess] = useState(false);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const {
      title,
      message,
      options,
      loading,
      error,
      enabled,
      checkInCompleted,
      checkInCurrentUser,
    } = useCheckIn({
      nodeId: id,
      onCheckInSuccess: () => setCheckInSuccess(true),
    });

    /** After a check in is completed, we set a timer
     *  and if the drawer is still open, automatically
     *  close it for the user
     */
    useEffect(
      () => {
        let timer = null;
        if (checkInSuccess) {
          timer = setTimeout(() => {
            if (drawerIsOpen) sheetRef.current.close();
          }, 5000);
        }

        return () => clearTimeout(timer);
      },
      [checkInSuccess]
    );

    const onDrawerOpen = () => {
      setDrawerIsOpen(true);
    };

    /** Called when the drawer closes */
    const reset = () => {
      /** Set the check in success state back to reset the animation */
      setCheckInSuccess(false);
      /** Update the state of the drawer */
      setDrawerIsOpen(false);
      /** Clear out my selected items */
      setSelectedItems([]);
    };

    if ((!enabled && !loading) || error || (!options.length && !loading)) {
      return null;
    }

    const CheckInButtonWrapper =
      options.length === checkInCompleted ? View : TouchableScale;
    const buttonProps =
      checkInCompleted && options.length === 1
        ? {}
        : {
            onPress: () => {
              if (enabled) {
                sheetRef.current.open();
              }
            },
          };

    const renderItem = ({ item }) => (
      <FlexedView>
        <TouchableCheckBox
          id={item.id}
          selected={item.isCheckedIn}
          disabled={loading || item.isCheckedIn}
          title={moment(item.startDateTime).format('h:mma')}
          onChange={({ selected, id: optionId }) => {
            if (selected) {
              setSelectedItems([...selectedItems, optionId]);
            } else {
              setSelectedItems(selectedItems.filter((s) => s !== optionId));
            }
          }}
        />
      </FlexedView>
    );

    return (
      <View>
        <CheckInButtonWrapper {...buttonProps}>
          <ButtonComponent
            isLoading={loading}
            disabled={loading || (checkInCompleted && options.length === 1)}
            isCheckedIn={options.find((o) => o.isCheckedIn) || checkInCompleted}
            checkInCompleted={checkInCompleted}
          />
        </CheckInButtonWrapper>
        <BottomSheet
          ref={sheetRef}
          closeOnDragDown
          closeOnPressMask={!loading}
          onOpen={onDrawerOpen}
          onClose={reset}
          height={Dimensions.get('window').height * 0.4}
          customStyles={{
            container: {
              backgroundColor: theme.colors.background.paper,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            },
          }}
        >
          {checkInSuccess ? (
            <CheckInContainer>
              <AnimatedCheckInIcon />
              <CenterAlignedPaddedView>
                <H3>{"You're all set!"}</H3>
                <BodyText>Thank you for serving with us today!</BodyText>
              </CenterAlignedPaddedView>
            </CheckInContainer>
          ) : (
            <FlexedSafeAreaView forceInset={{ top: 'never', bottom: 'always' }}>
              <BottomSheetTitle>
                <H3>{title}</H3>
                <CenterAlignedBodyText>{message}</CenterAlignedBodyText>
              </BottomSheetTitle>

              <StyledFlatList
                data={options.map((o) => ({ ...o, loading }))}
                renderItem={renderItem}
                numColumns={2}
                keyExtractor={(item) => item}
                extraData={{ loading }}
              />

              <Button
                title="Check In"
                onPress={() => {
                  checkInCurrentUser({
                    optionIds: selectedItems,
                  });
                }}
                disabled={
                  selectedItems.length === 0 || loading || checkInCompleted
                }
                loading={loading}
              />
            </FlexedSafeAreaView>
          )}
        </BottomSheet>
      </View>
    );
  }
);

CheckInButton.propTypes = {
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  ButtonComponent: PropTypes.node,
};

CheckInButton.defaultProps = {
  ButtonComponent: DefaultButton,
};

export default React.forwardRef((props, ref) => (
  <CheckInButton {...props} sheetRef={ref} />
));
