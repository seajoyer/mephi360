import React, { useRef, useEffect, useState } from 'react';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { useFilters } from '@/contexts/FilterContext';
import { AddButton } from './AddButton';

interface ClubsFiltersProps {
  isVisible: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onAddClick: () => void;
  disableTransition?: boolean;
}

export const ClubsFilters: React.FC<ClubsFiltersProps> = ({
  isVisible,
  containerRef,
  onAddClick,
  disableTransition = false
}) => {
  const {
    clubsFilters,
    filterOptions,
    optionsLoading,
    setClubSubject,
    setClubOrganizer
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
  }, [isVisible, clubsFilters]);

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
              options={filterOptions.clubSubjects}
              selectedOption={clubsFilters.subject}
              onSelect={setClubSubject}
              placeholder="Предмет"
              loading={optionsLoading.clubSubjects}
            />
          </div>
          <div className={`
            ${!isScrollable && 'flex-1'}
          `}>
            <FilterDropdown
              options={filterOptions.clubOrganizers}
              selectedOption={clubsFilters.organizer}
              onSelect={setClubOrganizer}
              placeholder="Организатор"
              loading={optionsLoading.clubOrganizers}
            />
          </div>
        </div>
      </div>
      <AddButton onClick={onAddClick} />
    </div>
  );
};
;
