import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Tappable } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { Icon24Person_add } from '@/icons/24/person_add';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';

/**
 * Custom hook to track if an element should be in a sticky state based on scroll position
 * @param containerRef Reference to the container element
 * @param offset Offset from the top to consider the element sticky
 * @returns Boolean indicating if the element is in a sticky state
 */
const useStickyState = (containerRef: React.RefObject<HTMLElement>, offset = 0): boolean => {
  const [isSticky, setIsSticky] = useState(false);
  const positionRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Store the initial position of the element
    const storeInitialPosition = () => {
      if (!containerRef.current || positionRef.current !== null) return;
      const rect = containerRef.current.getBoundingClientRect();
      positionRef.current = rect.top + window.scrollY;
    };

    // Check if the element should be sticky based on scroll position
    const checkStickyState = () => {
      if (!containerRef.current || positionRef.current === null) return;
      const isCurrentlySticky = window.scrollY > (positionRef.current - offset - 1);
      if (isSticky !== isCurrentlySticky) {
        setIsSticky(isCurrentlySticky);
      }
    };

    // Initial setup
    setTimeout(storeInitialPosition, 100);
    checkStickyState();

    // Event listeners
    window.addEventListener('scroll', checkStickyState, { passive: true });
    window.addEventListener('resize', storeInitialPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkStickyState);
      window.removeEventListener('resize', storeInitialPosition);
    };
  }, [containerRef, isSticky, offset]);

  return isSticky;
};

/**
 * Custom hook to detect if content is scrollable horizontally
 * @param containerRef Reference to the container element
 * @param contentRef Reference to the content element
 * @returns Object with scrollable state and utility functions
 */
const useScrollable = (
  containerRef: React.RefObject<HTMLElement>,
  contentRef: React.RefObject<HTMLElement>
) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);

  const checkScrollable = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const contentWidth = contentRef.current.scrollWidth;
    const shouldBeScrollable = contentWidth > containerWidth;

    if (shouldBeScrollable !== isScrollable) {
      setIsScrollable(shouldBeScrollable);
    }

    if (!isMeasured) {
      setIsMeasured(true);
    }
  }, [isScrollable, isMeasured, containerRef, contentRef]);

  useEffect(() => {
    // Initial check
    checkScrollable();

    // Set up resize observer for more responsive updates
    if (typeof ResizeObserver !== 'undefined' && containerRef.current && contentRef.current) {
      const resizeObserver = new ResizeObserver(checkScrollable);
      resizeObserver.observe(containerRef.current);
      resizeObserver.observe(contentRef.current);

      return () => resizeObserver.disconnect();
    } else {
      // Fallback for browsers without ResizeObserver
      window.addEventListener('resize', checkScrollable);
      return () => window.removeEventListener('resize', checkScrollable);
    }
  }, [checkScrollable, containerRef, contentRef]);

  return { isScrollable, isMeasured, checkScrollable };
};

/**
 * Interface for search state
 */
interface SearchState {
  isExpanded: boolean;
  isTransitioning: boolean;
  value: string;
}

/**
 * Expandable search input component
 */
const ExpandableSearchInput = React.memo<{
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}>(({
  isExpanded,
  onExpand,
  onCollapse,
  searchValue,
  onSearchChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Manage focus when expanded state changes
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      const focusTimeout = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 200);
      return () => clearTimeout(focusTimeout);
    }
  }, [isExpanded]);

  return (
    <div
      className="transition-all duration-200 ease-in-out"
      style={{
        width: isExpanded ? '100%' : '42px',
        flexShrink: 0
      }}
    >
      <div className="relative">
        {/* Overlay for expanding the search when collapsed */}
        {!isExpanded && (
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={onExpand}
            aria-label="Expand search"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onExpand();
              }
            }}
          />
        )}

        <Input
          ref={inputRef}
          placeholder={isExpanded ? "Поиск..." : ""}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search"
          before={
            <div
              className={`transition-transform duration-200 ${isExpanded ? '' : 'translate-x-[calc(50%-12px)]'}`}
              aria-hidden="true"
            >
              <Icon24Search />
            </div>
          }
          after={
            isExpanded ? (
              <Tappable
                Component="div"
                style={{
                  display: 'flex',
                  position: 'relative',
                  zIndex: 20,
                }}
                onClick={onCollapse}
                aria-label="Close search"
              >
                <Icon24Close style={{ color: 'var(--tgui--section_fg_color)' }} />
              </Tappable>
            ) : null
          }
        />
      </div>
    </div>
  );
});

ExpandableSearchInput.displayName = 'ExpandableSearchInput';

/**
 * Filter button component
 */
