import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Input, Button, Tappable } from '@telegram-apps/telegram-ui';

// Icons
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

// ==================== Types ====================
type Institute = {
  id: string;
  Icon: React.ComponentType;
};

interface SearchPanelProps {
  activeSection: string;
  activeInstitute?: string | null;
  onInstituteChange?: (institute: string | null) => void;
}

// ==================== Constants ====================
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

// ==================== Custom Hooks ====================
/**
 * Hook to determine if an element should be sticky based on scroll position
 */
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
      const shouldBeSticky = window.scrollY > (initialPositionRef.current - offset);
      if (isSticky !== shouldBeSticky) {
        setIsSticky(shouldBeSticky);
      }
    };

    // Initial setup
    setTimeout(storeInitialPosition, 100);
    checkStickyState();

    window.addEventListener('scroll', checkStickyState, { passive: true });
    window.addEventListener('resize', storeInitialPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkStickyState);
      window.removeEventListener('resize', storeInitialPosition);
    };
  }, [elementRef, isSticky, offset]);

  return isSticky;
};

/**
 * Hook to determine if content needs horizontal scrolling
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
    checkScrollable();

    if (typeof ResizeObserver !== 'undefined' && containerRef.current && contentRef.current) {
      const resizeObserver = new ResizeObserver(checkScrollable);
      resizeObserver.observe(containerRef.current);
      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    } else {
      window.addEventListener('resize', checkScrollable);
      return () => window.removeEventListener('resize', checkScrollable);
    }
  }, [checkScrollable, containerRef, contentRef]);

  return { isScrollable, isMeasured, checkScrollable };
};

// ==================== Utility Components ====================
/**
 * Button for adding new items
 */
