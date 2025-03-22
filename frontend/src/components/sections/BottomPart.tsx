import React, { useState } from 'react';
import { SearchPanel } from '@/components/layout/SearchPanel';
import { SectionContent } from '@/components/sections/SectionContent';
import { Navigation } from '@/components/layout/Navigation';

interface BottomPartProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const BottomPart: React.FC<BottomPartProps> = ({ activeSection, onSectionChange }) => {
    // State for the selected institute
    const [activeInstitute, setActiveInstitute] = useState<string | null>(null);

    return (
        <div
            className='px-1'
        >
            <Navigation
                activeSection={activeSection}
                onSectionChange={onSectionChange}
            />
            <SearchPanel
                activeSection={activeSection}
                activeInstitute={activeSection === 'stuff' ? activeInstitute : null}
                onInstituteChange={setActiveInstitute}
            />
            <SectionContent
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                className="flex-1"
                activeInstitute={activeSection === 'stuff' ? activeInstitute : null}
            />
        </div>
    );
};
