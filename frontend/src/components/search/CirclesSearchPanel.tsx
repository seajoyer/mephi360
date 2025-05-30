import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { ModalOverlay } from './ModalOverlay';
import { getCircleOrganizers, getCircleSubjects, DropdownOption } from '@/services/apiService';
import { FilterContainer, SearchPanelStyles } from './SearchPanelComponents';
import { FilterButton } from './FilterButton';
import { SearchPanelBase } from './SearchPanelBase';

interface CirclesSearchPanelProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    organizerFilter: string | null;
    onOrganizerFilterChange: (organizer: string | null) => void;
    subjectFilter: string | null;
    onSubjectFilterChange: (subject: string | null) => void;
    shadowReferenceElement?: React.RefObject<HTMLElement>;
}

export const CirclesSearchPanel: React.FC<CirclesSearchPanelProps> = ({
    searchQuery,
    onSearchChange,
    organizerFilter,
    onOrganizerFilterChange,
    subjectFilter,
    onSubjectFilterChange,
    shadowReferenceElement
}) => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [organizerOptions, setOrganizerOptions] = useState<DropdownOption[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<DropdownOption[]>([]);
    const [isLoading, setIsLoading] = useState({
        organizers: false,
        subjects: false
    });

    // State for filter selection overlay
    const [filterOverlay, setFilterOverlay] = useState<{
        type: 'none' | 'organizer' | 'subject';
        isVisible: boolean;
    }>({ type: 'none', isVisible: false });

    const inputRef = useRef<HTMLInputElement>(null);

    // Load filter options
    useEffect(() => {
        const loadOptions = async () => {
            // Load circle organizers
            setIsLoading(prev => ({ ...prev, organizers: true }));
            try {
                const organizersResponse = await getCircleOrganizers();
                setOrganizerOptions(organizersResponse.items);
            } catch (error) {
                console.error('Error loading organizers:', error);
            } finally {
                setIsLoading(prev => ({ ...prev, organizers: false }));
            }

            // Load circle subjects
            setIsLoading(prev => ({ ...prev, subjects: true }));
            try {
                const subjectsResponse = await getCircleSubjects();
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

    // Find selected option names for display
    const getSelectedOptionName = (options: DropdownOption[], selectedId: string | null) => {
        if (!selectedId) return '';
        const option = options.find(opt => opt.id === selectedId);
        return option ? option.name : '';
    };

    const organizerOptionName = getSelectedOptionName(organizerOptions, organizerFilter);
    const subjectOptionName = getSelectedOptionName(subjectOptions, subjectFilter);

    // Open filter overlay
    const openFilterOverlay = (type: 'organizer' | 'subject') => {
        setFilterOverlay({ type, isVisible: true });
    };

    // Close filter overlay
    const closeFilterOverlay = () => {
        setFilterOverlay({ type: 'none', isVisible: false });
    };

    // Handle filter selection
    const handleFilterSelect = (value: string | null) => {
        switch (filterOverlay.type) {
            case 'organizer':
                onOrganizerFilterChange(value);
                break;
            case 'subject':
                onSubjectFilterChange(value);
                break;
        }
    };

    // Get filter options based on active filter type
    const getFilterOptions = () => {
        switch (filterOverlay.type) {
            case 'organizer':
                return organizerOptions;
            case 'subject':
                return subjectOptions;
            default:
                return [];
        }
    };

    // Get filter title based on active filter type
    const getFilterTitle = () => {
        switch (filterOverlay.type) {
            case 'organizer':
                return "Организатор кружка";
            case 'subject':
                return "Направление кружка";
            default:
                return "";
        }
    };

    // Get selected option based on active filter type
    const getSelectedOption = () => {
        switch (filterOverlay.type) {
            case 'organizer':
                return organizerFilter;
            case 'subject':
                return subjectFilter;
            default:
                return null;
        }
    };

    return (
        <>
            <SearchPanelBase
                dataAttr="circles"
                shadowReferenceElement={shadowReferenceElement}
            >
                <SearchPanelStyles />

                <div className="flex gap-2 items-center px-3">
                    {/* Search field container with transition */}
                    <div
                        className={`flex-shrink-0 transition-all duration-200 ease-in-out ${!isSearchExpanded ? 'search-input-collapsed' : ''}`}
                        style={{
                            width:    isSearchExpanded ? 'calc(100%)' : '42px',
                            maxWidth: isSearchExpanded ? 'calc(100%)' : '42px',
                            zIndex: isSearchExpanded ? 10 : 2 // Higher z-index when expanded to cover filters
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
                                    placeholder={isSearchExpanded ? "Поиск кружков..." : ""}
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

                    {/* Filters - only visible when search is not expanded */}
                    <FilterContainer isHidden={isSearchExpanded}>
                        {/* Subject filter button */}
                        <FilterButton
                            label={subjectFilter ? subjectOptionName : 'Предмет'}
                            selected={!!subjectFilter}
                            onClick={() => openFilterOverlay('subject')}
                            onClear={() => onSubjectFilterChange(null)}
                            className="filter-button"
                        />

                        {/* Organizer filter button */}
                        <FilterButton
                            label={organizerFilter ? organizerOptionName : 'Организатор'}
                            selected={!!organizerFilter}
                            onClick={() => openFilterOverlay('organizer')}
                            onClear={() => onOrganizerFilterChange(null)}
                            className="filter-button"
                        />
                    </FilterContainer>
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
                parentHasBackButton={false}
            />
        </>
    );
};
