import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers } from '@apollosproject/ui-kit';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';
import { NotificationsProvider } from '@apollosproject/ui-notifications';
import { LiveProvider } from '@apollosproject/ui-connected';
import { AuthProvider } from '@apollosproject/ui-auth';

import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';

import NavigationService from './NavigationService';
import ClientProvider from './client';
import customTheme, { customIcons } from './theme';

const dynamicTheme = new DynamicValue('light', 'dark');

const AppProviders = (props) => {
    const theme = useDynamicValue(dynamicTheme);

    return (
        <ClientProvider {...props}>
            <NotificationsProvider
                oneSignalKey={ApollosConfig.ONE_SIGNAL_KEY}
                navigate={NavigationService.navigate}
            >
                <AuthProvider
                    navigateToAuth={() => NavigationService.navigate('Auth')}
                    navigate={NavigationService.navigate}
                    closeAuth={() => NavigationService.navigate('Onboarding')}
                >
                    <MediaPlayerProvider>
                        <AnalyticsProvider>
                            <LiveProvider>
                                <Providers
                                    themeInput={{ ...customTheme, type: theme }}
                                    iconInput={customIcons}
                                    {...props}
                                />
                            </LiveProvider>
                        </AnalyticsProvider>
                    </MediaPlayerProvider>
                </AuthProvider>
            </NotificationsProvider>
        </ClientProvider>
    );
};

export default AppProviders;