const AddButton = React.memo<{ onClick: () => void }>(({ onClick }) => (
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

/**
 * Button for section filters
 */
const FilterButton = React.memo<{ text: string; onClick: () => void }>(({ text, onClick }) => (
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

/**
 * Institute selection button
 */
interface InstituteButtonProps {
  institute?: Institute;
  isSelected?: boolean;
  onClick: () => void;
  animationIndex?: number;
  disableAnimation?: boolean;
}

const InstituteButton = React.memo<InstituteButtonProps>(({
  institute,
  isSelected = false,
  onClick,
  animationIndex = 0,
  disableAnimation = false
}) => {
  const InstituteIcon = institute?.Icon || Icon24All;
  const animationDelay = `${animationIndex * 20}ms`;
  const animationClass = disableAnimation
    ? ""
    : (animationIndex === 0 ? "institute-button-animate-first" : "institute-button-animate");

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
        animationDelay,
      }}
      aria-label={institute ? `Select institute ${institute.id}` : "All institutes"}
    >
      <InstituteIcon />
    </Button>
  );
});
InstituteButton.displayName = 'InstituteButton';

/**
 * Institutes selector component
 */
interface InstituteSelectorProps {
  activeInstitute: string | null;
  onSelect: (institute: string | null) => void;
  disableAnimation?: boolean;
}

const InstituteSelector = React.memo<InstituteSelectorProps>(({
  activeInstitute,
  onSelect,
  disableAnimation = false
}) => (
  <div
    className="flex gap-2 overflow-x-auto no-scrollbar w-full items-center"
    style={{
      WebkitOverflowScrolling: 'touch',
      transition: disableAnimation ? 'none' : 'all 0.2s ease-in-out'
    }}
  >
    <InstituteButton
      onClick={() => onSelect(null)}
      isSelected={activeInstitute === null}
      animationIndex={0}
      disableAnimation={disableAnimation}
    />

    {INSTITUTES.map((institute, index) => (
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

/**
 * Expandable search input component
 */
interface ExpandableSearchInputProps {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  value: string;
  onChange: (value: string) => void;
  hasInstituteButton: boolean;
  disableTransition?: boolean;
}

const ExpandableSearchInput = React.memo<ExpandableSearchInputProps>(({
  isExpanded,
  onExpand,
  onCollapse,
  value,
  onChange,
  hasInstituteButton,
  disableTransition = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const expandedWidth = hasInstituteButton ? 'calc(100% - 50px)' : '100%';

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      const focusTimeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(focusTimeout);
    }
  }, [isExpanded]);

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

// ==================== Filter Section Components ====================
interface FilterSectionProps {
  onFilterClick: (filter: string) => void;
  onAddClick: () => void;
  isHidden: boolean;
  onContentRef: (node: HTMLDivElement | null) => void;
  hasInstituteButton: boolean;
  disableTransition?: boolean;
}

const TutorsFilters = React.memo<FilterSectionProps>(({
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

const ClubsFilters = React.memo<FilterSectionProps>(({
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

const StuffFilters = React.memo<FilterSectionProps>(({
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

// ==================== Main Component ====================
export const SearchPanel: React.FC<SearchPanelProps> = ({
  activeSection,
  activeInstitute = null,
  onInstituteChange = () => {}
}) => {
  // State for UI interactions
  const [uiState, setUiState] = useState({
    isSearchExpanded: false,
    isSearchTransitioning: false,
    isInstituteExpanded: false,
    isInstituteTransitioning: false,
    isSectionChanging: false,
    searchValue: ''
  });

  // State for Institutes button animation
  const [shouldAnimateInstitute, setShouldAnimateInstitute] = useState(false);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  const prevSectionRef = useRef<string>(activeSection);

  // Custom hooks
  const isSticky = useStickyState(containerRef, 0);
  const { isScrollable, checkScrollable } = useScrollable(filterContainerRef, filterContentRef);

  // Derived state
  const showInstituteButton = activeSection === 'stuff';
  const selectedInstitute = useMemo(() =>
    activeInstitute ? INSTITUTES.find(institute => institute.id === activeInstitute) : null,
  [activeInstitute]);
  const areFiltersHidden = uiState.isSearchExpanded || uiState.isInstituteExpanded;
const shouldShowFilters = (!uiState.isInstituteExpanded || uiState.isInstituteTransitioning) &&
                       (!uiState.isSearchExpanded || uiState.isSearchTransitioning);

  // Set UI state with transition handling
  const setUIStateWithTransition = (
    updates: Partial<typeof uiState>,
    transitionProp: keyof typeof uiState,
    delay = 200
  ) => {
    setUiState(prev => ({ ...prev, ...updates, [transitionProp]: true }));
    setTimeout(() => {
      setUiState(prev => ({ ...prev, [transitionProp]: false }));
    }, delay);
  };

  // Handler for expanding search
  const handleSearchExpand = useCallback(() => {
    if (uiState.isInstituteExpanded) {
      setUIStateWithTransition({ isInstituteExpanded: false }, 'isInstituteTransitioning');
    }

    setUIStateWithTransition({ isSearchExpanded: true }, 'isSearchTransitioning');

    // Scroll to ensure the search panel is visible if needed
    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const stickyTop = 0; // to calibrate
      if (containerRect.top < stickyTop) return;
      window.scrollTo({
        top: window.scrollY + containerRect.top - stickyTop,
        behavior: 'smooth'
      });
    }
  }, [uiState.isInstituteExpanded]);

  // Handler for collapsing search
  const handleSearchCollapse = useCallback(() => {
    setUIStateWithTransition(
      { isSearchExpanded: false, searchValue: '' },
      'isSearchTransitioning',
      200
    );

    // Blur the input field after transition
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 200);
  }, []);

  // Handler for expanding institute selection
const handleInstituteExpand = useCallback(() => {
  // Enable animations for user interaction
  setShouldAnimateInstitute(true);

  if (uiState.isSearchExpanded) {
    handleSearchCollapse();
  }

  setUIStateWithTransition({ isInstituteExpanded: true }, 'isInstituteTransitioning');
}, [uiState.isSearchExpanded, handleSearchCollapse]);

  // Handler for collapsing institute selection
  const handleInstituteCollapse = useCallback(() => {
    setUIStateWithTransition({ isInstituteExpanded: false }, 'isInstituteTransitioning');
  }, []);

  // Handler for institute selection
const handleInstituteSelect = useCallback((institute: string | null) => {
  // Enable animations for user interaction
  setShouldAnimateInstitute(true);

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

  // Handler for search value changes
  const handleSearchChange = useCallback((value: string) => {
    setUiState(prev => ({ ...prev, searchValue: value }));
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

  // Handle section changes
    useEffect(() => {
        if (prevSectionRef.current !== activeSection) {
            // Disable transitions during section changes
            setUiState(prev => ({ ...prev, isSectionChanging: true }));

            // Reset institute animation state
            setShouldAnimateInstitute(false);

            // Re-measure
            checkScrollable();

            // Close expanded UI elements
            if (uiState.isSearchExpanded) {
                handleSearchCollapse();
            }

            if (uiState.isInstituteExpanded) {
                handleInstituteCollapse();
            }

            // Re-enable transitions after a delay
            setTimeout(() => {
                setUiState(prev => ({ ...prev, isSectionChanging: false }));
            }, 300);
        }

        prevSectionRef.current = activeSection;
    }, [
        activeSection,
        checkScrollable,
        uiState.isSearchExpanded,
        handleSearchCollapse,
        uiState.isInstituteExpanded,
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
      disableTransition: uiState.isSectionChanging
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
    uiState.isSectionChanging
  ]);

  return (
    <div
      data-searchpanel
      className="sticky top-0 z-20 pt-2 pb-2 visible"
      ref={containerRef}
      style={{
        backgroundColor: 'var(--tgui--secondary_bg_color)',
        boxShadow: isSticky ? '0 1px 0 var(--tgui--quartenary_bg_color)' : 'none',
        transition: uiState.isSectionChanging ? 'none' : 'box-shadow 0.2s ease-in-out, padding 0.2s ease-in-out',
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
              {showInstituteButton && !uiState.isInstituteExpanded && (
                  <InstituteButton
                      institute={selectedInstitute}
                      isSelected={!!selectedInstitute || activeInstitute === null}
                      onClick={handleInstituteExpand}
                      disableAnimation={uiState.isSectionChanging || !shouldAnimateInstitute}
                  />
              )}

              {/* Expanded institute selection - only visible when expanded */}
              {showInstituteButton && uiState.isInstituteExpanded && (
                  <InstituteSelector
                      activeInstitute={activeInstitute}
                      onSelect={handleInstituteSelect}
                      disableAnimation={uiState.isSectionChanging || !shouldAnimateInstitute}
                  />
              )}

        {/* Search Input - hidden when institute selection is expanded */}
        {!uiState.isInstituteExpanded && (
          <ExpandableSearchInput
            isExpanded={uiState.isSearchExpanded}
            onExpand={handleSearchExpand}
            onCollapse={handleSearchCollapse}
            value={uiState.searchValue}
            onChange={handleSearchChange}
            hasInstituteButton={showInstituteButton}
            disableTransition={uiState.isSectionChanging}
          />
        )}

        {/* Filters Container */}
{shouldShowFilters && (
  <div
    ref={filterContainerRef}
    className="relative overflow-hidden no-scrollbar"
    style={{
      width: uiState.isInstituteExpanded
        ? '0'
        : `calc(100% - 42px - 8px${showInstituteButton ? ' - 42px - 8px' : ''})`,
      overflowX: isScrollable ? 'auto' : 'hidden',
      opacity: uiState.isInstituteExpanded || uiState.isSearchExpanded ? 0 : 1,
      transitionProperty: uiState.isSectionChanging ? 'none' : 'opacity, width',
      transitionDuration: uiState.isSectionChanging ? '0ms' : '200ms',
      transitionTimingFunction: 'ease-in-out',
      // Add delay when showing filters after institute collapse, but no delay when hiding
      transitionDelay: !uiState.isInstituteExpanded && uiState.isInstituteTransitioning ? '150ms' : '0ms',
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
