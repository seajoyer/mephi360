import React, { useRef } from 'react';
import type { FC } from 'react';
import { List, FixedLayout } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { BottomControl } from '@/components/BottomControl';
import { TopPart } from '@/components/TopPart';
import { BottomPart } from '@/components/BottomPart';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { useSectionTransition } from '@/hooks/useSectionTransition';
import { SECTIONS } from '@/components/BottomPart/NavigationButtons';

export const StudyPage: FC = () => {
    const searchPanelRef = useRef<HTMLDivElement>(null);
    const showBottomControl = useScrollVisibility({
        ref: searchPanelRef,
        threshold: 8
    });

    const {
        activeSection,
        handleSectionChange
    } = useSectionTransition({
        sections: SECTIONS,
        initialSection: 'tutors'
    });

    return (
        <Page back={false}>
            <div className={showBottomControl ? 'pb-12' : ''}>
                <List>
                    <TopPart />
                </List>
                <BottomPart
                    searchPanelRef={searchPanelRef}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />
            </div>
            <FixedLayout vertical="bottom">
                <BottomControl
                    className={`transition-all duration-300 ease-in-out
                        ${showBottomControl ? 'opacity-100' : 'opacity-0 translate-y-15 pointer-events-none'}`}
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />
            </FixedLayout>
        </Page>
    );
};
