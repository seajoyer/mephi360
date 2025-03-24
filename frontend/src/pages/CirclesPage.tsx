import React, { useState, useEffect } from 'react';
import { Page } from '@/components/Page';
import { ClubsList } from '@/components/list/ClubsList';
import { CirclesSearchPanel } from '@/components/search/CirclesSearchPanel';
import { TabBar } from '@/components/layout/TabBar';
import { useFilters } from '@/contexts/FilterContext';

export const CirclesPage: React.FC = () => {
  // Use context for filters if available, otherwise use local state
  const {
    clubsFilters,
    setSearchQuery: setContextSearchQuery,
    setClubOrganizer,
    setClubSubject
  } = useFilters();

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [organizerFilter, setOrganizerFilter] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  // Sync local state with context on mount
  useEffect(() => {
    if (clubsFilters) {
      setSearchQuery(clubsFilters.search || '');
      setOrganizerFilter(clubsFilters.organizer);
      setSubjectFilter(clubsFilters.subject);
    }
  }, [clubsFilters]);

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setContextSearchQuery && setContextSearchQuery(query);
  };

  // Handle organizer filter change
  const handleOrganizerFilterChange = (organizer: string | null) => {
    setOrganizerFilter(organizer);
    setClubOrganizer && setClubOrganizer(organizer);
  };

  // Handle subject filter change
  const handleSubjectFilterChange = (subject: string | null) => {
    setSubjectFilter(subject);
    setClubSubject && setClubSubject(subject);
  };

  return (
    <Page back={false}>
      <div className="px-0">
        <CirclesSearchPanel
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          organizerFilter={organizerFilter}
          onOrganizerFilterChange={handleOrganizerFilterChange}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={handleSubjectFilterChange}
        />

        <ClubsList
          searchQuery={searchQuery}
          organizerFilter={organizerFilter}
          subjectFilter={subjectFilter}
        />
      </div>

      <TabBar />
    </Page>
  );
};
