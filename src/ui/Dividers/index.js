import { View, StyleSheet } from 'react-native';
import Color from 'color';

import { styled } from '@apollosproject/ui-kit';

// eslint-disable-next-line import/prefer-default-export
export const HorizontalDivider = styled(({ theme }) => ({
    height: StyleSheet.hairlineWidth,
    backgroundColor: Color(
        Color(theme.colors.screen).isLight()
            ? theme.colors.black
            : theme.colors.white
    ).fade(0.1),
    opacity: 0.5,
    width: '70%',
    marginVertical: theme.sizing.baseUnit * 2,
    alignSelf: 'center',
}))(View);