import { retrieveLaunchParams, miniApp, useSignal, initDataState as _initDataState } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import { ScrollReset } from '@/components/common/ScrollReset';
import { FilterProvider } from '@/contexts/FilterContext';
import { AddingPageProvider } from '@/contexts/AddingPageContext';
import { AppContent } from '@/components/layout/AppContent';
import { NoAccess } from '@/pages/NoAccess';

import styles from './styles.module.css'
import { PageTransition } from './common/PageTransition';

const ALLOWED_USER_IDS = [
    653376416,
    906861714,
    500362898,
];

export function App() {
    const lp = retrieveLaunchParams();
    const isDark = useSignal(miniApp.isDark);

    // Use platform from launch params or fall back to iOS
    const platform = lp?.tgWebAppPlatform === 'base' ? 'base' : 'ios';
    const theme = isDark?.valueOf() ? 'dark' : 'light';

    const initDataState = useSignal(_initDataState);
    const telegramUserId = initDataState?.user?.id;

    // Check if user has access
    const hasAccess = telegramUserId && ALLOWED_USER_IDS.includes(telegramUserId);

    if (!hasAccess) {
        return (
            <AppRoot
                appearance={theme}
                platform='ios'
                className={theme === 'dark' ? styles.custom_theme : ''}
            >
                <NoAccess />
            </AppRoot>
        );
    }

    return (
        <AppRoot
            appearance={theme}
            platform='ios'
            className={theme === 'dark' ? styles.custom_theme : ''}
        >
            <FilterProvider>
                <AddingPageProvider>
                    <HashRouter>
                        {/* ScrollReset needs to be inside the Router context */}
                        <ScrollReset />

                        {/* AppContent contains all routes and navigation elements */}
                        <AppContent>
                            <Routes>
                                {routes.map((route) => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={
                                            <PageTransition>
                                                {route.element}
                                            </PageTransition>
                                        }
                                    />
                                ))}
                                <Route
                                    path="*"
                                    element={
                                        <PageTransition>
                                            <Navigate to="/wiki"/>
                                        </PageTransition>
                                    }
                                />
                            </Routes>
                        </AppContent>
                    </HashRouter>
                </AddingPageProvider>
            </FilterProvider>
        </AppRoot>
    );
}
