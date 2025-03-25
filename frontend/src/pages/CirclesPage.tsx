import React, { useState } from 'react';
import { Page } from '@/components/Page';
import { ClubsList } from '@/components/list/ClubsList';
import { CirclesSearchPanel } from '@/components/search/CirclesSearchPanel';
import { TabBar } from '@/components/layout/TabBar';

export const CirclesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [organizerFilter, setOrganizerFilter] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  return (
    <Page back={false}>
      <div className="pl-2 overflow-x-hidden">
        <CirclesSearchPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          organizerFilter={organizerFilter}
          onOrganizerFilterChange={setOrganizerFilter}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
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
