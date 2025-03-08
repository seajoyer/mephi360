import React, { useState } from 'react';
import { SearchPanel } from '@/components/layout/SearchPanel';
import { SectionContent } from '@/components/sections/SectionContent';
import { Navigation } from '@/components/layout/Navigation';
import { InstitutesPanel } from '@/components/layout/InstitutesPanel';

interface BottomPartProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const BottomPart: React.FC<BottomPartProps> = ({ activeSection, onSectionChange }) => {
    // State for the selected institute
    const [activeInstitute, setActiveInstitute] = useState<string | null>(null);

    return (
        <>
            <Navigation
                activeSection={activeSection}
                onSectionChange={onSectionChange}
            />
            {activeSection === 'stuff' && (
                <InstitutesPanel
                    activeInstitute={activeInstitute}
                    onInstituteChange={setActiveInstitute}
                />
            )}
            <SearchPanel activeSection={activeSection} />
            <SectionContent
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                className="flex-1"
                // Pass the activeInstitute to SectionContent when in stuff section
                activeInstitute={activeSection === 'stuff' ? activeInstitute : null}
            />
        </>
    );
};
