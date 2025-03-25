import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Button } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { FilterSelectionPage } from '@/pages/FilterSelectionPage';
import {
  getMaterialTypes,
  getMaterialTeachers,
  getMaterialSubjects,
  getMaterialSemesters,
  DropdownOption
} from '@/services/apiService';
import { FilterContainer, FilterButton } from './SearchPanelComponents';

// Icons for institute selector
import { Icon24All } from '@/icons/24/all';
import { Icon24Iyafit } from '@/icons/24/iyafit';
import { Icon24Laplas } from '@/icons/24/laplas';
import { Icon24Ifib } from '@/icons/24/ifib';
import { Icon24Intel } from '@/icons/24/intel';
import { Icon24Iiks } from '@/icons/24/iiks';
import { Icon24Iftis } from '@/icons/24/iftis';
import { Icon24Ifteb } from '@/icons/24/ifteb';
import { Icon24Imo } from '@/icons/24/imo';
import { Icon24Fbiuks } from '@/icons/24/fbiuks';

// Institute type and constants
type Institute = {
  id: string;
  Icon: React.ComponentType;
};

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

// Institute Button component
interface InstituteButtonProps {
  institute?: Institute;
  isSelected?: boolean;
  onClick: () => void;
  animationIndex?: number;
  disableAnimation?: boolean;
}

const InstituteButton: React.FC<InstituteButtonProps> = ({
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
};

// Institute Selector component with responsive behavior
interface InstituteSelectorProps {
  activeInstitute: string | null;
  onSelect: (institute: string | null) => void;
  disableAnimation?: boolean;
}

const InstituteSelector: React.FC<InstituteSelectorProps> = ({
  activeInstitute,
  onSelect,
  disableAnimation = false
}) => {
  // Use the FilterContainer to handle responsive behavior
  return (
    <FilterContainer>
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
    </FilterContainer>
  );
};

interface StuffSearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string | null;
  onTypeFilterChange: (type: string | null) => void;
  teacherFilter: string | null;
  onTeacherFilterChange: (teacher: string | null) => void;
  subjectFilter: string | null;
  onSubjectFilterChange: (subject: string | null) => void;
  semesterFilter: string | null;
  onSemesterFilterChange: (semester: string | null) => void;
  instituteFilter: string | null;
  onInstituteFilterChange: (institute: string | null) => void;
}

