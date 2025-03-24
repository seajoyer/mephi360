import React, { useState, useEffect } from 'react';
import { Page } from '@/components/Page';
import { StuffList } from '@/components/list/StuffList';
import { StuffSearchPanel } from '@/components/search/StuffSearchPanel';
import { TabBar } from '@/components/layout/TabBar';
import { useFilters } from '@/contexts/FilterContext';

export const StuffPage: React.FC = () => {
  // Use context for filters if available, otherwise use local state
  const {
    stuffFilters,
    setSearchQuery: setContextSearchQuery,
    setStuffType,
    setStuffTeacher,
    setStuffSubject,
    setStuffSemester,
    setStuffInstitute
  } = useFilters();

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [teacherFilter, setTeacherFilter] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState<string | null>(null);
  const [instituteFilter, setInstituteFilter] = useState<string | null>(null);

  // Sync local state with context on mount
  useEffect(() => {
    if (stuffFilters) {
      setSearchQuery(stuffFilters.search || '');
      setTypeFilter(stuffFilters.type);
      setTeacherFilter(stuffFilters.teacher);
      setSubjectFilter(stuffFilters.subject);
      setSemesterFilter(stuffFilters.semester);
      setInstituteFilter(stuffFilters.institute);
    }
  }, [stuffFilters]);

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setContextSearchQuery && setContextSearchQuery(query);
  };

  // Handle type filter change
  const handleTypeFilterChange = (type: string | null) => {
    setTypeFilter(type);
    setStuffType && setStuffType(type);
  };

  // Handle teacher filter change
  const handleTeacherFilterChange = (teacher: string | null) => {
    setTeacherFilter(teacher);
    setStuffTeacher && setStuffTeacher(teacher);
  };

  // Handle subject filter change
  const handleSubjectFilterChange = (subject: string | null) => {
    setSubjectFilter(subject);
    setStuffSubject && setStuffSubject(subject);
  };

  // Handle semester filter change
  const handleSemesterFilterChange = (semester: string | null) => {
    setSemesterFilter(semester);
    setStuffSemester && setStuffSemester(semester);
  };

  // Handle institute filter change
  const handleInstituteFilterChange = (institute: string | null) => {
    setInstituteFilter(institute);
    setStuffInstitute && setStuffInstitute(institute);
  };

  return (
    <Page back={false}>
      <div className="px-2">
        <StuffSearchPanel
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          teacherFilter={teacherFilter}
          onTeacherFilterChange={handleTeacherFilterChange}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={handleSubjectFilterChange}
          semesterFilter={semesterFilter}
          onSemesterFilterChange={handleSemesterFilterChange}
          instituteFilter={instituteFilter}
          onInstituteFilterChange={handleInstituteFilterChange}
        />

        <StuffList
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          teacherFilter={teacherFilter}
          subjectFilter={subjectFilter}
          semesterFilter={semesterFilter}
          activeInstitute={instituteFilter}
        />
      </div>

      <TabBar />
    </Page>
  );
};
