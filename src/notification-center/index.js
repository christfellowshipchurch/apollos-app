import { createStackNavigator } from 'react-navigation';

import NotificationCenter from './NotificationCenter';

const NotificationCenterNavigator = createStackNavigator(
    {
        NotificationCenter,
    },
    {
        initialRouteName: 'NotificationCenter',
        headerMode: 'float',
        headerTransitionPreset: 'fade-in-place',
        headerLayoutPreset: 'left',
        navigationOptions: { header: null },
    }
);

export default NotificationCenterNavigator;