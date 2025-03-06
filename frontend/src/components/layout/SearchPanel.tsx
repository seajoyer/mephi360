import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Tappable } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { Icon24Person_add } from '@/icons/24/person_add';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';

// Custom hook for tracking sticky state
const useStickyState = (containerRef, offset = 0) => {
  const [isSticky, setIsSticky] = useState(false);
  const positionRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const storeInitialPosition = () => {
      if (!containerRef.current || positionRef.current !== null) return;
      const rect = containerRef.current.getBoundingClientRect();
      positionRef.current = rect.top + window.scrollY;
    };

    storeInitialPosition();

    const checkStickyState = () => {
      if (!containerRef.current || positionRef.current === null) return;
      const isCurrentlySticky = window.scrollY > (positionRef.current - offset - 1);
      if (isSticky !== isCurrentlySticky) {
        setIsSticky(isCurrentlySticky);
      }
    };

    setTimeout(storeInitialPosition, 100);

    checkStickyState();
    window.addEventListener('scroll', checkStickyState, { passive: true });
    window.addEventListener('resize', storeInitialPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkStickyState);
      window.removeEventListener('resize', storeInitialPosition);
    };
  }, [containerRef, isSticky, offset]);

  return isSticky;
};

// Custom hook for detecting scrollable content
const useScrollable = (containerRef, contentRef) => {
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
  }, [isScrollable, isMeasured]);

  useEffect(() => {
    // Initial check
    checkScrollable();

    // Set up resize observer
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
  }, [checkScrollable]);

  return { isScrollable, isMeasured, checkScrollable };
};

// Expandable Search Input Component
const ExpandableSearchInput = React.memo(({
  isExpanded,
  onExpand,
  onCollapse,
  searchValue,
  onSearchChange
}) => {
  const inputRef = useRef(null);

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
        {!isExpanded && (
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={onExpand}
            aria-label="Expand search"
          />
        )}

        <Input
          ref={inputRef}
          placeholder={isExpanded ? "Поиск..." : ""}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          before={
            <div className={`transition-transform duration-200 ${isExpanded ? '' : 'translate-x-[calc(50%-12px)]'}`}>
              <Icon24Search />
            </div>
          }
          after={
            isExpanded && (
              <Tappable
                Component="div"
                style={{
                  display: 'flex',
                  position: 'relative',
                  zIndex: 20,
                }}
                onClick={onCollapse}
              >
                <Icon24Close style={{ color: 'var(--tgui--section_fg_color)' }} />
              </Tappable>
            )
          }
        />
      </div>
    </div>
  );
});

