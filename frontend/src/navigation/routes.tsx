import { RouteProps } from 'react-router-dom';
import { WikiPage } from '@/pages/WikiPage';
import { TutorPage } from '@/pages/TutorPage';
import { TutorsListPage } from '@/pages/TutorsListPage';
import { DepartmentPage } from '@/pages/DepartmentPage';
import { DepartmentsListPage } from '@/pages/DepartmentsListPage';
import { CirclesPage } from '@/pages/CirclesPage';
import { ClubsPage } from '@/pages/ClubsPage';
import { ClubPage } from '@/pages/ClubPage';
import { StuffPage } from '@/pages/StuffPage';
import { StuffListPage } from '@/pages/StuffListPage';
import { EnvUnsupported } from '@/components/EnvUnsupported';
import { ActivePage } from '@/pages/ActivePage';

// Define app routes with optional query parameters in paths
export const routes: RouteProps[] = [
    {
        path: '/wiki',
        element: <WikiPage />
    },
    {
        path: '/circles',
        element: <CirclesPage />
    },
    {
        path: '/clubs',
        element: <ClubsPage />
    },
    {
        path: '/active',
        element: <ActivePage />
    },
    {
        path: '/stuff',
        element: <StuffPage />
    },
    {
        path: '/stuff/list',
        element: <StuffListPage />
    },
    {
        path: '/tutors',
        element: <TutorsListPage />
    },
    {
        path: '/departments',
        element: <DepartmentsListPage />
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
