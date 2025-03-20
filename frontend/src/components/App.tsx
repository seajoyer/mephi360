import { retrieveLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';
import { ScrollReset } from '@/components/common/ScrollReset';

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
            <HashRouter>
                {/* ScrollReset needs to be inside the Router context */}
                <ScrollReset />
                <Routes>
                    {routes.map((route) => <Route key={route.path} {...route} />)}
                    <Route path="*" element={<Navigate to="/study/tutors"/>}/>
                </Routes>
            </HashRouter>
        </AppRoot>
    );
}
