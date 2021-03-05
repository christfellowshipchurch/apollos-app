/* eslint-disable react/jsx-handler-names */

import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';
import 'react-native-gesture-handler'; // required for react-navigation
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import { Platform, Text } from 'react-native';
import {
  BackgroundView,
  NavigationService,
  withTheme,
} from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MapViewConnected as Location } from '@apollosproject/ui-mapview';
import { ProtectedRoute } from '@apollosproject/ui-auth';
import ScreenOrientation from 'screen-orientation';
import Auth from './auth';
import StatusBar from './ui/StatusBar';

import Providers from './Providers';
import ContentSingle from './content-single';
import LiveStreamSingle from './live-stream-single';
import ScriptureSingle from './scripture-single';
import Tabs from './tabs';

import NodeSingle from './node-single';
import ContentFeed from './content-feed';
import EditUser from './edit-user';
import GroupSingle from './group-single';
import EditGroup from './edit-group';
import NotificationCenter from './notification-center';
import PrayerRequestSingle from './prayer-request-single';
import MyPrayerRequestsFeed from './my-prayer-requests-feed';
import ChatChannelsList from './chat/ChannelsList';
import ChatChannel from './chat/Channel';

import LandingScreen from './LandingScreen';
import Onboarding from './ui/Onboarding';

// bugsnag configuration
// eslint-disable-next-line
// import bugsnag from './bugsnag';

import 'core-js/features/promise';

/**
 * Disabled Font Scaling in iOS
 * https://stackoverflow.com/questions/41807843/how-to-disable-font-scaling-in-react-native-for-ios-app
 */
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

enableScreens(); // improves performance for react-navigation

const ProtectedRouteWithSplashScreen = (props) => {
  const handleOnRouteChange = () => SplashScreen.hide();

  return (
    <ProtectedRoute
      {...props}
      onRouteChange={handleOnRouteChange}
      loggedOutRouteName="LandingScreen"
    />
  );
};

// Hack to avoid needing to pass emailRequired through the navigator.navigate
const EnhancedAuth = (props) => <Auth {...props} emailRequired={false} />;
// 😑
hoistNonReactStatic(EnhancedAuth, Auth);

const { Navigator, Screen } = createNativeStackNavigator();

const ThemedNavigationContainer = withTheme(({ theme, ...props }) => ({
  ...props,
  theme: {
    ...DefaultTheme,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background.paper,
      card: theme.colors.background.paper,
      text: theme.colors.text.primary,
      border: 'transparent',
      notification: theme.colors.alert,
    },
  },
}))(NavigationContainer);

const ThemedNavigator = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerShown: false,
    stackPresentation: 'fullScreenModal',
  },
}))(Navigator);

const StackNavigator = (props) => (
  <ThemedNavigator {...props} initialRouteName="ProtectedRoute">
    <Screen
      name="Auth"
      component={EnhancedAuth}
      options={{
        title: 'Login',
        gestureEnabled: false,
        swipeEnabled: false,
        stackPresentation: 'push',
      }}
    />
    <Screen
      name="ChatChannel"
      component={ChatChannel}
      options={{ title: 'Chat Channel' }}
    />
    <Screen
      name="ChatChannelsList"
      component={ChatChannelsList}
      options={{ title: 'ChatChannelsList' }}
    />
    <Screen
      name="ContentFeed"
      component={ContentFeed}
      options={({ route }) => ({
        title: route.params?.itemTitle || 'Content Feed',
        stackPresentation: 'push',
        headerShown: true,
      })}
    />
    <Screen
      name="ContentSingle"
      component={ContentSingle}
      options={{
        title: 'Content',
        // stackPresentation: 'push',
      }}
    />
    <Screen
      name="EditGroup"
      component={EditGroup}
      options={{ title: 'Edit My Group', stackPresentation: 'modal' }}
    />
    <Screen
      name="EditCurrentUser"
      component={EditUser}
      options={{ title: 'Edit My Profile' }}
    />
    <Screen
      name="GroupSingle"
      component={GroupSingle}
      options={{ title: 'Group' }}
    />
    <Screen
      name="LandingScreen"
      component={LandingScreen}
      options={{ headerShown: false }}
    />
    <Screen
      name="LiveStreamSingle"
      component={LiveStreamSingle}
      options={{
        title: 'Live Stream',
        // stackPresentation: 'push',
      }}
    />
    <Screen
      name="Location"
      component={Location}
      options={{ headerShown: true }}
    />
    <Screen
      name="MyPrayerRequestsFeed"
      component={MyPrayerRequestsFeed}
      options={{ title: 'My Prayer Requests' }}
    />
    <Screen
      name="NodeSingle"
      component={NodeSingle}
      options={{ title: 'Node' }}
    />
    <Screen
      name="NotificationCenter"
      component={NotificationCenter}
      options={{ title: 'Notification Center', stackPresentation: 'modal' }}
    />
    <Screen
      name="Onboarding"
      component={Onboarding}
      options={{
        title: 'Onboarding',
        gestureEnabled: false,
        stackPresentation: 'push',
      }}
    />
    {/* <Screen
    name="Passes"
    component={Passes}
    options={{ title: 'Check-In Pass' }}
  /> */}
    <Screen
      name="PrayerRequestSingle"
      component={PrayerRequestSingle}
      options={{ title: 'Prayer Request Single', stackPresentation: 'modal' }}
    />
    <Screen name="ProtectedRoute" component={ProtectedRouteWithSplashScreen} />
    <Screen
      name="ScriptureSingle"
      component={ScriptureSingle}
      options={{
        stackPresentation: 'modal',
      }}
    />
    <Screen
      name="Tabs"
      component={Tabs}
      options={{ title: 'Home' }}
      // screenOptions={{ headerShown: true }}
    />
  </ThemedNavigator>
);

const App = (props) => (
  <Providers>
    <BackgroundView>
      <StatusBar />
      <ScreenOrientation />
      <ThemedNavigationContainer
        ref={NavigationService.setTopLevelNavigator}
        onReady={NavigationService.setIsReady}
      >
        <StackNavigator {...props} />
      </ThemedNavigationContainer>
    </BackgroundView>
  </Providers>
);

export default App;
