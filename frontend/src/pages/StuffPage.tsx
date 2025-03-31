import React, { useState, useEffect } from 'react';
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
import { FilterSelectionPage } from '@/pages/FilterSelectionPage';
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

  // State for filter selection screens
  const [filterView, setFilterView] = useState<'main' | 'type' | 'teacher' | 'subject' | 'semester'>('main');

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

  // Handle selecting a type filter
  const handleTypeSelect = (option: string | null) => {
    setTypeFilter(option);
    setFilterView('main');
  };

  // Handle selecting a teacher filter
  const handleTeacherSelect = (option: string | null) => {
    setTeacherFilter(option);
    setFilterView('main');
  };

  // Handle selecting a subject filter
  const handleSubjectSelect = (option: string | null) => {
    setSubjectFilter(option);
    setFilterView('main');
  };

  // Handle selecting a semester filter
  const handleSemesterSelect = (option: string | null) => {
    setSemesterFilter(option);
    setFilterView('main');
  };

  // Render appropriate view based on state
  if (filterView === 'type') {
    return (
      <FilterSelectionPage
        title="Выберите тип материала"
        options={filterOptions.materialTypes}
        selectedOption={typeFilter}
        onSelect={handleTypeSelect}
      />
    );
  }

  if (filterView === 'teacher') {
    return (
      <FilterSelectionPage
        title="Выберите преподавателя"
        options={filterOptions.materialTeachers}
        selectedOption={teacherFilter}
        onSelect={handleTeacherSelect}
      />
    );
  }

  if (filterView === 'subject') {
    return (
      <FilterSelectionPage
        title="Выберите предмет"
        options={filterOptions.materialSubjects}
        selectedOption={subjectFilter}
        onSelect={handleSubjectSelect}
      />
    );
  }

  if (filterView === 'semester') {
    return (
      <FilterSelectionPage
        title="Выберите семестр"
        options={filterOptions.materialSemesters}
        selectedOption={semesterFilter}
        onSelect={handleSemesterSelect}
      />
    );
  }

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
              onClick={() => setFilterView('teacher')}
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
              onClick={() => setFilterView('subject')}
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
              onClick={() => setFilterView('semester')}
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
              onClick={() => setFilterView('type')}
            >
              {getSelectedOptionName(filterOptions.materialTypes, typeFilter, 'type')}
            </Cell>
          </Section>

          <Button
            className="mt-1 w-full"
            size='m'
            mode="bezeled"
            after={<Icon16Chevron_right />}
            onClick={handleShowResults}
          >
            Найти
          </Button>
        </List>

        <TabBar />
      </div>
    </Page>
  );
};
