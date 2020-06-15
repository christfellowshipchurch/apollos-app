/* eslint-disable react-native/no-unused-styles */
import React, { useState, useRef } from 'react';
import { Platform, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  Icon,
  ButtonIcon,
  UIText,
  Touchable,
} from '@apollosproject/ui-kit';

import { HeaderRight } from '../../navigation';

const LoopIcon = withTheme(({ theme, isFocused }) => ({
  fill: isFocused ? theme.colors.text.primary : theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  style: {
    marginLeft: theme.sizing.baseUnit,
  },
}))(Icon);

const ClearSearchButton = withTheme(({ theme, isVisible }) => ({
  fill: theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  iconPadding: theme.helpers.rem(0.75),
  style: {
    opacity: isVisible ? 1 : 0,
  },
}))(ButtonIcon);

const TextInputWrapper = styled(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: theme.sizing.baseBorderRadius,
  backgroundColor: theme.colors.background.screen,
  overflow: 'hidden',
}))(View);

const Input = withTheme(({ theme }) => ({
  placeholderTextColor: theme.colors.text.tertiary,
  selectionColor: theme.colors.primary,
  style: {
    color: theme.colors.text.primary, // fixes android text color when switching theme types
    flexGrow: 1, // fixes weird text behind icon (ios) and placeholder clipping (android) bugs
    height: theme.helpers.rem(2.5), // we have to have a height to make this display correctly. using typographic unit to scale with text size.
    paddingVertical: 0, // removes weird "default" padding
    paddingHorizontal: theme.sizing.baseUnit * 0.5,
    fontSize: theme.helpers.rem(0.875),
    fontFamily: theme.typography.ui.regular,
    ...Platform.select({
      // aligns text with icon on ios
      ios: {
        paddingTop: 1,
      },
    }),
  },
}))(TextInput);

const CancelButtonText = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit, // padding away from end of search field
  color: theme.colors.text.link, // we use UIText here instead of `ButtonLink` becuase onLayout has issues with nested text on Android
}))(UIText);

const CancelButton = ({ onPress }) => (
  <Touchable onPress={onPress}>
    <CancelButtonText>cancel</CancelButtonText>
  </Touchable>
);

const Layout = styled(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: theme.sizing.baseUnit, // we only need to worry about the left because the `HeaderRight` component has padding for the right
}))(View);

const SearchInputHeader = ({
  placeholder,
  isFocused: initialIsFocused,
  onFocus,
  onChangeText,
  value: initialValue,
  onSubmit,
}) => {
  const inputRef = useRef();
  const [isFocused, setIsFocused] = useState(initialIsFocused);
  const [value, setValue] = useState(initialValue);
  const handleOnFocus = (focus) => {
    setIsFocused(focus);
    onFocus(focus);
  };

  const handleOnTextChange = (newValue) => {
    setValue(newValue);
    onChangeText(newValue);
  };

  return (
    <Layout vertical={false}>
      <TextInputWrapper>
        <LoopIcon name={'search'} isFocused={isFocused} />
        <Input
          forwardedRef={inputRef}
          isFocused={isFocused} // used for styling
          onFocus={() => handleOnFocus(true)}
          onChangeText={handleOnTextChange}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          returnKeyType={'search'}
          value={value}
        />
        <ClearSearchButton
          onPress={() => handleOnTextChange('')}
          name={'close'}
          isVisible={!!value && value !== ''}
        />
      </TextInputWrapper>
      {isFocused ? (
        <CancelButton onPress={() => handleOnFocus(false)} />
      ) : (
          <HeaderRight />
        )}
    </Layout>
  );
};

SearchInputHeader.propTypes = {
  placeholder: PropTypes.string,
  isFocused: PropTypes.bool,
  onFocus: PropTypes.func,
  onChangeText: PropTypes.func,
  onSubmit: PropTypes.func,
  value: PropTypes.string,
};

SearchInputHeader.defaultProps = {
  placeholder: 'Search',
  isFocused: false,
  onFocus: () => null,
  onChangeText: () => null,
  onSubmit: () => null,
  value: '',
};

export default SearchInputHeader;
