import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { FilterDropdown, FilterOption } from './FilterDropdown';
import { getDepartmentOptions } from '@/services/apiService';
import { FilterContainer, FilterButton, SearchPanelStyles } from './SearchPanelComponents';

interface BlogsSearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  departmentFilter: string | null;
  onDepartmentFilterChange: (department: string | null) => void;
}

export const BlogsSearchPanel: React.FC<BlogsSearchPanelProps> = ({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Find selected department name
  const selectedDepartmentName = departmentFilter
    ? departmentOptions.find(dept => dept.id === departmentFilter)?.name || ''
    : '';

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

  // Load department options
  useEffect(() => {
    const loadDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await getDepartmentOptions();
        setDepartmentOptions(response.items);
      } catch (error) {
        console.error('Error loading departments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
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

  // Handle department filter modal
  const handleDepartmentSelect = (departmentId: string | null) => {
    onDepartmentFilterChange(departmentId);
    setIsDepartmentModalOpen(false);
  };

  return (
    <div
      ref={panelRef}
      className={`search-panel ${isSticky ? 'sticky' : ''}`}
      data-searchpanel="blogs"
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

        {/* Search expanded */}
        {isSearchExpanded && (
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Поиск преподавателей..."
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

        {/* Department filter button - only visible when search is not expanded */}
        {!isSearchExpanded && (
          <FilterContainer>
            <FilterButton
              label={departmentFilter ? selectedDepartmentName : 'Все кафедры'}
              selected={!!departmentFilter}
              onClick={() => setIsDepartmentModalOpen(true)}
              onClear={() => onDepartmentFilterChange(null)}
              expandable={true}
            />
          </FilterContainer>
        )}
      </div>

      {/* Department filter dropdown */}
      <FilterDropdown
        isOpen={isDepartmentModalOpen}
        options={departmentOptions}
        selectedOption={departmentFilter}
        onSelect={handleDepartmentSelect}
        title="Выберите кафедру"
      />
    </div>
  );
};
