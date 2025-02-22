import type { ComponentType, JSX } from 'react';

import { TutorsPage } from '@/pages/TutorsPage.tsx';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/study/tutors', Component: TutorsPage },
];
