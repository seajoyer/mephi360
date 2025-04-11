import React from 'react';
import { Page } from '@/components/Page';
import { StuffList } from '@/components/list/StuffList';
import { StuffSearchPanel } from '@/components/search/StuffSearchPanel';
import { TabBar } from '@/components/layout/TabBar';
import { useFilters } from '@/contexts/FilterContext';

export const StuffListPage: React.FC = () => {
  const {
    stuffFilters,
    setStuffType,
    setStuffTeacher,
    setStuffSubject,
    setStuffSemester,
    setStuffInstitute,
    setSearchQuery
  } = useFilters();

  return (
    <Page back={true}>
        <StuffSearchPanel
          searchQuery={stuffFilters.search}
          onSearchChange={setSearchQuery}
          typeFilter={stuffFilters.type}
          onTypeFilterChange={setStuffType}
          teacherFilter={stuffFilters.teacher}
          onTeacherFilterChange={setStuffTeacher}
          subjectFilter={stuffFilters.subject}
          onSubjectFilterChange={setStuffSubject}
          semesterFilter={stuffFilters.semester}
          onSemesterFilterChange={setStuffSemester}
          instituteFilter={stuffFilters.institute}
          onInstituteFilterChange={setStuffInstitute}
        />

      <div className="px-2">
        <StuffList
          searchQuery={stuffFilters.search}
          typeFilter={stuffFilters.type}
          teacherFilter={stuffFilters.teacher}
          subjectFilter={stuffFilters.subject}
          semesterFilter={stuffFilters.semester}
          activeInstitute={stuffFilters.institute}
        />
      </div>

      <TabBar />
    </Page>
  );
};