const FilterButton = React.memo<{
  text: string;
  onClick: () => void;
}>(({ text, onClick }) => (
  <Button
    mode="gray"
    size="m"
    after={
      <div style={{ color: 'var(--tgui--hint_color)' }}>
        <Icon20Chevron_vertical />
      </div>
    }
    style={{
      padding: 8,
      whiteSpace: 'nowrap',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--tgui--section_bg_color)',
      width: '100%'
    }}
    onClick={onClick}
    aria-haspopup="listbox"
  >
    <div style={{ color: 'var(--tgui--hint_color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      <span className="font-medium">{text}</span>
    </div>
  </Button>
));

FilterButton.displayName = 'FilterButton';

/**
 * Add button component
 */
const AddButton = React.memo<{
  onClick: () => void;
}>(({ onClick }) => (
  <Button
    mode="gray"
    size="m"
    style={{
      padding: 8,
      background: 'var(--tgui--section_bg_color)'
    }}
    onClick={onClick}
    aria-label="Add item"
  >
    <Icon24Person_add />
  </Button>
));

AddButton.displayName = 'AddButton';

/**
 * Interface for filter section props
 */
interface FilterSectionProps {
  onFilterClick: (filter: string) => void;
  onAddClick: () => void;
  isExpanded: boolean;
  isScrollable: boolean;
  onContentRef: (node: HTMLDivElement | null) => void;
}

/**
 * Tutors filters component
 */
const TutorsFilters = React.memo<FilterSectionProps>(({
  onFilterClick,
  onAddClick,
  isExpanded,
  onContentRef
}) => (
  <div
    ref={onContentRef}
    className="transition-opacity duration-200 flex w-full"
    style={{
      opacity: isExpanded ? 0 : 1,
      pointerEvents: isExpanded ? 'none' : 'auto'
    }}
  >
    <div style={{
      flexGrow: 1,
      marginRight: '8px',
      width: 'calc(100% - 50px)'
    }}>
      <FilterButton
        text="Преподаватели"
        onClick={() => onFilterClick('departments')}
      />
    </div>
    <AddButton onClick={onAddClick} />
  </div>
));

/**
 * Clubs filters component
 */
const ClubsFilters = React.memo<FilterSectionProps>(({
  onFilterClick,
  onAddClick,
  isExpanded,
  isScrollable,
  onContentRef
}) => (
  <div
    ref={onContentRef}
    className={`flex ${isScrollable ? '' : 'w-full'} transition-opacity duration-200 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
  >
    <div className="flex flex-1 mr-2">
      <div className="flex-1 mr-2">
        <FilterButton
          text="Предмет"
          onClick={() => onFilterClick('subject')}
        />
      </div>
      <div className="flex-1">
        <FilterButton
          text="Организатор"
          onClick={() => onFilterClick('organizers')}
        />
      </div>
    </div>
    <AddButton onClick={onAddClick} />
  </div>
));

ClubsFilters.displayName = 'ClubsFilters';

/**
 * Study materials filters component - MODIFIED to remove "Институт" filter
 */
const StuffFilters = React.memo<FilterSectionProps>(({
  onFilterClick,
  onAddClick,
  isExpanded,
  isScrollable,
  onContentRef
}) => (
  <div
    ref={onContentRef}
    className={`flex ${isScrollable ? '' : 'w-full'} transition-opacity duration-200 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
  >
    <div className="flex flex-1 mr-2">
      <div className="flex-1 mr-2">
        <FilterButton
          text="Тип"
          onClick={() => onFilterClick('type')}
        />
      </div>
      <div className="flex-1 mr-2">
        <FilterButton
          text="Препод"
          onClick={() => onFilterClick('teacher')}
        />
      </div>
      <div className="flex-1 mr-2">
        <FilterButton
          text="Предмет"
          onClick={() => onFilterClick('subject')}
        />
      </div>
      <div className="flex-1">
        <FilterButton
          text="Семестр"
          onClick={() => onFilterClick('semester')}
        />
      </div>
    </div>
    <AddButton onClick={onAddClick} />
  </div>
));

StuffFilters.displayName = 'StuffFilters';

/**
 * Interface for SearchPanel props
 */
interface SearchPanelProps {
  activeSection: string;
}

/**
 * SearchPanel component
 * Provides search functionality and section-specific filters
 */
export const SearchPanel: React.FC<SearchPanelProps> = ({ activeSection }) => {
  // Unified search state
  const [searchState, setSearchState] = useState<SearchState>({
    isExpanded: false,
    isTransitioning: false,
    value: ''
  });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const prevSectionRef = useRef<string>(activeSection);

  // Custom hooks
  const isSticky = useStickyState(containerRef, 0); // Changed from 74 to 0
  const { isScrollable, checkScrollable } = useScrollable(filterContainerRef, filterContentRef);

  // Expand search handler
  const handleSearchExpand = useCallback(() => {
    setSearchState(prev => ({ ...prev, isExpanded: true, isTransitioning: true }));

    // Scroll to ensure the search panel is visible if needed
    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const stickyTop = 2; // Changed from 76 to 2
      if (containerRect.top < stickyTop) return;
      window.scrollTo({
        top: window.scrollY + containerRect.top - stickyTop,
        behavior: 'smooth'
      });
    }

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setSearchState(prev => ({ ...prev, isTransitioning: false }));
    }, 200);
  }, []);

  // Collapse search handler
  const handleSearchCollapse = useCallback(() => {
    setSearchState(prev => ({ ...prev, isExpanded: false, isTransitioning: true, value: '' }));

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setSearchState(prev => ({ ...prev, isTransitioning: false }));

      // Blur the input field to hide the virtual keyboard on mobile
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 200);
  }, []);

  // Filter click handler
  const handleFilterClick = useCallback((filter: string) => {
    console.log(`Filter clicked: ${filter}`);
    // Implement actual filter logic here
  }, []);

  // Add item handler
  const handleAddClick = useCallback(() => {
    console.log('Add a new item');
    // Implement actual add item logic here
  }, []);

  // Handle search value changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchState(prev => ({ ...prev, value }));
  }, []);

  // Ensure immediate measurement for initial section
  useEffect(() => {
    // Force immediate measurement for initial render
    setTimeout(() => {
      checkScrollable();
    }, 0);
  }, [checkScrollable]);

  // Handle section changes
  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      // Re-measure when section changes
      checkScrollable();

      // Close search if expanded
      if (searchState.isExpanded) {
        handleSearchCollapse();
      }
    }

    prevSectionRef.current = activeSection;
  }, [activeSection, checkScrollable, searchState.isExpanded, handleSearchCollapse]);

  // Content ref callback
  const contentRefCallback = useCallback((node: HTMLDivElement | null) => {
    filterContentRef.current = node;
    checkScrollable();
  }, [checkScrollable]);

  // Always maintain consistent right padding
  const rightPadding = '8px';

  // Render current section filters
  const renderSectionFilters = useCallback(() => {
    const commonProps = {
      onFilterClick: handleFilterClick,
      onAddClick: handleAddClick,
      isExpanded: searchState.isExpanded,
      isScrollable,
      onContentRef: contentRefCallback
    };

    switch (activeSection) {
      case 'clubs':
        return <ClubsFilters {...commonProps} />;
      case 'stuff':
        return <StuffFilters {...commonProps} />;
      case 'tutors':
      default:
        return <TutorsFilters {...commonProps} />;
    }
  }, [
    activeSection,
    handleFilterClick,
    handleAddClick,
    searchState.isExpanded,
    isScrollable,
    contentRefCallback
  ]);

  return (
    <div
      data-searchpanel
      className="sticky top-0 z-20 pt-1 pb-2 visible" // Changed from top-19 to top-0
      ref={containerRef}
      style={{
        backgroundColor: 'var(--tgui--secondary_bg_color)',
        boxShadow: isSticky ? '0 1px 0 var(--tgui--quartenary_bg_color)' : 'none',
        transition: 'box-shadow 0.2s ease-in-out, padding 0.2s ease-in-out',
        width: 'calc(100% + 16px)',
        marginLeft: '-8px',
        paddingLeft: '8px',
        paddingRight: rightPadding,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Hide scrollbar CSS */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="flex gap-2">
        {/* Search Input */}
        <ExpandableSearchInput
          isExpanded={searchState.isExpanded}
          onExpand={handleSearchExpand}
          onCollapse={handleSearchCollapse}
          searchValue={searchState.value}
          onSearchChange={handleSearchChange}
        />

        {/* Filters Container */}
        <div
          ref={filterContainerRef}
          className="relative overflow-hidden no-scrollbar transition-all duration-200 ease-in-out"
          style={{
            width: searchState.isExpanded && !searchState.isTransitioning
              ? '0' : 'calc(100% - 42px - 8px)',
            overflowX: isScrollable ? 'auto' : 'hidden',
            visibility: searchState.isExpanded && !searchState.isTransitioning ? 'hidden' : 'visible'
          }}
        >
          {isScrollable && !searchState.isExpanded ? (
            <div className="overflow-x-auto no-scrollbar" style={{ width: '100%' }}>
              {renderSectionFilters()}
            </div>
          ) : (
            renderSectionFilters()
          )}
        </div>
      </div>

      {/* Shadow extension element */}
      <div className="absolute bottom-0 left-0 right-0 h-px" aria-hidden="true" />
    </div>
  );
};

export default SearchPanel;
