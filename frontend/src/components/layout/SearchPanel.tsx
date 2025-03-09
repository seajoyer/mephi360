import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Input, Button, Tappable } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { Icon24Person_add } from '@/icons/24/person_add';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';
import { Icon24Iyafit } from '@/icons/24/iyafit';
import { Icon24Laplas } from '@/icons/24/laplas';
import { Icon24Ifib } from '@/icons/24/ifib';
import { Icon24Intel } from '@/icons/24/intel';
import { Icon24Iiks } from '@/icons/24/iiks';
import { Icon24Iftis } from '@/icons/24/iftis';
import { Icon24Ifteb } from '@/icons/24/ifteb';
import { Icon24Imo } from '@/icons/24/imo';
import { Icon24Fbiuks } from '@/icons/24/fbiuks';
import { Icon24All } from '@/icons/24/all';

// Types
type Institute = {
  id: string;
  Icon: React.ComponentType;
};

interface SearchPanelProps {
  activeSection: string;
  activeInstitute?: string | null;
  onInstituteChange?: (institute: string | null) => void;
}

// Constants
const INSTITUTES: Institute[] = [
  { id: 'ИЯФИТ', Icon: Icon24Iyafit },
  { id: 'ЛаПлаз', Icon: Icon24Laplas },
  { id: 'ИФИБ', Icon: Icon24Ifib },
  { id: 'ИНТЭЛ', Icon: Icon24Intel },
  { id: 'ИИКС', Icon: Icon24Iiks },
  { id: 'ИФТИС', Icon: Icon24Iftis },
  { id: 'ИФТЭБ', Icon: Icon24Ifteb },
  { id: 'ИМО', Icon: Icon24Imo },
  { id: 'ФБИУКС', Icon: Icon24Fbiuks },
];

// Custom Hooks
const useStickyState = (elementRef: React.RefObject<HTMLElement>, offset = 0): boolean => {
  const [isSticky, setIsSticky] = useState(false);
  const initialPositionRef = useRef<number | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const storeInitialPosition = () => {
      if (!elementRef.current || initialPositionRef.current !== null) return;
      const rect = elementRef.current.getBoundingClientRect();
      initialPositionRef.current = rect.top + window.scrollY;
    };

    const checkStickyState = () => {
      if (!elementRef.current || initialPositionRef.current === null) return;

      const shouldBeSticky = window.scrollY > (initialPositionRef.current - offset - 1);
      if (isSticky !== shouldBeSticky) {
        setIsSticky(shouldBeSticky);
      }
    };

    // Initial setup with a small delay to ensure DOM is ready
    setTimeout(storeInitialPosition, 100);
    checkStickyState();

    // Use passive event listeners for better performance
    window.addEventListener('scroll', checkStickyState, { passive: true });
    window.addEventListener('resize', storeInitialPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkStickyState);
      window.removeEventListener('resize', storeInitialPosition);
    };
  }, [elementRef, isSticky, offset]);

  return isSticky;
};

