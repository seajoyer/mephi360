import type { ComponentType, JSX } from 'react';

import { StudyPage } from '@/pages/StudyPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/study/tutors', Component: StudyPage },
];
