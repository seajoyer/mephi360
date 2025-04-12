import React, { useState } from 'react';
import { Page } from '@/components/Page';
import { ClubsList } from '@/components/list/ClubsList';
import { ClubsSearchPanel } from '@/components/search/ClubsSearchPanel';
import { TabBar } from '@/components/layout/TabBar';

export const ClubsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Page back={true}>
            <ClubsSearchPanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <ClubsList searchQuery={searchQuery} />

            <TabBar />
        </Page>
    );
};

export default ClubsPage;