const useScrollable = (
  containerRef: React.RefObject<HTMLElement>,
  contentRef: React.RefObject<HTMLElement>
): { isScrollable: boolean; isMeasured: boolean; checkScrollable: () => void } => {
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
    checkScrollable();

    // Use ResizeObserver for more responsive updates when available
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

// Utility Components
const AddButton: React.FC<{ onClick: () => void }> = React.memo(({ onClick }) => (
  <Button
    mode="gray"
    size="m"
    style={{
      padding: 8,
      background: 'var(--tgui--section_bg_color)',
      flexShrink: 0
    }}
    onClick={onClick}
    aria-label="Add item"
  >
    <Icon24Person_add />
  </Button>
));
AddButton.displayName = 'AddButton';

const FilterButton: React.FC<{ text: string; onClick: () => void }> = React.memo(({ text, onClick }) => (
  <Button
    mode="gray"
    size="m"
    after={<div style={{ color: 'var(--tgui--hint_color)' }}><Icon20Chevron_vertical /></div>}
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
    <div style={{
      color: 'var(--tgui--hint_color)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }}>
      <span className="font-medium">{text}</span>
    </div>
  </Button>
));
FilterButton.displayName = 'FilterButton';

// Institute Button Component
interface InstituteButtonProps {
  institute?: Institute;
  isSelected?: boolean;
  onClick: () => void;
  animationIndex?: number;
  isMainButton?: boolean; // New prop to identify the main button
  disableAnimation?: boolean; // New prop to disable animations
}

const InstituteButton: React.FC<InstituteButtonProps> = React.memo(({
  institute,
  isSelected = false,
  onClick,
  animationIndex = 0,
  isMainButton = false,
  disableAnimation = false
}) => {
  const InstituteIcon = institute?.Icon || Icon24All;

  // Calculate a staggered delay based on button position
  const animationDelay = `${animationIndex * 20}ms`; // 20ms stagger between buttons

  // Choose the appropriate animation class based on position
  // Skip animation completely if it's the main button or animations are disabled
  const animationClass = disableAnimation || isMainButton
    ? "" // No animation class
    : (animationIndex === 0
      ? "institute-button-animate-first"
      : "institute-button-animate");

  return (
    <Button
      mode={isSelected ? "gray" : "plain"}
      size="m"
      onClick={onClick}
      className={animationClass}
      style={{
        padding: '0px',
        background: isSelected ? 'var(--tgui--section_bg_color)' : '',
        color: 'var(--tgui--text_color)',
        flexShrink: 0,
        animationDelay: animationDelay,
        // Set opacity to 1 to ensure it's fully visible right away
        opacity: disableAnimation || isMainButton ? 1 : undefined
      }}
      aria-label={institute ? `Select institute ${institute.id}` : "All institutes"}
    >
      <InstituteIcon />
    </Button>
  );
});
InstituteButton.displayName = 'InstituteButton';

// Institute Selector Component
interface InstituteSelectorProps {
  activeInstitute: string | null;
  onSelect: (institute: string | null) => void;
  disableAnimation?: boolean;
}

const InstituteSelector: React.FC<InstituteSelectorProps> = React.memo(({
  activeInstitute,
  onSelect,
  disableAnimation = false
}) => {
  return (
    <div
      className="flex gap-2 overflow-x-auto no-scrollbar w-full items-center"
      style={{
        WebkitOverflowScrolling: 'touch',
        transition: disableAnimation ? 'none' : 'all 0.2s ease-in-out'
      }}
    >
      {/* "No institute" option (All) */}
      <InstituteButton
        onClick={() => onSelect(null)}
        isSelected={activeInstitute === null}
        animationIndex={0} // First button
        disableAnimation={disableAnimation}
      />

      {/* Institute options with staggered animation */}
      {INSTITUTES.map((institute, index) => (
        <InstituteButton
          key={institute.id}
          institute={institute}
          isSelected={activeInstitute === institute.id}
          onClick={() => onSelect(institute.id)}
          animationIndex={index + 1} // Subsequent buttons
          disableAnimation={disableAnimation}
        />
      ))}
    </div>
  );
});
InstituteSelector.displayName = 'InstituteSelector';

// Expandable Search Input Component
interface ExpandableSearchInputProps {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  value: string;
  onChange: (value: string) => void;
  hasInstituteButton: boolean;
  disableTransition?: boolean;
}

const ExpandableSearchInput: React.FC<ExpandableSearchInputProps> = React.memo(({
  isExpanded,
  onExpand,
  onCollapse,
  value,
  onChange,
  hasInstituteButton,
  disableTransition = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      const focusTimeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(focusTimeout);
    }
  }, [isExpanded]);

  // Width based on whether institute button is present
  const expandedWidth = hasInstituteButton ? 'calc(100% - 50px)' : '100%';

  return (
    <div
      className={disableTransition ? "" : "transition-all duration-200 ease-in-out"}
      style={{
        width: isExpanded ? expandedWidth : '42px',
        flexShrink: 0,
        transition: disableTransition ? 'none' : undefined
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search"
          before={
            <div
              className={disableTransition ? "" : `transition-transform duration-200 ${isExpanded ? '' : 'translate-x-[calc(50%-12px)]'}`}
              style={{
                transform: isExpanded ? 'none' : 'translateX(calc(50% - 12px))',
                transition: disableTransition ? 'none' : undefined
              }}
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

// Filter Sections Components
interface FilterSectionProps {
  onFilterClick: (filter: string) => void;
  onAddClick: () => void;
  isHidden: boolean;
  onContentRef: (node: HTMLDivElement | null) => void;
  hasInstituteButton: boolean;
  disableTransition?: boolean;
}

const TutorsFilters: React.FC<FilterSectionProps> = React.memo(({
  onFilterClick,
  onAddClick,
  isHidden,
  onContentRef,
  disableTransition = false
}) => (
  <div
    ref={onContentRef}
    className={disableTransition ? "" : "transition-opacity duration-200 flex w-full"}
    style={{
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      display: 'flex',
      width: '100%',
      transition: disableTransition ? 'none' : undefined
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
TutorsFilters.displayName = 'TutorsFilters';

const ClubsFilters: React.FC<FilterSectionProps> = React.memo(({
  onFilterClick,
  onAddClick,
  isHidden,
  onContentRef,
  disableTransition = false
}) => (
  <div
    ref={onContentRef}
    className={disableTransition ? "flex w-full" : "flex w-full transition-opacity duration-200"}
    style={{
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      transition: disableTransition ? 'none' : undefined
    }}
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

const StuffFilters: React.FC<FilterSectionProps> = React.memo(({
  onFilterClick,
  onAddClick,
  isHidden,
  onContentRef,
  disableTransition = false
}) => (
  <div
    ref={onContentRef}
    className={disableTransition ? "flex w-full" : "flex w-full transition-opacity duration-200"}
    style={{
      opacity: isHidden ? 0 : 1,
      pointerEvents: isHidden ? 'none' : 'auto',
      transition: disableTransition ? 'none' : undefined
    }}
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

// Main SearchPanel Component
export const SearchPanel: React.FC<SearchPanelProps> = ({
  activeSection,
  activeInstitute = null,
  onInstituteChange = () => {}
}) => {
  // State for search functionality
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchTransitioning, setIsSearchTransitioning] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // State for institute selection
  const [isInstituteExpanded, setIsInstituteExpanded] = useState(false);
  const [isInstituteTransitioning, setIsInstituteTransitioning] = useState(false);

  // Flag to disable transitions during section changes
  const [isSectionChanging, setIsSectionChanging] = useState(false);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const prevSectionRef = useRef<string>(activeSection);

  // Custom hooks
  const isSticky = useStickyState(containerRef, 0);
  const { isScrollable, checkScrollable } = useScrollable(filterContainerRef, filterContentRef);

  // Check if we're in the stuff section (where institute button is shown)
  const showInstituteButton = activeSection === 'stuff';

  // Selected institute
  const selectedInstitute = useMemo(() =>
    activeInstitute ? INSTITUTES.find(institute => institute.id === activeInstitute) : null,
  [activeInstitute]);

  // Determine if filters should be hidden
  const areFiltersHidden = isSearchExpanded || isInstituteExpanded;

  // Handler for expanding search
  const handleSearchExpand = useCallback(() => {
    // If institute selection is expanded, collapse it first
    if (isInstituteExpanded) {
      setIsInstituteExpanded(false);
      setIsInstituteTransitioning(true);
      setTimeout(() => setIsInstituteTransitioning(false), 200);
    }

    setIsSearchExpanded(true);
    setIsSearchTransitioning(true);

    // Scroll to ensure the search panel is visible if needed
    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const stickyTop = 2;
      if (containerRect.top < stickyTop) return;
      window.scrollTo({
        top: window.scrollY + containerRect.top - stickyTop,
        behavior: 'smooth'
      });
    }

    // Reset transitioning state after animation completes
    setTimeout(() => setIsSearchTransitioning(false), 200);
  }, [isInstituteExpanded]);

  // Handler for collapsing search
  const handleSearchCollapse = useCallback(() => {
    setIsSearchExpanded(false);
    setIsSearchTransitioning(true);
    setSearchValue('');

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsSearchTransitioning(false);

      // Blur the input field to hide the virtual keyboard on mobile
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 200);
  }, []);

  // Handler for expanding institute selection
  const handleInstituteExpand = useCallback(() => {
    // If search is expanded, collapse it first
    if (isSearchExpanded) {
      handleSearchCollapse();
    }

    setIsInstituteExpanded(true);
    setIsInstituteTransitioning(true);

    // Reset transitioning state after animation completes
    setTimeout(() => setIsInstituteTransitioning(false), 200);
  }, [isSearchExpanded, handleSearchCollapse]);

  // Handler for collapsing institute selection
  const handleInstituteCollapse = useCallback(() => {
    setIsInstituteExpanded(false);
    setIsInstituteTransitioning(true);

    // Reset transitioning state after animation completes
    setTimeout(() => setIsInstituteTransitioning(false), 200);
  }, []);

  // Handler for institute selection
  const handleInstituteSelect = useCallback((institute: string | null) => {
    onInstituteChange(institute);
    handleInstituteCollapse();
  }, [onInstituteChange, handleInstituteCollapse]);

  // Handler for filter button clicks
  const handleFilterClick = useCallback((filter: string) => {
    console.log(`Filter clicked: ${filter}`);
    // Implement actual filter logic here
  }, []);

  // Handler for add button clicks
  const handleAddClick = useCallback(() => {
    console.log('Add a new item');
    // Implement actual add item logic here
  }, []);

  // Handle search value changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // Content ref callback for filters
  const contentRefCallback = useCallback((node: HTMLDivElement | null) => {
    filterContentRef.current = node;
    checkScrollable();
  }, [checkScrollable]);

  // Ensure immediate measurement for initial render
  useEffect(() => {
    setTimeout(checkScrollable, 0);
  }, [checkScrollable]);

  // Handle section changes - disable transitions during section changes
  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      // Set the flag to disable transitions
      setIsSectionChanging(true);

      // Re-measure when section changes
      checkScrollable();

      // Close search if expanded
      if (isSearchExpanded) {
        handleSearchCollapse();
      }

      // Close institute selection if expanded
      if (isInstituteExpanded) {
        handleInstituteCollapse();
      }

      // Reset the flag after a short delay to re-enable transitions
      // after the section change is complete
      setTimeout(() => {
        setIsSectionChanging(false);
      }, 300);
    }

    prevSectionRef.current = activeSection;
  }, [
    activeSection,
    checkScrollable,
    isSearchExpanded,
    handleSearchCollapse,
    isInstituteExpanded,
    handleInstituteCollapse
  ]);

  // Render current section filters
  const renderSectionFilters = useCallback(() => {
    const commonProps = {
      onFilterClick: handleFilterClick,
      onAddClick: handleAddClick,
      isHidden: areFiltersHidden,
      onContentRef: contentRefCallback,
      hasInstituteButton: showInstituteButton,
      disableTransition: isSectionChanging
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
    areFiltersHidden,
    contentRefCallback,
    showInstituteButton,
    isSectionChanging
  ]);

  // For search expansion: keep the filters visible with fade-out effect
  // For institute expansion: hide filters instantly
  const shouldShowFilters = !isInstituteExpanded &&
                           (!isSearchExpanded || isSearchTransitioning);

  return (
    <div
      data-searchpanel
      className="sticky top-0 z-20 pt-1 pb-2 visible"
      ref={containerRef}
      style={{
        backgroundColor: 'var(--tgui--secondary_bg_color)',
        boxShadow: isSticky ? '0 1px 0 var(--tgui--quartenary_bg_color)' : 'none',
        transition: isSectionChanging ? 'none' : 'box-shadow 0.2s ease-in-out, padding 0.2s ease-in-out',
        width: 'calc(100% + 16px)',
        marginLeft: '-8px',
        paddingLeft: '8px',
        paddingRight: '8px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Institute button animations */
        @keyframes instituteButtonFadeIn {
          from {
            opacity: 0;
            transform: translateX(-6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes firstButtonFadeIn {
          from {
            opacity: 0.5;
          }
          to {
            opacity: 1;
          }
        }

        .institute-button-animate {
          opacity: 0;
          animation: instituteButtonFadeIn 0.20s ease-out forwards;
        }

        .institute-button-animate-first {
          opacity: 0;
          animation: firstButtonFadeIn 0.20s ease-out forwards;
        }
      `}</style>

      <div className="flex gap-2">
              {/* Institute button - visible in stuff section when not expanded */}
              {showInstituteButton && !isInstituteExpanded && (
                  <InstituteButton
                      institute={selectedInstitute}
                      isSelected={!!selectedInstitute || activeInstitute === null}
                      onClick={handleInstituteExpand}
                      isMainButton={true}
                      disableAnimation={isSectionChanging}
                  />
              )}

        {/* Expanded institute selection - only visible when expanded */}
        {showInstituteButton && isInstituteExpanded && (
          <InstituteSelector
            activeInstitute={activeInstitute}
            onSelect={handleInstituteSelect}
            disableAnimation={isSectionChanging}
          />
        )}

        {/* Search Input - hidden when institute selection is expanded */}
        {!isInstituteExpanded && (
          <ExpandableSearchInput
            isExpanded={isSearchExpanded}
            onExpand={handleSearchExpand}
            onCollapse={handleSearchCollapse}
            value={searchValue}
            onChange={handleSearchChange}
            hasInstituteButton={showInstituteButton}
            disableTransition={isSectionChanging}
          />
        )}

        {/* Filters Container - now uses shouldShowFilters to keep visible during transitions */}
        {shouldShowFilters && (
          <div
            ref={filterContainerRef}
            className="relative overflow-hidden no-scrollbar"
            style={{
              width: `calc(100% - 42px - 8px${showInstituteButton ? ' - 42px - 8px' : ''})`,
              overflowX: isScrollable ? 'auto' : 'hidden',
              opacity: isSearchExpanded ? 0 : 1,
              transition: isSectionChanging ? 'none' : 'all 0.2s ease-in-out'
            }}
          >
            {isScrollable ? (
              <div className="overflow-x-auto no-scrollbar" style={{ width: '100%' }}>
                {renderSectionFilters()}
              </div>
            ) : (
              renderSectionFilters()
            )}
          </div>
        )}
      </div>

      {/* Shadow extension element */}
      <div className="absolute bottom-0 left-0 right-0 h-px" aria-hidden="true" />
    </div>
  );
};

export default SearchPanel;
