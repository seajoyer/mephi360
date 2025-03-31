import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/Page';
import {
  Cell,
  List,
  Section,
  Button,
  Placeholder
} from '@telegram-apps/telegram-ui';
import { TopButtons } from '@/components/layout/TopButtons';
import { StuffPageButtons } from '@/components/layout/StuffPageButtons';
import { TabBar } from '@/components/layout/TabBar';
import { FilterSelectionOverlay } from '@/components/search/FilterSelectionOverlay';
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

export const StuffPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    setStuffType,
    setStuffTeacher,
    setStuffSubject,
    setStuffSemester,
    filterOptions,
  } = useFilters();

  // Local filter state
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [teacherFilter, setTeacherFilter] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState<string | null>(null);

  // State for filter selection overlays
  const [filterOverlay, setFilterOverlay] = useState<{
    type: 'none' | 'type' | 'teacher' | 'subject' | 'semester';
    isVisible: boolean;
  }>({ type: 'none', isVisible: false });

  // Find selected option names for display
  const getSelectedOptionName = (options: DropdownOption[], selectedId: string | null, filterType: 'teacher' | 'subject' | 'semester' | 'type') => {
    if (!selectedId) {
      // Return specific default text for each filter type
      switch (filterType) {
        case 'teacher': return 'Все преподаватели';
        case 'subject': return 'Все предметы';
        case 'semester': return 'Все семестры';
        case 'type': return 'Все типы';
        default: return 'Все';
      }
    }
    const option = options.find(opt => opt.id === selectedId);
    return option ? option.name : 'Все';
  };

  // Handle showing the filter results
  const handleShowResults = () => {
    // Apply local filters to global context
    setStuffType(typeFilter);
    setStuffTeacher(teacherFilter);
    setStuffSubject(subjectFilter);
    setStuffSemester(semesterFilter);

    // Navigate to the StuffList page with filters applied
    navigate('/stuff/list');
  };

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
        setTypeFilter(value);
        break;
      case 'teacher':
        setTeacherFilter(value);
        break;
      case 'subject':
        setSubjectFilter(value);
        break;
      case 'semester':
        setSemesterFilter(value);
        break;
    }
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
        return "Выберите тип материала";
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
              before={<Icon24Tutor_hat />}
              after={
                <Icon20Chevron_vertical
                  style={{ color: `var(--tgui--hint_color)` }}
                />
              }
              onClick={() => openFilterOverlay('teacher')}
            >
              {getSelectedOptionName(filterOptions.materialTeachers, teacherFilter, 'teacher')}
            </Cell>
          </Section>

          <Section>
            <Cell
              before={<Icon24Atom />}
              after={
                <Icon20Chevron_vertical
                  style={{ color: `var(--tgui--hint_color)` }}
                />
              }
              onClick={() => openFilterOverlay('subject')}
            >
              {getSelectedOptionName(filterOptions.materialSubjects, subjectFilter, 'subject')}
            </Cell>
          </Section>

          <Section>
            <Cell
              before={<Icon24Clock />}
              after={
                <Icon20Chevron_vertical
                  style={{ color: `var(--tgui--hint_color)` }}
                />
              }
              onClick={() => openFilterOverlay('semester')}
            >
              {getSelectedOptionName(filterOptions.materialSemesters, semesterFilter, 'semester')}
            </Cell>
          </Section>

          <Section>
            <Cell
              before={<Icon24Actions />}
              after={
                <Icon20Chevron_vertical
                  style={{ color: `var(--tgui--hint_color)` }}
                />
              }
              onClick={() => openFilterOverlay('type')}
            >
              {getSelectedOptionName(filterOptions.materialTypes, typeFilter, 'type')}
            </Cell>
          </Section>

          <Button
            className="w-full"
            mode="bezeled"
            after={<Icon16Chevron_right />}
            onClick={handleShowResults}
          >
            Найти
          </Button>
        </List>

        <TabBar />

{/* Filter Selection Overlay */}
        <FilterSelectionOverlay
          title={getFilterTitle()}
          options={getFilterOptions()}
          selectedOption={getSelectedOption()}
          onSelect={handleFilterSelect}
          onClose={closeFilterOverlay}
          isVisible={filterOverlay.isVisible}
          parentHasBackButton={false} // StuffPage has no back button
        />
      </div>
    </Page>
  );
};
