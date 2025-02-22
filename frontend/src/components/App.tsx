/* import { retrieveLaunchParams, miniApp, useSignal, themeParams } from '@telegram-apps/sdk-react'; */
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';

export function App() {
    /* const lp = retrieveLaunchParams(); */
    /* const isDark = useSignal(miniApp.isDark); */

  return (
    <AppRoot
      appearance='dark'
      platform='ios'
    >
      <HashRouter>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/study/tutors"/>}/>
        </Routes>
      </HashRouter>
    </AppRoot>
  );
}
