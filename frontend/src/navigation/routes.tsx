import { RouteProps } from 'react-router-dom';
import { StudyPage } from '@/pages/StudyPage';
import { TutorPage } from '@/pages/TutorPage';
import { DepartmentPage } from '@/pages/DepartmentPage';
import { EnvUnsupported } from '@/components/EnvUnsupported';

// Define app routes
export const routes: RouteProps[] = [
    {
        path: '/study/:section?',
        element: <StudyPage />
    },
    {
        path: '/tutor/:id',
        element: <TutorPage />
    },
    {
        path: '/department/:id',
        element: <DepartmentPage />
    },
    {
        path: '/env-unsupported',
        element: <EnvUnsupported />
    }
];