// Filter Button Component
const FilterButton = React.memo(({ text, onClick, fullWidth = false, equalWidth = false }) => (
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
  >
    <div style={{ color: 'var(--tgui--hint_color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      <span className="font-medium">{text}</span>
    </div>
  </Button>
));

// Add Button Component
const AddButton = React.memo(({ onClick }) => (
  <div className="transition-all duration-200 ease-in-out flex-shrink-0">
    <Button
      mode="gray"
      size="m"
      style={{
        padding: 8,
        background: 'var(--tgui--section_bg_color)'
      }}
      onClick={onClick}
    >
      <Icon24Person_add />
    </Button>
  </div>
));

// Section-specific filters
const TutorsFilters = React.memo(({ onFilterClick, onAddClick, isExpanded, onContentRef }) => (
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
        text="Все кафедры"
        onClick={() => onFilterClick('departments')}
        fullWidth={true}
      />
    </div>
    <AddButton onClick={onAddClick} />
  </div>
));

const ClubsFilters = React.memo(({
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
          text="Все предметы"
          onClick={() => onFilterClick('subjects')}
          equalWidth={!isScrollable}
        />
      </div>
      <div className="flex-1">
        <FilterButton
          text="Все организаторы"
          onClick={() => onFilterClick('organizers')}
          equalWidth={!isScrollable}
        />
      </div>
    </div>
    <AddButton onClick={onAddClick} />
  </div>
));

const StuffFilters = React.memo(({
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
          text="Все типы"
          onClick={() => onFilterClick('types')}
          equalWidth={!isScrollable}
        />
      </div>
      <div className="flex-1">
        <FilterButton
          text="Все предметы"
          onClick={() => onFilterClick('subjects')}
          equalWidth={!isScrollable}
        />
      </div>
    </div>
    <AddButton onClick={onAddClick} />
  </div>
));

// Main SearchPanel Component
interface SearchPanelProps {
  activeSection: string;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ activeSection }) => {
  const [searchState, setSearchState] = useState({
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
  const isSticky = useStickyState(containerRef, 74);
  const { isScrollable, isMeasured, checkScrollable } =
    useScrollable(filterContainerRef, filterContentRef);

  // Handlers
  const handleSearchExpand = () => {
    setSearchState(prev => ({ ...prev, isExpanded: true, isTransitioning: true }));

    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const stickyTop = 76;
      if (containerRect.top < stickyTop) return;
      window.scrollTo({
        top: window.scrollY + containerRect.top - stickyTop,
        behavior: 'smooth'
      });
    }

    setTimeout(() => {
      setSearchState(prev => ({ ...prev, isTransitioning: false }));
    }, 200);
  };

  const handleSearchCollapse = () => {
    setSearchState(prev => ({ ...prev, isExpanded: false, isTransitioning: true, value: '' }));

    setTimeout(() => {
      setSearchState(prev => ({ ...prev, isTransitioning: false }));
    }, 200);
  };

  const handleFilterClick = useCallback((filter: string) => {
    console.log(`Filter clicked: ${filter}`);
  }, []);

  const handleAddClick = useCallback(() => {
    console.log('Add a new item');
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
      checkScrollable();

      if (searchState.isExpanded) {
        handleSearchCollapse();
      }
    }

    prevSectionRef.current = activeSection;
  }, [activeSection, checkScrollable, searchState.isExpanded]);

  // Get visibility class based on measurement status
  const getVisibilityClass = () => {
    // Always visible after a short delay to prevent flickering
    return 'visible';
  };

  // Always return 8px padding for consistent spacing
  const getRightPadding = () => '8px';

  // Render current section filters
  const renderSectionFilters = () => {
    const commonProps = {
      onFilterClick: handleFilterClick,
      onAddClick: handleAddClick,
      isExpanded: searchState.isExpanded,
      isScrollable
    };

    switch (activeSection) {
      case 'clubs':
        return (
          <ClubsFilters
            {...commonProps}
            onContentRef={node => { filterContentRef.current = node; }}
          />
        );
      case 'stuff':
        return (
          <StuffFilters
            {...commonProps}
            onContentRef={node => { filterContentRef.current = node; }}
          />
        );
      case 'tutors':
      default:
        return (
          <TutorsFilters
            {...commonProps}
            onContentRef={node => { filterContentRef.current = node; }}
          />
        );
    }
  };

  return (
    <div
      data-searchpanel
      className={`sticky top-19 z-20 pt-1 pb-2 ${getVisibilityClass()}`}
      ref={containerRef}
      style={{
        backgroundColor: 'var(--tgui--secondary_bg_color)',
        boxShadow: isSticky ? '0 1px 0 var(--tgui--quartenary_bg_color)' : 'none',
        transition: 'box-shadow 0.2s ease-in-out, padding 0.2s ease-in-out',
        width: 'calc(100% + 16px)',
        marginLeft: '-8px',
        paddingLeft: '8px',
        paddingRight: getRightPadding(),
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
          onSearchChange={(value) => setSearchState(prev => ({ ...prev, value }))}
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
      <div className="absolute bottom-0 left-0 right-0 h-px" />
    </div>
  );
};

export default SearchPanel;
