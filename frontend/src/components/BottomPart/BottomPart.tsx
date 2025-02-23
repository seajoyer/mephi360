import React, { forwardRef } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import { SearchPanel } from '@/components/SearchPanel';
import { NavigationButtons } from './NavigationButtons';
import { SectionContent } from './SectionContent';

interface BottomPartProps {
    searchPanelRef: React.RefObject<HTMLDivElement>;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const BottomPart = forwardRef<HTMLDivElement, BottomPartProps>(
    ({ searchPanelRef, activeSection, onSectionChange }, ref) => {
        return (
            <div ref={ref} className="w-full h-full">
                <List className="h-full flex flex-col">
                    <NavigationButtons
                        activeSection={activeSection}
                        onSectionChange={onSectionChange}
                    />
                    <SearchPanel ref={searchPanelRef} />
                    <SectionContent
                        activeSection={activeSection}
                        className="flex-1"
                    />
                </List>
            </div>
        );
    }
);

BottomPart.displayName = 'BottomPart';
