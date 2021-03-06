import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { withTheme } from '@apollosproject/ui-kit';

import HeaderButtons from '../HeaderButtons';
import Give from './Give';

const { Navigator, Screen } = createNativeStackNavigator();

const GiveNavigator = (props) => (
  <Navigator initialRouteName="Give" {...props}>
    <Screen component={Give} name="Give" />
  </Navigator>
);

const EnhancedNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerRight: HeaderButtons,
    headerLargeTitle: true,
    headerHideShadow: true,
  },
}))(GiveNavigator);

export default Give;
