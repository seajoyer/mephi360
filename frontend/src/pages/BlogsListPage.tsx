import React, { useState } from 'react';
import { Page } from '@/components/Page';
import { BlogsList } from '@/components/list/BlogsList';
import { BlogsSearchPanel } from '@/components/search/BlogsSearchPanel';

export const BlogsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

  return (
    <Page back={true}>
      <div className="px-2 overflow-x-hidden">
        <BlogsSearchPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
        />
      </div>

        <BlogsList
          searchQuery={searchQuery}
          departmentFilter={departmentFilter}
        />
    </Page>
  );
};
