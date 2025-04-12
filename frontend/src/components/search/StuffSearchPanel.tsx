import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Button } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { ModalOverlay } from './ModalOverlay';
import {
    getMaterialTypes,
    getMaterialTeachers,
    getMaterialSubjects,
    getMaterialSemesters,
    DropdownOption
} from '@/services/apiService';
import { FilterContainer, SearchPanelStyles } from './SearchPanelComponents';
import { FilterButton } from './FilterButton';
import { SearchPanelBase } from './SearchPanelBase';

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

// Institute Selector component with improved scrollability
interface InstituteSelectorProps {
    activeInstitute: string | null;
    onSelect: (institute: string | null) => void;
    disableAnimation?: boolean;
    expanded: boolean;
}

const InstituteSelector: React.FC<InstituteSelectorProps> = ({
    activeInstitute,
    onSelect,
    disableAnimation = false,
    expanded
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Smooth scroll to selected item when expanded
    useEffect(() => {
        if (expanded && containerRef.current) {
            const container = containerRef.current;
            const selectedButton = container.querySelector('button[aria-selected="true"]');

            if (selectedButton) {
                // Calculate position to scroll the selected button to center
                const containerWidth = container.offsetWidth;
                const buttonLeft = (selectedButton as HTMLElement).offsetLeft;
                const buttonWidth = (selectedButton as HTMLElement).offsetWidth;
                const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

                // Smooth scroll to position
                container.scrollTo({
                    left: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            }
        }
    }, [expanded]);

    return (
        <div
            ref={containerRef}
            className="flex gap-2 overflow-x-auto no-scrollbar"
            style={{
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                transition: 'all 0.2s ease-in-out',
                width: '100%',
                paddingRight: '4px' // Add some padding for visual comfort
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

    // State for filter selection overlay
    const [filterOverlay, setFilterOverlay] = useState<{
        type: 'none' | 'type' | 'teacher' | 'subject' | 'semester';
        isVisible: boolean;
    }>({ type: 'none', isVisible: false });

    const inputRef = useRef<HTMLInputElement>(null);
    const instituteSelectorRef = useRef<HTMLDivElement>(null);
    const [shouldAnimateInstitute, setShouldAnimateInstitute] = useState(false);

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

        // Add a small delay before collapsing to make transition smoother
        setTimeout(() => {
            setIsInstituteExpanded(false);
        }, 50);
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

    // Open filter overlay
    const openFilterOverlay = (type: 'type' | 'teacher' | 'subject' | 'semester') => {
        setFilterOverlay({ type, isVisible: true });
    };

    // Close filter overlay
    const closeFilterOverlay = () => {
        setFilterOverlay({ type: 'none', isVisible: false });
    };

    // Handle filter selection
    const handleFilterSelect = (value: string | null) => {
        switch (filterOverlay.type) {
            case 'type':
                onTypeFilterChange(value);
                break;
            case 'teacher':
                onTeacherFilterChange(value);
                break;
            case 'subject':
                onSubjectFilterChange(value);
                break;
            case 'semester':
                onSemesterFilterChange(value);
                break;
        }
    };

    // Get filter options based on active filter type
    const getFilterOptions = () => {
        switch (filterOverlay.type) {
            case 'type':
                return filterOptions.types;
            case 'teacher':
                return filterOptions.teachers;
            case 'subject':
                return filterOptions.subjects;
            case 'semester':
                return filterOptions.semesters;
            default:
                return [];
        }
    };

    // Get filter title based on active filter type
    const getFilterTitle = () => {
        switch (filterOverlay.type) {
            case 'type':
                return "Выберите тип";
            case 'teacher':
                return "Выберите преподавателя";
            case 'subject':
                return "Выберите предмет";
            case 'semester':
                return "Выберите семестр";
            default:
                return "";
        }
    };

    // Get selected option based on active filter type
    const getSelectedOption = () => {
        switch (filterOverlay.type) {
            case 'type':
                return typeFilter;
            case 'teacher':
                return teacherFilter;
            case 'subject':
                return subjectFilter;
            case 'semester':
                return semesterFilter;
            default:
                return null;
        }
    };

    return (
        <>
            <SearchPanelBase dataAttr="stuff">
                <SearchPanelStyles />

                <div className="px-2 relative">
                    <div className="flex gap-2 items-center">
                        {/* Institute Button - Always visible in normal flow */}
                        <div className="flex-shrink-0 z-10" style={{ width: '42px', height: '42px' }}>
                            <InstituteButton
                                institute={selectedInstitute}
                                isSelected={!!selectedInstitute || instituteFilter === null}
                                onClick={handleInstituteExpand}
                                disableAnimation={!shouldAnimateInstitute}
                            />
                        </div>

                        {/* Search Input */}
                        <div
                            className="transition-all duration-200 ease-in-out flex-shrink-0"
                            style={{
                                width: isSearchExpanded ? 'calc(100% - 42px - 8px)' : '42px',
                                maxWidth: isSearchExpanded ? 'calc(100% - 42px - 8px)' : '42px',
                                zIndex: 2,
                                opacity: isInstituteExpanded ? 0 : 1,
                                pointerEvents: isInstituteExpanded ? 'none' : 'auto'
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
                                    placeholder={isSearchExpanded ? "Поиск по материалам" : ""}
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    aria-label="Search"
                                    style={{
                                        maxWidth: isSearchExpanded ? '' : '42px',
                                        maxHeight: isSearchExpanded ? '' : '42px',
                                    }}
                                    before={
                                        <div
                                            className="translate-x-[calc(50%-12px)] search-icon-transition"
                                            style={{
                                                color: isSearchExpanded ? 'var(--tgui--hint_color)' : ''
                                            }}
                                            aria-hidden="true"
                                        >
                                            <Icon24Search />
                                        </div>
                                    }
                                    after={isSearchExpanded &&
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
                        </div>

                        {/* Filter buttons */}
                        <div
                            style={{
                                flex: 1,
                                opacity: areFiltersHidden ? 0 : 1,
                                transition: 'opacity 0.2s ease-in-out',
                                pointerEvents: areFiltersHidden ? 'none' : 'auto'
                            }}
                        >
                            <FilterContainer isHidden={areFiltersHidden}>
                                {/* Type filter button */}
                                <FilterButton
                                    label={typeFilter ? typeOptionName : 'Тип'}
                                    selected={!!typeFilter}
                                    onClick={() => openFilterOverlay('type')}
                                    onClear={() => onTypeFilterChange(null)}
                                    className="filter-button"
                                />

                                {/* Teacher filter button */}
                                <FilterButton
                                    label={teacherFilter ? teacherOptionName : 'Препод'}
                                    selected={!!teacherFilter}
                                    onClick={() => openFilterOverlay('teacher')}
                                    onClear={() => onTeacherFilterChange(null)}
                                    className="filter-button"
                                />

                                {/* Subject filter button */}
                                <FilterButton
                                    label={subjectFilter ? subjectOptionName : 'Предмет'}
                                    selected={!!subjectFilter}
                                    onClick={() => openFilterOverlay('subject')}
                                    onClear={() => onSubjectFilterChange(null)}
                                    className="filter-button"
                                />

                                {/* Semester filter button */}
                                <FilterButton
                                    label={semesterFilter ? semesterOptionName : 'Семестр'}
                                    selected={!!semesterFilter}
                                    onClick={() => openFilterOverlay('semester')}
                                    onClear={() => onSemesterFilterChange(null)}
                                    className="filter-button"
                                />
                            </FilterContainer>
                        </div>
                    </div>

                    {/* Expanded Institute Selector - Absolute positioned overlay */}
                    {isInstituteExpanded && (
                        <div
                            ref={instituteSelectorRef}
                            className="institute-container absolute top-0 left-2 right-2"
                            style={{
                                zIndex: 20,
                                transition: 'all 0.2s ease-in-out',
                                background: 'var(--tgui--secondary_bg_color)',
                                opacity: 1
                            }}
                        >
                            <InstituteSelector
                                activeInstitute={instituteFilter}
                                onSelect={handleInstituteSelect}
                                disableAnimation={!shouldAnimateInstitute}
                                expanded={isInstituteExpanded}
                            />
                        </div>
                    )}
                </div>
            </SearchPanelBase>

            {/* Modal Filter Overlay */}
            <ModalOverlay
                title={getFilterTitle()}
                options={getFilterOptions()}
                selectedOption={getSelectedOption()}
                onSelect={handleFilterSelect}
                onClose={closeFilterOverlay}
                isVisible={filterOverlay.isVisible}
                parentHasBackButton={true}
            />
        </>
    );
};
