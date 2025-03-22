import React from 'react';
import { InstituteButton } from './InstituteButton';
import { Institute } from './types';

interface InstituteSelectorProps {
  activeInstitute: string | null;
  onSelect: (institute: string | null) => void;
  institutes: Institute[];
  disableAnimation?: boolean;
}

export const InstituteSelector = React.memo<InstituteSelectorProps>(({
  activeInstitute,
  onSelect,
  institutes,
  disableAnimation = false
}) => (
  <div
    className="flex gap-2 overflow-x-auto no-scrollbar w-full items-center"
    style={{
      WebkitOverflowScrolling: 'touch',
      transition: disableAnimation ? 'none' : 'all 0.1s ease-in-out'
    }}
  >
    <InstituteButton
      onClick={() => onSelect(null)}
      isSelected={activeInstitute === null}
      animationIndex={0}
      disableAnimation={disableAnimation}
    />

    {institutes.map((institute, index) => (
      <InstituteButton
        key={institute.id}
        institute={institute}
        isSelected={activeInstitute === institute.id}
        onClick={() => onSelect(institute.id)}
        animationIndex={index + 1}
        disableAnimation={disableAnimation}
      />
    ))}
  </div>
));

InstituteSelector.displayName = 'InstituteSelector';
