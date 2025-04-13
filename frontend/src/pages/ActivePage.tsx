import React, { useState, useRef } from 'react';
import { Page } from '@/components/Page';
import { ActiveList } from '@/components/list/ActiveList';
import { ActiveSearchPanel } from '@/components/search/ActiveSearchPanel';
import { TabBar } from '@/components/layout/TabBar';
import { Badge, Button, Cell, LargeTitle, Section } from '@telegram-apps/telegram-ui';
import { Icon24Add_circle_fill } from '@/icons/24/add_circle_fill';
import { Icon16Person } from '@/icons/16/person';

export const ActivePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const headerRef = useRef<HTMLDivElement>(null); // Reference for the header

    // Handle adding a new community
    const handleAddCommunity = () => {
        console.log('Add new community clicked');
        // Implementation for adding a new community would go here
    };

    return (
        <Page back={false}>
            <div
                ref={headerRef} // Attach reference to the header element
                className='px-3 pt-6 pb-1.5 flex place-content-between'
            >
                <LargeTitle weight='1'>
                    Движ
                </LargeTitle>

                <Button
                    className='mt-1'
                    mode='plain'
                    size='s'
                    onClick={handleAddCommunity}
                >
                    <Icon24Add_circle_fill />
                </Button>
            </div>

            <ActiveSearchPanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                shadowReferenceElement={headerRef} // Pass the reference element
            />

            <div className='px-3'>
                <ActiveList
                    searchQuery={searchQuery}
                />
            </div>

            <TabBar />
        </Page>
    );
};
