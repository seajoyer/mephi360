import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { List, FixedLayout } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { SearchPanel } from '@/components/SearchPanel';
import { Heading } from '@/components/Heading';
import { TeachersList } from '@/components/TeachersList';
import { NavigationButtons } from '@/components/NavigationButtons';
import { BottomControl } from '@/components/BottomControl';

export const IndexPage: FC = () => {
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
                    <Heading />
                    <NavigationButtons />
                    <SearchPanel ref={searchPanelRef} />
                    <TeachersList />
                </List>
            </div>
            <FixedLayout vertical="bottom">
                <BottomControl className={`${showBottomControl ? 'opacity-100' : 'opacity-0 translate-y-15 pointer-events-none'}`} />
            </FixedLayout>
        </Page>
    );
};
