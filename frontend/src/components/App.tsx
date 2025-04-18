import { retrieveLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import { ScrollReset } from '@/components/common/ScrollReset';
import { FilterProvider } from '@/contexts/FilterContext';
import { TabBar } from '@/components/layout/TabBar';
import { PageTransition } from '@/components/common/PageTransition';

import styles from './styles.module.css'

export function App() {
    const lp = retrieveLaunchParams();
    const isDark = useSignal(miniApp.isDark);

    // Use platform from launch params or fall back to iOS
    const platform = lp?.tgWebAppPlatform === 'base' ? 'base' : 'ios';
    const theme = isDark?.valueOf() ? 'dark' : 'light';

    console.log(lp.tgWebAppThemeParams)

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

                        {/* TabBar now at app level, outside of routes */}
                        <TabBar />
                    </div>
                </HashRouter>
            </FilterProvider>
        </AppRoot>
    );
}
