import React, { useState, useRef } from 'react';
import { Page } from '@/components/Page';
import { CirclesList } from '@/components/list/CirclesList';
import { CirclesSearchPanel } from '@/components/search/CirclesSearchPanel';
import { TabBar } from '@/components/layout/TabBar';
import { Button, LargeTitle } from '@telegram-apps/telegram-ui';
import { Icon20Add } from '@/icons/20/Add';
import { Icon20Alt_star_fill } from '@/icons/20/alt_star_fill';
import { Icon24Add_circle_fill } from '@/icons/24/add_circle_fill';

export const CirclesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [organizerFilter, setOrganizerFilter] = useState<string | null>(null);
    const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
    const headerRef = useRef<HTMLDivElement>(null); // Create reference for the header

    return (
        <Page back={false}>
            <div
                ref={headerRef} // Attach reference to the header element
                className='px-3 pt-6 pb-1.5 flex place-content-between'
            >
                <LargeTitle
                    weight='1'
                >
                    Кружки
                </LargeTitle>

                <Button
                    className='mt-1'
                    mode='plain'
                    size='s'
                >
                    <Icon24Add_circle_fill />
                </Button>
            </div>

            <CirclesSearchPanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                organizerFilter={organizerFilter}
                onOrganizerFilterChange={setOrganizerFilter}
                subjectFilter={subjectFilter}
                onSubjectFilterChange={setSubjectFilter}
                shadowReferenceElement={headerRef} // Pass the reference element
            />

            <div
                className='px-2'
            >
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
