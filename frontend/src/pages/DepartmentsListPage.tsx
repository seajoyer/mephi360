import React, { useState } from 'react';
import { Page } from '@/components/Page';
import { DepartmentList } from '@/components/list/DepartmentList';
import { DepartmentsSearchPanel } from '@/components/search/DepartmentsSearchPanel';

export const DepartmentsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Page back={true}>
      <div className="px-0">
        <DepartmentsSearchPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <DepartmentList searchQuery={searchQuery} />
      </div>
    </Page>
  );
};
