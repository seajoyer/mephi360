import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { ModalOverlay } from './ModalOverlay';
import { getDepartmentOptions } from '@/services/apiService';
import { FilterContainer, SearchPanelStyles } from './SearchPanelComponents';
import { FilterButton } from './FilterButton';
import { SearchPanelBase } from './SearchPanelBase';

interface TutorsSearchPanelProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    departmentFilter: string | null;
    onDepartmentFilterChange: (department: string | null) => void;
}

export const TutorsSearchPanel: React.FC<TutorsSearchPanelProps> = ({
    searchQuery,
    onSearchChange,
    departmentFilter,
    onDepartmentFilterChange
}) => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [departmentOptions, setDepartmentOptions] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterOverlayVisible, setFilterOverlayVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Find selected department name
    const selectedDepartmentName = departmentFilter
        ? departmentOptions.find(dept => dept.id === departmentFilter)?.name || ''
        : '';

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

    // Handle filter overlay
    const openFilterOverlay = () => setFilterOverlayVisible(true);
    const closeFilterOverlay = () => setFilterOverlayVisible(false);
    const handleDepartmentSelect = (departmentId: string | null) => {
        onDepartmentFilterChange(departmentId);
    };

    return (
        <>
            <SearchPanelBase dataAttr="tutors">
                <SearchPanelStyles />

                <div className="flex gap-2 items-center px-3">
                    {/* Search field */}
                    <div
                        className="flex-shrink-0 transition-all duration-200 ease-in-out"
                        style={{
                            width: isSearchExpanded ? 'calc(100%)' : '42px',
                            maxWidth: isSearchExpanded ? 'calc(100%)' : '42px',
                            zIndex: 2
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
                                placeholder={isSearchExpanded ? "Поиск по преподавателям" : ""}
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
                    <FilterContainer isHidden={isSearchExpanded}>
                        <FilterButton
                            label={departmentFilter ? selectedDepartmentName : 'Все кафедры'}
                            selected={!!departmentFilter}
                            onClick={openFilterOverlay}
                            onClear={() => onDepartmentFilterChange(null)}
                            expandable={true}
                            className="filter-button"
                        />
                    </FilterContainer>
                </div>
            </SearchPanelBase>

            {/* Modal Filter Overlay */}
            <ModalOverlay
                title="Выберите кафедру"
                options={departmentOptions}
                selectedOption={departmentFilter}
                onSelect={handleDepartmentSelect}
                onClose={closeFilterOverlay}
                isVisible={filterOverlayVisible}
                parentHasBackButton={true}
            />
        </>
    );
};
