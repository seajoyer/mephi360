import { useState, useCallback } from 'react';

interface UseSectionTransitionProps {
    sections: Array<{ id: string }>;
    initialSection: string;
}

export const useSectionTransition = ({
    sections,
    initialSection,
}: UseSectionTransitionProps) => {
    const [activeSection, setActiveSection] = useState(initialSection);

    const handleSectionChange = useCallback((newSection: string) => {
        if (newSection === activeSection) return;
        setActiveSection(newSection);
    }, [activeSection]);

    return {
        activeSection,
        handleSectionChange
    };
};
