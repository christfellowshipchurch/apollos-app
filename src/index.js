/* eslint-disable react/jsx-handler-names */

import hoistNonReactStatic from 'hoist-non-react-statics';
import React, { useState } from 'react';
import 'react-native-gesture-handler'; // required for react-navigation
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import { Text, Appearance, Platform, UIManager } from 'react-native';
import { BackgroundView, NavigationService } from '@apollosproject/ui-kit';
// import Passes from '@apollosproject/ui-passes';
import { MapViewConnected as Location } from '@apollosproject/ui-mapview';
import { ProtectedRoute } from '@apollosproject/ui-auth';
import ScreenOrientation from 'screen-orientation';
import { ApollosThemeProvider } from './theme/context';
import {
  ChatChannelSingle,
  ChatChannelListNavigator,
  StreamChatOverlayProvider,
  StreamChatClientContextProvider,
} from './stream-chat';
import Auth from './auth';
import StatusBar from './ui/StatusBar';

import { ProvidersStack } from './context';
import ContentSingle from './content-single';
import LiveStreamSingle from './live-stream-single';
import ScriptureSingle from './scripture-single';
import Tabs from './tabs';

import NodeSingle from './node-single';
import ContentFeed from './content-feed';
import EditUser from './edit-user';
import GroupSingle, { MembersFeed } from './group-single';
import EditGroup from './edit-group';
import NotificationCenter, { NotificationSingle } from './notification-center';
import PrayerRequestSingle from './prayer-request-single';
import MyPrayerRequestsFeed from './my-prayer-requests-feed';

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

/**
 * Sets an experimental animation flag in accordance with this suggestion in the RN docs:
 *
 * https://reactnative.dev/docs/layoutanimation
 */
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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

const StackNavigator = (props) => (
  <Navigator
    {...props}
    initialRouteName="ProtectedRoute"
    screenOptions={{
      headerShown: false,
      stackPresentation: 'fullScreenModal',
    }}
  >
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
      name="ChatChannelList"
      component={ChatChannelListNavigator}
      options={{
        title: 'Messages',
        stackPresentation: 'push',
        headerShown: true,
      }}
    />
    <Screen
      name="ChatChannelSingle"
      component={ChatChannelSingle}
      options={({ route }) => ({
        title: route.params?.itemTitle || 'Chat',
        stackPresentation: 'push',
        headerShown: true,
      })}
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
      // options={{ title: 'Edit My Group', stackPresentation: 'push' }}
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
        gestureEnabled: false,
        stackPresentation: 'push',
        headerShown: true,
      }}
    />
    <Screen
      name="Location"
      component={Location}
      options={{ headerShown: true }}
    />
    <Screen
      name="GroupMembersFeed"
      component={MembersFeed}
      options={{
        title: 'Group Members',
        stackPresentation: 'modal',
      }}
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
      options={{
        title: 'Updates',
        stackPresentation: 'push',
        headerShown: true,
      }}
    />
    <Screen
      name="NotificationSingle"
      component={NotificationSingle}
      options={{
        title: 'Update',
        stackPresentation: 'modal',
      }}
    />
    <Screen
      name="Onboarding"
      component={Onboarding}
      options={{
        title: 'Onboarding',
        gestureEnabled: false,
        stackPresentation: 'push',
        headerLargeTitle: true,
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
    <Screen name="Tabs" component={Tabs} />
  </Navigator>
);

const NavigationContainerWithTheme = (props) => {
  // todo : dynamically switch between current themes. Currently disabled due to rendering limitations with React Pure Component and the Apollos Theme
  // const scheme = useColorScheme();
  const [scheme] = useState(Appearance.getColorScheme());
  const light = {
    ...DefaultTheme,
    colors: {
      primary: '#00aeef',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#303030',
      border: 'transparent',
      notification: '#d52158',
    },
  };
  const dark = {
    ...DarkTheme,
    colors: {
      primary: '#00aeef',
      background: '#0d0d0d',
      card: '#0d0d0d',
      text: '#F8F7F4',
      border: 'transparent',
      notification: '#d52158',
    },
  };

  return (
    <NavigationContainer
      ref={NavigationService.setTopLevelNavigator}
      onReady={NavigationService.setIsReady}
      theme={scheme === 'dark' ? dark : light}
    >
      <ProvidersStack>
        <StreamChatOverlayProvider>
          <StackNavigator {...props} />
        </StreamChatOverlayProvider>
      </ProvidersStack>
    </NavigationContainer>
  );
};

const App = (props) => (
  <StreamChatClientContextProvider>
    <ApollosThemeProvider>
      <BackgroundView>
        <StatusBar />
        <ScreenOrientation />
        <NavigationContainerWithTheme {...props} />
      </BackgroundView>
    </ApollosThemeProvider>
  </StreamChatClientContextProvider>
);

export default App;
