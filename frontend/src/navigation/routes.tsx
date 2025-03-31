import { RouteProps } from 'react-router-dom';
import { WikiPage } from '@/pages/WikiPage';
import { TutorPage } from '@/pages/TutorPage';
import { TutorsListPage } from '@/pages/TutorsListPage';
import { DepartmentPage } from '@/pages/DepartmentPage';
import { DepartmentsListPage } from '@/pages/DepartmentsListPage';
import { CirclesPage } from '@/pages/CirclesPage';
import { StuffPage } from '@/pages/StuffPage';
import { StuffListPage } from '@/pages/StuffListPage';
import { EnvUnsupported } from '@/components/EnvUnsupported';

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
        path: '/active',
        element: <WikiPage /> // Will be replaced with dedicated page
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
