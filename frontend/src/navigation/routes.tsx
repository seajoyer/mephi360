import { RouteProps } from 'react-router-dom';
import { StudyPage } from '@/pages/StudyPage';
import { TutorPage } from '@/pages/TutorPage';
import { EnvUnsupported } from '@/components/EnvUnsupported';

// Define app routes
export const routes: RouteProps[] = [
    {
        path: '/study/:section?',
        element: <StudyPage />
    },
    {
        path: '/tutor/1',
        element: <TutorPage />
    },
    {
        path: '/env-unsupported',
        element: <EnvUnsupported />
    }
];
