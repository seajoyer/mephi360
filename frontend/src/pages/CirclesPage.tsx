import React, { useState } from 'react';
import { Page } from '@/components/Page';
import { CirclesList } from '@/components/list/CirclesList';
import { CirclesSearchPanel } from '@/components/search/CirclesSearchPanel';
import { TabBar } from '@/components/layout/TabBar';
import { Button, LargeTitle } from '@telegram-apps/telegram-ui';

export const CirclesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [organizerFilter, setOrganizerFilter] = useState<string | null>(null);
    const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

    return (
        <Page back={false}>
            <div className="px-2">

                <div
                    className='pt-6 pb-1.5 px-1 flex place-content-between'
                >
                    <LargeTitle
                        weight='1'
                    >
                        Кружки
                    </LargeTitle>

                    <Button
                      className='mt-1'
                      mode='outline'
                      size='s'
                    >
                      Хочу ещё
                    </Button>
                </div>

                <CirclesSearchPanel
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    organizerFilter={organizerFilter}
                    onOrganizerFilterChange={setOrganizerFilter}
                    subjectFilter={subjectFilter}
                    onSubjectFilterChange={setSubjectFilter}
                />

                <CirclesList
                    searchQuery={searchQuery}
                    organizerFilter={organizerFilter}
                    subjectFilter={subjectFilter}
                />
            </div>

            <TabBar />
        </Page>
    );
};
