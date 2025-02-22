import React, { forwardRef } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import { SearchPanel } from '@/components/SearchPanel';
import { NavigationButtons, SECTIONS } from './NavigationButtons';
import { SectionContent } from './SectionContent';
import { useSectionTransition } from '@/hooks/useSectionTransition';

interface BottomPartProps {
    searchPanelRef: React.RefObject<HTMLDivElement>;
}

export const BottomPart = forwardRef<HTMLDivElement, BottomPartProps>(
    ({ searchPanelRef }, ref) => {
        const {
            activeSection,
            slideDirection,
            isAnimating,
            handleSectionChange
        } = useSectionTransition({
            sections: SECTIONS,
            initialSection: 'tutors'
        });

        return (
            <div ref={ref} className="w-full">
                <List>
                    <NavigationButtons
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                    />
                    <SearchPanel ref={searchPanelRef} />
                    <SectionContent
                        activeSection={activeSection}
                        slideDirection={slideDirection}
                        isAnimating={isAnimating}
                    />
                </List>
            </div>
        );
    }
);

BottomPart.displayName = 'BottomPart';
