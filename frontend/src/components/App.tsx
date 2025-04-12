import { retrieveLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import { ScrollReset } from '@/components/common/ScrollReset';
import { FilterProvider } from '@/contexts/FilterContext';
import { TabBar } from '@/components/layout/TabBar';
import { PageTransition } from '@/components/layout/PageTransition';

export function App() {
    const lp = retrieveLaunchParams();
    const isDark = useSignal(miniApp.isDark);

    // Use platform from launch params or fall back to iOS
    const platform = lp?.tgWebAppPlatform === 'base' ? 'base' : 'ios';

    return (
        <AppRoot
            appearance={isDark?.valueOf() ? 'dark' : 'light'}
            platform='ios'
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
