import { retrieveLaunchParams, miniApp, useSignal, initDataState as _initDataState } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter, useLocation } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import { ScrollReset } from '@/components/common/ScrollReset';
import { FilterProvider } from '@/contexts/FilterContext';
import { TabBar } from '@/components/layout/TabBar';
import { PageTransition } from '@/components/common/PageTransition';
import { NoAccess } from '@/pages/NoAccess';

import styles from './styles.module.css'

const ALLOWED_USER_IDS = [
  653376416,
  906861714,
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
                <HashRouter>
                    {/* ScrollReset needs to be inside the Router context */}
                    <ScrollReset />

                    <div className="app-container relative">
                        <div className="app-content">
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
                        </div>

                        {/* Conditionally render the TabBar */}
                        <TabBarWrapper />
                    </div>
                </HashRouter>
            </FilterProvider>
        </AppRoot>
    );
}

// TabBarWrapper component to conditionally render the TabBar
const TabBarWrapper = () => {
    const location = useLocation();
    const hideTabBar = location.pathname === '/add';

    if (hideTabBar) {
        return null;
    }

    return <TabBar />;
};
