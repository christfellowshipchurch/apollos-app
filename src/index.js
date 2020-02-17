import hoistNonReactStatic from 'hoist-non-react-statics';
import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import './icon-library';

import { BackgroundView } from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MediaPlayer } from '@apollosproject/ui-media-player';
import Auth, { ProtectedRoute } from '@apollosproject/ui-auth';

import Providers from './MainProvider';
import NavigationService from './NavigationService';
import ContentSingle from './content-single';
import { RowContentFeed } from './content-feed';
import Tabs from './tabs';
import Location from './locations';
import UserWebBrowser from './user-web-browser';
import Login from './login';
import { PrivacyPolicy, TermsOfUse, ValueProp } from './app-information';
import { EditCurrentUserProfile } from './profile';
import Settings from './settings';

// Hack to avoid needing to pass emailRequired through the navigator.navigate
const EnhancedAuth = (props) => <Auth {...props} emailRequired />;
// 😑
hoistNonReactStatic(EnhancedAuth, Auth);

const ProtectedRouteWithSplashScreen = (props) => {
  const handleOnRouteChange = () => SplashScreen.hide();

  return <ProtectedRoute {...props} onRouteChange={handleOnRouteChange} />;
};

const AppContent = createStackNavigator(
  {
    Tabs,
    ContentSingle,
    Auth: EnhancedAuth,
    Location,
    Passes,
    UserWebBrowser,
    EditCurrentUserProfile,
  },
  {
    initialRouteName: 'Tabs',
    mode: 'modal',
    headerMode: 'screen',
  }
);

const AppInfo = createStackNavigator(
  {
    Settings,
    PrivacyPolicy,
    TermsOfUse,
    ValueProp,
  },
  {
    initialRouteName: 'Settings',
    headerMode: 'screen',
  }
);

// TODO : refactor this... it's garbage
const AppContentFeeds = createStackNavigator(
  {
    RowContentFeed,
  },
  {
    initialRouteName: 'RowContentFeed',
    // mode: 'modal',
    headerMode: 'screen',
    navigationOptions: {
      gesturesEnabled: true,
    },
  }
);

const AppNavigator = createStackNavigator(
  {
    ProtectedRoute: ProtectedRouteWithSplashScreen,
    Tabs: AppContent,
    LandingScreen: Login,
    AppInfo,
    AppContentFeeds,
    // EventFeeds,
  },
  {
    initialRouteName: 'ProtectedRoute',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
  }
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => (
  <Providers>
    <BackgroundView>
      <AppContainer
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
      <MediaPlayer />
    </BackgroundView>
  </Providers>
);

export default App;
