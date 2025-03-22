import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { InfoFilters } from './SearchPanelComponents/InfoFilters';
import { ClubsFilters } from './SearchPanelComponents/ClubsFilters';
import { StuffFilters } from './SearchPanelComponents/StuffFilters';
import { ExpandableSearchInput } from './SearchPanelComponents/ExpandableSearchInput';
import { InstituteSelector } from './SearchPanelComponents/InstituteSelector';
import { InstituteButton } from './SearchPanelComponents/InstituteButton';
import { UIState, Institute } from './SearchPanelComponents/types';

// Icons
import { Icon24Iyafit } from '@/icons/24/iyafit';
import { Icon24Laplas } from '@/icons/24/laplas';
import { Icon24Ifib } from '@/icons/24/ifib';
import { Icon24Intel } from '@/icons/24/intel';
import { Icon24Iiks } from '@/icons/24/iiks';
import { Icon24Iftis } from '@/icons/24/iftis';
import { Icon24Ifteb } from '@/icons/24/ifteb';
import { Icon24Imo } from '@/icons/24/imo';
import { Icon24Fbiuks } from '@/icons/24/fbiuks';

// ==================== Types ====================
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

// ==================== Main Component ====================
export const SearchPanel: React.FC<SearchPanelProps> = ({
  activeSection,
  activeInstitute = null,
  onInstituteChange = () => {}
}) => {
  // Access filter context
  const {
    infoFilters,
    clubsFilters,
    stuffFilters,
    setSearchQuery
  } = useFilters();

  // State for UI interactions
  const [uiState, setUiState] = useState<UIState>({
    isSearchExpanded: false,
    isSearchTransitioning: false,
    isInstituteExpanded: false,
    isInstituteTransitioning: false,
    isSectionChanging: false,
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

  // Get the current search value based on active section
  const searchValue = useMemo(() => {
    if (activeSection === 'info') {
      return infoFilters.search;
    } else if (activeSection === 'clubs') {
      return clubsFilters.search;
    } else if (activeSection === 'stuff') {
      return stuffFilters.search;
    }
    return '';
  }, [activeSection, infoFilters.search, clubsFilters.search, stuffFilters.search]);

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
    updates: Partial<UIState>,
    transitionProp: keyof UIState,
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
      { isSearchExpanded: false },
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

  // Handler for search value changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);

  // Handler for add button clicks
  const handleAddClick = useCallback(() => {
    console.log('Add a new item');
    // Implement actual add item logic here
  }, []);

  // Handle section changes
  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      // Disable transitions during section changes
      setUiState(prev => ({ ...prev, isSectionChanging: true }));

      // Reset institute animation state
      setShouldAnimateInstitute(false);

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
    uiState.isSearchExpanded,
    handleSearchCollapse,
    uiState.isInstituteExpanded,
    handleInstituteCollapse
  ]);

  return (
    <div
      data-searchpanel
      className="sticky top-0 z-50 pt-2 pb-2 visible"
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
        overflow: 'visible'
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
          animation: instituteButtonFadeIn 0.10s ease-out forwards;
        }

        .institute-button-animate-first {
          opacity: 0;
          animation: firstButtonFadeIn 0.10s ease-out forwards;
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
            institutes={INSTITUTES}
            disableAnimation={uiState.isSectionChanging || !shouldAnimateInstitute}
          />
        )}

        {/* Search Input - hidden when institute selection is expanded */}
        {!uiState.isInstituteExpanded && (
          <ExpandableSearchInput
            isExpanded={uiState.isSearchExpanded}
            onExpand={handleSearchExpand}
            onCollapse={handleSearchCollapse}
            value={searchValue}
            onChange={handleSearchChange}
            hasInstituteButton={showInstituteButton}
            disableTransition={uiState.isSectionChanging}
          />
        )}

        {/* Filters Container */}
        {shouldShowFilters && (
          <div
            ref={filterContainerRef}
            className="relative overflow-visible"
            style={{
              width: uiState.isInstituteExpanded
                ? '0'
                : `calc(100% - 42px - 8px${showInstituteButton ? ' - 42px - 8px' : ''})`,
              opacity: uiState.isInstituteExpanded || uiState.isSearchExpanded ? 0 : 1,
              transitionProperty: uiState.isSectionChanging ? 'none' : 'opacity, width',
              transitionDuration: uiState.isSectionChanging ? '0ms' : '200ms',
              transitionTimingFunction: 'ease-in-out',
              // Add delay when showing filters after institute collapse, but no delay when hiding
              transitionDelay: !uiState.isInstituteExpanded && uiState.isInstituteTransitioning ? '150ms' : '0ms',
            }}
          >
            {activeSection === 'info' && (
              <InfoFilters
                isVisible={!areFiltersHidden}
                containerRef={filterContentRef}
                disableTransition={uiState.isSectionChanging}
              />
            )}

            {activeSection === 'clubs' && (
              <ClubsFilters
                isVisible={!areFiltersHidden}
                containerRef={filterContentRef}
                onAddClick={handleAddClick}
                disableTransition={uiState.isSectionChanging}
              />
            )}

            {activeSection === 'stuff' && (
              <StuffFilters
                isVisible={!areFiltersHidden}
                containerRef={filterContentRef}
                onAddClick={handleAddClick}
                disableTransition={uiState.isSectionChanging}
              />
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