export const StuffSearchPanel: React.FC<StuffSearchPanelProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  teacherFilter,
  onTeacherFilterChange,
  subjectFilter,
  onSubjectFilterChange,
  semesterFilter,
  onSemesterFilterChange,
  instituteFilter,
  onInstituteFilterChange
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isInstituteExpanded, setIsInstituteExpanded] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    types: [] as DropdownOption[],
    teachers: [] as DropdownOption[],
    subjects: [] as DropdownOption[],
    semesters: [] as DropdownOption[],
  });
  const [isLoading, setIsLoading] = useState({
    types: false,
    teachers: false,
    subjects: false,
    semesters: false,
  });

  // State for filter selection page
  const [showFilterPage, setShowFilterPage] = useState<'none' | 'type' | 'teacher' | 'subject' | 'semester'>('none');

  // State for sticky detection
  const [isSticky, setIsSticky] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldAnimateInstitute, setShouldAnimateInstitute] = useState(false);
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
      // Load material types
      setIsLoading(prev => ({ ...prev, types: true }));
      try {
        const typesResponse = await getMaterialTypes();
        setFilterOptions(prev => ({ ...prev, types: typesResponse.items }));
      } catch (error) {
        console.error('Error loading types:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, types: false }));
      }

      // Load material teachers
      setIsLoading(prev => ({ ...prev, teachers: true }));
      try {
        const teachersResponse = await getMaterialTeachers();
        setFilterOptions(prev => ({ ...prev, teachers: teachersResponse.items }));
      } catch (error) {
        console.error('Error loading teachers:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, teachers: false }));
      }

      // Load material subjects
      setIsLoading(prev => ({ ...prev, subjects: true }));
      try {
        const subjectsResponse = await getMaterialSubjects();
        setFilterOptions(prev => ({ ...prev, subjects: subjectsResponse.items }));
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, subjects: false }));
      }

      // Load material semesters
      setIsLoading(prev => ({ ...prev, semesters: true }));
      try {
        const semestersResponse = await getMaterialSemesters();
        setFilterOptions(prev => ({ ...prev, semesters: semestersResponse.items }));
      } catch (error) {
        console.error('Error loading semesters:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, semesters: false }));
      }
    };

    loadOptions();
  }, []);

  // Toggle search expansion
  const handleSearchExpand = useCallback(() => {
    if (isInstituteExpanded) {
      setIsInstituteExpanded(false);
    }

    setIsSearchExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  }, [isInstituteExpanded]);

  const handleSearchCollapse = () => {
    setIsSearchExpanded(false);
    onSearchChange(''); // Clear search when collapsing
  };

  // Toggle institute selection
  const handleInstituteExpand = useCallback(() => {
    // Enable animations for user interaction
    setShouldAnimateInstitute(true);

    if (isSearchExpanded) {
      handleSearchCollapse();
    }

    setIsInstituteExpanded(true);
  }, [isSearchExpanded]);

  // Handle institute selection
  const handleInstituteSelect = useCallback((institute: string | null) => {
    // Enable animations for user interaction
    setShouldAnimateInstitute(true);
    onInstituteFilterChange(institute);
    setIsInstituteExpanded(false);
  }, [onInstituteFilterChange]);

  // Check if filters should be shown (not when search or institute is expanded)
  const areFiltersHidden = isSearchExpanded || isInstituteExpanded;
  const selectedInstitute = instituteFilter ? INSTITUTES.find(institute => institute.id === instituteFilter) : null;

  // Find selected option names for display
  const getSelectedOptionName = (options: DropdownOption[], selectedId: string | null) => {
    if (!selectedId) return '';
    const option = options.find(opt => opt.id === selectedId);
    return option ? option.name : '';
  };

  const typeOptionName = getSelectedOptionName(filterOptions.types, typeFilter);
  const teacherOptionName = getSelectedOptionName(filterOptions.teachers, teacherFilter);
  const subjectOptionName = getSelectedOptionName(filterOptions.subjects, subjectFilter);
  const semesterOptionName = getSelectedOptionName(filterOptions.semesters, semesterFilter);

  // Handle selecting options
  const handleTypeSelect = (typeId: string | null) => {
    onTypeFilterChange(typeId);
    setShowFilterPage('none');
  };

  const handleTeacherSelect = (teacherId: string | null) => {
    onTeacherFilterChange(teacherId);
    setShowFilterPage('none');
  };

  const handleSubjectSelect = (subjectId: string | null) => {
    onSubjectFilterChange(subjectId);
    setShowFilterPage('none');
  };

  const handleSemesterSelect = (semesterId: string | null) => {
    onSemesterFilterChange(semesterId);
    setShowFilterPage('none');
  };

  // Render FilterSelectionPage based on showFilterPage
  if (showFilterPage === 'type') {
    return (
      <FilterSelectionPage
        title="Выберите тип"
        options={filterOptions.types}
        selectedOption={typeFilter}
        onSelect={handleTypeSelect}
      />
    );
  }

  if (showFilterPage === 'teacher') {
    return (
      <FilterSelectionPage
        title="Выберите преподавателя"
        options={filterOptions.teachers}
        selectedOption={teacherFilter}
        onSelect={handleTeacherSelect}
      />
    );
  }

  if (showFilterPage === 'subject') {
    return (
      <FilterSelectionPage
        title="Выберите предмет"
        options={filterOptions.subjects}
        selectedOption={subjectFilter}
        onSelect={handleSubjectSelect}
      />
    );
  }

  if (showFilterPage === 'semester') {
    return (
      <FilterSelectionPage
        title="Выберите семестр"
        options={filterOptions.semesters}
        selectedOption={semesterFilter}
        onSelect={handleSemesterSelect}
      />
    );
  }

  // Main view of the search panel
  return (
    <div
      ref={panelRef}
      className={`search-panel ${isSticky ? 'sticky' : ''}`}
      data-searchpanel="stuff"
    >
      <style jsx global>{`
        .search-panel {
          position: sticky;
          top: 0;
          z-index: 50;
          padding-top: 16px;
          padding-bottom: 16px;
          background-color: var(--tgui--secondary_bg_color);
          transition: box-shadow 0.2s ease-in-out;
          width: calc(100% + 16px);
          margin-left: -8px;
          padding-left: 8px;
          padding-right: 8px;
          box-sizing: border-box;
        }

        .search-panel.sticky {
          box-shadow: 0 1px 0 var(--tgui--quartenary_bg_color);
        }

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

      <div className="flex gap-2 items-center">
        {/* Institute button or selector */}
        {isInstituteExpanded ? (
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <InstituteSelector
              activeInstitute={instituteFilter}
              onSelect={handleInstituteSelect}
              disableAnimation={!shouldAnimateInstitute}
            />
          </div>
        ) : (
          <div className="flex-shrink-0">
            <InstituteButton
              institute={selectedInstitute}
              isSelected={!!selectedInstitute || instituteFilter === null}
              onClick={handleInstituteExpand}
              disableAnimation={!shouldAnimateInstitute}
            />
          </div>
        )}

        {/* Search Input - only collapsed when institute is expanded */}
        {!isInstituteExpanded && (
          <div
            className="transition-all duration-200 ease-in-out flex-shrink-0"
            style={{
              width: isSearchExpanded ? '42px' : '42px'
            }}
          >
            <div className="relative">
              {!isSearchExpanded && (
                <div
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={handleSearchExpand}
                  aria-label="Expand search"
                  role="button"
                  tabIndex={0}
                />
              )}

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

        {/* Filter buttons - controlled by FilterContainer */}
        <FilterContainer isHidden={areFiltersHidden}>
          {/* Type filter button */}
          <FilterButton
            label={typeFilter ? typeOptionName : 'Тип'}
            selected={!!typeFilter}
            onClick={() => setShowFilterPage('type')}
            onClear={() => onTypeFilterChange(null)}
          />

          {/* Teacher filter button */}
          <FilterButton
            label={teacherFilter ? teacherOptionName : 'Препод'}
            selected={!!teacherFilter}
            onClick={() => setShowFilterPage('teacher')}
            onClear={() => onTeacherFilterChange(null)}
          />

          {/* Subject filter button */}
          <FilterButton
            label={subjectFilter ? subjectOptionName : 'Предмет'}
            selected={!!subjectFilter}
            onClick={() => setShowFilterPage('subject')}
            onClear={() => onSubjectFilterChange(null)}
          />

          {/* Semester filter button */}
          <FilterButton
            label={semesterFilter ? semesterOptionName : 'Семестр'}
            selected={!!semesterFilter}
            onClick={() => setShowFilterPage('semester')}
            onClear={() => onSemesterFilterChange(null)}
          />
        </FilterContainer>

        {/* Search expanded panel */}
        {isSearchExpanded && (
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск материалов..."
              aria-label="Search expanded"
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
      </div>
    </div>
  );
};
