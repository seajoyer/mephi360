import React, { useRef, useEffect, useState } from 'react';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { useFilters } from '@/contexts/FilterContext';
import { AddButton } from './AddButton';

interface StuffFiltersProps {
  isVisible: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onAddClick: () => void;
  disableTransition?: boolean;
}

export const StuffFilters: React.FC<StuffFiltersProps> = ({
  isVisible,
  containerRef,
  onAddClick,
  disableTransition = false
}) => {
  const {
    stuffFilters,
    filterOptions,
    optionsLoading,
    setStuffType,
    setStuffTeacher,
    setStuffSubject,
    setStuffSemester
  } = useFilters();

  // Measure container width to determine if scrolling is needed
  const filtersRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  // Check if filters need to be scrollable
  useEffect(() => {
    if (!filtersRef.current) return;

    const checkScrollable = () => {
      if (!filtersRef.current || !isVisible) return;

      const containerWidth = filtersRef.current.clientWidth;
      const contentWidth = filtersRef.current.scrollWidth;

      // If content is wider than container, make it scrollable
      setIsScrollable(contentWidth > containerWidth + 5); // Adding a small buffer
    };

    // Check initially and on resize
    checkScrollable();

    const resizeObserver = new ResizeObserver(checkScrollable);
    if (filtersRef.current) {
      resizeObserver.observe(filtersRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isVisible, stuffFilters]);

  return (
    <div
      ref={containerRef}
      className={`
        ${!disableTransition && "transition-opacity duration-200"}
        flex 
      `}
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: disableTransition ? 'none' : undefined
      }}
    >
      <div
        ref={filtersRef}
        className={`
          flex-1
          ${isScrollable && 'overflow-x-auto no-scrollbar'}
        `}
        style={{
          maxWidth: 'calc(100% - 50px)', // Leave space for AddButton
        }}
      >
        <div
          className={`flex gap-2`}
        >
          <div className={`
            ${!isScrollable && 'flex-1'}
          `}>
            <FilterDropdown
              options={filterOptions.materialTypes}
              selectedOption={stuffFilters.type}
              onSelect={setStuffType}
              placeholder="Тип"
              loading={optionsLoading.materialTypes}
            />
          </div>
          <div className={`
            ${!isScrollable && 'flex-1'}
          `}>
            <FilterDropdown
              options={filterOptions.materialTeachers}
              selectedOption={stuffFilters.teacher}
              onSelect={setStuffTeacher}
              placeholder="Препод"
              loading={optionsLoading.materialTeachers}
            />
          </div>
          <div className={`
            ${!isScrollable && 'flex-1'}
          `}>
            <FilterDropdown
              options={filterOptions.materialSubjects}
              selectedOption={stuffFilters.subject}
              onSelect={setStuffSubject}
              placeholder="Предмет"
              loading={optionsLoading.materialSubjects}
            />
          </div>
          <div className={`
            ${!isScrollable && 'flex-1'}
          `}>
            <FilterDropdown
              options={filterOptions.materialSemesters}
              selectedOption={stuffFilters.semester}
              onSelect={setStuffSemester}
              placeholder="Семестр"
              loading={optionsLoading.materialSemesters}
            />
          </div>
        </div>
      </div>
      <AddButton onClick={onAddClick} />
    </div>
  );
};
