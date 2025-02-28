import React, { forwardRef } from 'react';
import { SearchPanel } from '@/components/layout/SearchPanel';
import { SectionContent } from '@/components/sections/SectionContent';

interface BottomPartProps {
    searchPanelRef: React.RefObject<HTMLDivElement>;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const BottomPart = forwardRef<HTMLDivElement, BottomPartProps>(
    ({ searchPanelRef, activeSection, onSectionChange }) => {
        return (
            <>
                <SearchPanel ref={searchPanelRef} />
                <SectionContent
                    activeSection={activeSection}
                    onSectionChange={onSectionChange}
                    className="flex-1"
                />
            </>
        );
    }
);

BottomPart.displayName = 'BottomPart';
