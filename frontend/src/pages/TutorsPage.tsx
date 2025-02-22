import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { List, FixedLayout } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { SearchPanel } from '@/components/SearchPanel';
import { TopPart } from '@/components/TopPart';
import { BottomControl as TabBar } from '@/components/BottomControl';
import BottomPart from '@/components/BottomPart';

export const TutorsPage: FC = () => {
    const [showBottomControl, setShowBottomControl] = useState(false);
    const searchPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (searchPanelRef.current) {
                const containerRect = searchPanelRef.current.getBoundingClientRect();
                const stickyTop = 8;

                // Show BottomControl when SearchPanel reaches the top
                if (containerRect.top <= stickyTop) {
                    setShowBottomControl(true);
                } else {
                    setShowBottomControl(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Page back={false}>
            <div className={showBottomControl ? 'pb-12' : ''}>
                <List>
                    <TopPart />
                    <SearchPanel ref={searchPanelRef} />
                </List>
                    <BottomPart />
            </div>
            <FixedLayout vertical="bottom">
                <TabBar className={`${showBottomControl ? 'opacity-100' : 'opacity-0 translate-y-15 pointer-events-none'}`} />
            </FixedLayout>
        </Page>
    );
};
