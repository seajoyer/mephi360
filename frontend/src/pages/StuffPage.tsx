import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/Page';
import {
    Cell,
    List,
    Section,
    Button,
    Placeholder,
    Divider
} from '@telegram-apps/telegram-ui';
import { TopButtons } from '@/components/layout/TopButtons';
import { StuffPageButtons } from '@/components/layout/StuffPageButtons';
import { ModalOverlay } from '@/components/search/ModalOverlay';
import { useFilters } from '@/contexts/FilterContext';
import {
    DropdownOption
} from '@/services/apiService';

// Import icons
import { Icon24Tutor_hat } from '@/icons/24/tutor_hat';
import { Icon24Atom } from '@/icons/24/atom';
import { Icon24Clock } from '@/icons/24/clock';
import { Icon24Actions } from '@/icons/24/actions';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';

// Import sticker
import stuff_512 from '@/stickers/stuff_512.gif';
import { Icon24Close } from '@/icons/24/close';

export const StuffPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        stuffFilters,
        setStuffType,
        setStuffTeacher,
        setStuffSubject,
        setStuffSemester,
        filterOptions
    } = useFilters();

    // Filter overlay state
    const [filterOverlay, setFilterOverlay] = useState<{
        type: 'none' | 'type' | 'teacher' | 'subject' | 'semester';
        isVisible: boolean;
    }>({ type: 'none', isVisible: false });

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
                setStuffType(value);
                break;
            case 'teacher':
                setStuffTeacher(value);
                break;
            case 'subject':
                setStuffSubject(value);
                break;
            case 'semester':
                setStuffSemester(value);
                break;
        }
        closeFilterOverlay();
    };

    // Navigate to list view
    const navigateToList = () => {
        navigate('/stuff/list');
    };

    // Helper function to get selected option name or default text
    const getSelectedOptionName = (
        options: DropdownOption[],
        selectedId: string | null,
        type: 'type' | 'teacher' | 'subject' | 'semester'
    ): JSX.Element => {
        if (!selectedId) {
            // Return default text with hint color
            let defaultText = '';
            switch (type) {
                case 'type':
                    defaultText = 'Все типы';
                    break;
                case 'teacher':
                    defaultText = 'Все преподаватели';
                    break;
                case 'subject':
                    defaultText = 'Все предметы';
                    break;
                case 'semester':
                    defaultText = 'Все семестры';
                    break;
            }
            return (
                <span style={{ color: 'var(--tgui--hint_color)' }}>{defaultText}</span>
            );
        }

        // Find the matching option
        const option = options.find(opt => opt.id === selectedId);
        return option ? (
          option.name
        ) : (
            <span style={{ color: 'var(--tgui--hint_color)' }}>Не выбрано</span>
        );
    };

    // Get filter options based on active filter type
    const getFilterOptions = () => {
        switch (filterOverlay.type) {
            case 'type':
                return filterOptions.materialTypes;
            case 'teacher':
                return filterOptions.materialTeachers;
            case 'subject':
                return filterOptions.materialSubjects;
            case 'semester':
                return filterOptions.materialSemesters;
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
                return stuffFilters.type;
            case 'teacher':
                return stuffFilters.teacher;
            case 'subject':
                return stuffFilters.subject;
            case 'semester':
                return stuffFilters.semester;
            default:
                return null;
        }
    };

    return (
        <Page back={false}>
            <div>
                <TopButtons />

                <Placeholder className="-mb-4 -mt-3">
                    <img
                        className="size-24"
                        alt="Stuff sticker"
                        src={stuff_512}
                    />
                </Placeholder>

                <List>
                    <StuffPageButtons />
                    <Section>
                        <Cell
                            before={<Icon24Actions />}
                            after={
                                stuffFilters.type ? (
                                    <Icon24Close
                                        className='-mr-0.5'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStuffType(null);
                                        }}
                                    />
                                ) : (
                                    <Icon20Chevron_vertical
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                )
                            }
                            onClick={() => openFilterOverlay('type')}
                        >
                            {getSelectedOptionName(filterOptions.materialTypes, stuffFilters.type, 'type')}
                        </Cell>
                        <Divider />
                        <Cell
                            before={<Icon24Tutor_hat />}
                            after={
                                stuffFilters.teacher ? (
                                    <Icon24Close
                                        className='-mr-0.5'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStuffTeacher(null);
                                        }}
                                    />
                                ) : (
                                    <Icon20Chevron_vertical
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                )
                            }
                            onClick={() => openFilterOverlay('teacher')}
                        >
                            {getSelectedOptionName(filterOptions.materialTeachers, stuffFilters.teacher, 'teacher')}
                        </Cell>
                        <Divider />
                        <Cell
                            before={<Icon24Atom />}
                            after={
                                stuffFilters.subject ? (
                                    <Icon24Close
                                        className='-mr-0.5'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStuffSubject(null);
                                        }}
                                    />
                                ) : (
                                    <Icon20Chevron_vertical
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                )
                            }
                            onClick={() => openFilterOverlay('subject')}
                        >
                            {getSelectedOptionName(filterOptions.materialSubjects, stuffFilters.subject, 'subject')}
                        </Cell>
                        <Divider />
                        <Cell
                            before={<Icon24Clock />}
                            after={
                                stuffFilters.semester ? (
                                    <Icon24Close
                                        className='-mr-0.5'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStuffSemester(null);
                                        }}
                                    />
                                ) : (
                                    <Icon20Chevron_vertical
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                )
                            }
                            onClick={() => openFilterOverlay('semester')}
                        >
                            {getSelectedOptionName(filterOptions.materialSemesters, stuffFilters.semester, 'semester')}
                        </Cell>
                    </Section>

                    <div className="mt-4">
                        <Button
                            after={<Icon16Chevron_right />}
                            size="m"
                            className="w-full"
                            mode="bezeled"
                            onClick={navigateToList}
                        >
                            Найти
                        </Button>
                    </div>
                </List>
            </div>

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
        </Page>
    );
};
