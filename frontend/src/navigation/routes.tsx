import { RouteProps } from 'react-router-dom';
import { StudyPage } from '@/pages/StudyPage';
import { EnvUnsupported } from '@/components/EnvUnsupported';

// Define app routes
export const routes: RouteProps[] = [
    {
        path: '/study/:section?',
        element: <StudyPage />
    },
    {
        path: '/env-unsupported',
        element: <EnvUnsupported />
    }
];
