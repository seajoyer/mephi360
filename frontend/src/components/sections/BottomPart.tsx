import React from 'react';
import { SearchPanel } from '@/components/layout/SearchPanel';
import { SectionContent } from '@/components/sections/SectionContent';
import { Navigation } from '@/components/layout/Navigation';

interface BottomPartProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const BottomPart: React.FC<BottomPartProps> = ({ activeSection, onSectionChange }) => {
    return (
        <>
            <Navigation
                activeSection={activeSection}
                onSectionChange={onSectionChange}
            />
            <SearchPanel />
            <SectionContent
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                className="flex-1"
            />
        </>
    );
};
