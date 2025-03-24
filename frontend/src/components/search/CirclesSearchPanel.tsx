import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { FilterModal, FilterOption } from './FilterModal';
import { getClubOrganizers, getClubSubjects } from '@/services/apiService';
import { FilterContainer, FilterButton, SearchPanelStyles } from './SearchPanelComponents';

interface CirclesSearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  organizerFilter: string | null;
  onOrganizerFilterChange: (organizer: string | null) => void;
  subjectFilter: string | null;
  onSubjectFilterChange: (subject: string | null) => void;
}

export const CirclesSearchPanel: React.FC<CirclesSearchPanelProps> = ({
  searchQuery,
  onSearchChange,
  organizerFilter,
  onOrganizerFilterChange,
  subjectFilter,
  onSubjectFilterChange
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [organizerOptions, setOrganizerOptions] = useState<FilterOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState({
    organizers: false,
    subjects: false
  });

  // State for modals
  const [activeModal, setActiveModal] = useState<'organizer' | 'subject' | null>(null);

  // State for sticky detection
  const [isSticky, setIsSticky] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Set up IntersectionObserver to detect sticky state
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    // Create a sentinel element to observe
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.width = '100%';

    if (panelRef.current && panelRef.current.parentNode) {
      panelRef.current.parentNode.insertBefore(sentinel, panelRef.current);
      observer.observe(sentinel);
    }

    return () => {
      observer.disconnect();
      if (sentinel.parentNode) {
        sentinel.parentNode.removeChild(sentinel);
      }
    };
  }, []);

  // Load filter options
  useEffect(() => {
    const loadOptions = async () => {
      // Load club organizers
      setIsLoading(prev => ({ ...prev, organizers: true }));
      try {
        const organizersResponse = await getClubOrganizers();
        setOrganizerOptions(organizersResponse.items);
      } catch (error) {
        console.error('Error loading organizers:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, organizers: false }));
      }

      // Load club subjects
      setIsLoading(prev => ({ ...prev, subjects: true }));
      try {
        const subjectsResponse = await getClubSubjects();
        setSubjectOptions(subjectsResponse.items);
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, subjects: false }));
      }
    };

    loadOptions();
  }, []);

  // Toggle search expansion
  const handleSearchExpand = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleSearchCollapse = () => {
    setIsSearchExpanded(false);
    onSearchChange(''); // Clear search when collapsing
  };

  // Open filter modal
  const openFilterModal = (modalType: 'organizer' | 'subject') => {
    setActiveModal(modalType);
  };

  // Find selected option names for display
  const getSelectedOptionName = (options: FilterOption[], selectedId: string | null) => {
    if (!selectedId) return '';
    const option = options.find(opt => opt.id === selectedId);
    return option ? option.name : '';
  };

  const organizerOptionName = getSelectedOptionName(organizerOptions, organizerFilter);
  const subjectOptionName = getSelectedOptionName(subjectOptions, subjectFilter);

  return (
    <div
      ref={panelRef}
      className={`search-panel ${isSticky ? 'sticky' : ''}`}
      data-searchpanel="circles"
    >
      <SearchPanelStyles />

      <div className="flex gap-2 items-center">
        {/* Search button (collapsed) */}
        {!isSearchExpanded && (
          <div
            className="flex-shrink-0"
            style={{
              width: '42px'
            }}
          >
            <div className="relative">
              <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={handleSearchExpand}
                aria-label="Expand search"
                role="button"
                tabIndex={0}
              />

              <Input
                ref={inputRef}
                placeholder=""
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Search"
                style={{
                  width: '42px',
                  height: '42px'
                }}
                before={
                  <div
                    className="translate-x-[calc(50%-12px)]"
                    aria-hidden="true"
                  >
                    <Icon24Search />
                  </div>
                }
              />
            </div>
          </div>
        )}

        {/* Search expanded - takes full width */}
        {isSearchExpanded && (
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Поиск кружков..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search"
              after={
                <div
                  style={{
                    display: 'flex',
                    position: 'relative',
                    zIndex: 20,
                    cursor: 'pointer'
                  }}
                  onClick={handleSearchCollapse}
                  aria-label="Close search"
                >
                  <Icon24Close style={{ color: 'var(--tgui--section_fg_color)' }} />
                </div>
              }
            />
          </div>
        )}

        {/* Filters - only visible when search is not expanded */}
        <FilterContainer isHidden={isSearchExpanded}>
          {/* Subject filter button */}
          <FilterButton
            label={subjectFilter ? subjectOptionName : 'Предмет'}
            selected={!!subjectFilter}
            onClick={() => openFilterModal('subject')}
            onClear={() => onSubjectFilterChange(null)}
          />

          {/* Organizer filter button */}
          <FilterButton
            label={organizerFilter ? organizerOptionName : 'Организатор'}
            selected={!!organizerFilter}
            onClick={() => openFilterModal('organizer')}
            onClear={() => onOrganizerFilterChange(null)}
          />
        </FilterContainer>
      </div>

      {/* Filter modals */}
      <FilterModal
        isOpen={activeModal === 'subject'}
        options={subjectOptions}
        selectedOption={subjectFilter}
        onSelect={onSubjectFilterChange}
        title="Выберите предмет"
      />

      <FilterModal
        isOpen={activeModal === 'organizer'}
        options={organizerOptions}
        selectedOption={organizerFilter}
        onSelect={onOrganizerFilterChange}
        title="Выберите организатора"
      />
    </div>
  );
};
