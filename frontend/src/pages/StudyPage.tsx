import React, { useRef, useState } from 'react';
import type { FC } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { TopPart } from '@/components/sections/TopPart';
import { BottomPart } from '@/components/sections/BottomPart';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';

export const StudyPage: FC = () => {
    const searchPanelRef = useRef<HTMLDivElement>(null);

    // Track search panel visibility to show/hide bottom navigation
    const showBottomNavigation = useScrollVisibility({
        ref: searchPanelRef,
        threshold: 8
    });

    // Tracking active section
    const [activeSection, setActiveSection] = useState<string>('tutors');

    // Handle section changes
    const handleSectionChange = (newSection: string) => {
        if (newSection === activeSection) return;
        setActiveSection(newSection);
    };

    return (
        <Page back={false}>
            <div className={showBottomNavigation ? 'pb-14' : ''}>
                {/* List wrapper handles consistent styling */}
                <List>
                    {/* Top section with navigation buttons */}
                    <TopPart
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                    />

                    {/* Bottom section with search and content */}
                    <BottomPart
                        searchPanelRef={searchPanelRef}
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                    />
                </List>
            </div>

            {/* Bottom tabbar with shadow */}
            <BottomNavigation
                className={`transition-all duration-300 ease-in-out z-50
                    ${!showBottomNavigation && 'translate-y-12 pointer-events-none'}`}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />
        </Page>
    );
};
