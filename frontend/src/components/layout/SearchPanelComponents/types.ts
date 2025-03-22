import { ComponentType } from 'react';

export interface Institute {
  id: string;
  Icon: ComponentType;
}

export interface UIState {
  isSearchExpanded: boolean;
  isSearchTransitioning: boolean;
  isInstituteExpanded: boolean;
  isInstituteTransitioning: boolean;
  isSectionChanging: boolean;
}
