import React from 'react';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { useFilters } from '@/contexts/FilterContext';

interface InfoFiltersProps {
  isVisible: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  disableTransition?: boolean;
}

export const InfoFilters: React.FC<InfoFiltersProps> = ({
  isVisible,
  containerRef,
  disableTransition = false
}) => {
  const {
    infoFilters,
    filterOptions,
    optionsLoading,
    setInfoEntityType
  } = useFilters();

  return (
    <div
      ref={containerRef}
      className={`
        ${disableTransition && "transition-opacity duration-200"}
        flex
      `}
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: disableTransition ? 'none' : undefined
      }}
    >
      <FilterDropdown
        options={filterOptions.infoSections}
        selectedOption={infoFilters.entityType}
        onSelect={(option) => option ? setInfoEntityType(option as 'tutors' | 'departments') : setInfoEntityType('tutors')}
        placeholder="Выберите тип"
        loading={optionsLoading.infoSections}
      />
    </div>
  );
};
