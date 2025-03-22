import React, { useState } from 'react';
import { SearchPanel } from '@/components/layout/SearchPanel';
import { SectionContent } from '@/components/sections/SectionContent';
import { Navigation } from '@/components/layout/Navigation';
import { useFilters } from '@/contexts/FilterContext';

interface BottomPartProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const BottomPart: React.FC<BottomPartProps> = ({ activeSection, onSectionChange }) => {
    // State for the selected institute (for stuff section)
    const [activeInstitute, setActiveInstitute] = useState<string | null>(null);

    // Access filter context
    const { stuffFilters, setStuffInstitute } = useFilters();

    // Handler for institute change
    const handleInstituteChange = (institute: string | null) => {
        setActiveInstitute(institute);
        setStuffInstitute(institute);
    };

    return (
        <>
            <Navigation
                activeSection={activeSection}
                onSectionChange={onSectionChange}
            />
            <SearchPanel
                activeSection={activeSection}
                activeInstitute={activeSection === 'stuff' ? activeInstitute : null}
                onInstituteChange={handleInstituteChange}
            />
            <SectionContent
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                className="flex-1"
                activeInstitute={activeSection === 'stuff' ? activeInstitute : null}
            />
        </>
    );
};
