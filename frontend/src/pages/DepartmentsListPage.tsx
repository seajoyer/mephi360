import React, { useState } from 'react';
import { Page } from '@/components/Page';
import { DepartmentList } from '@/components/list/DepartmentList';
import { DepartmentsSearchPanel } from '@/components/search/DepartmentsSearchPanel';

export const DepartmentsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Page back={true}>
      <div className="pl-2 overflow-x-hidden">
        <DepartmentsSearchPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <DepartmentList searchQuery={searchQuery} />
      </div>
    </Page>
  );
};
