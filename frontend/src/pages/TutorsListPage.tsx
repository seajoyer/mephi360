import React, { useState } from 'react';
import { Page } from '@/components/Page';
import { TutorsList } from '@/components/list/TutorsList';
import { TutorsSearchPanel } from '@/components/search/TutorsSearchPanel';

export const TutorsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

  return (
    <Page back={true}>
      <div className="px-0">
        <TutorsSearchPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
        />

        <TutorsList
          searchQuery={searchQuery}
          departmentFilter={departmentFilter}
        />
      </div>
    </Page>
  );
};
