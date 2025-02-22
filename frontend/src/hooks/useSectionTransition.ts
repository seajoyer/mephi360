import { useState, useCallback } from 'react';

interface UseSectionTransitionProps {
    sections: Array<{ id: string }>;
    initialSection: string;
    transitionDuration?: number;
}

export const useSectionTransition = ({
    sections,
    initialSection,
    transitionDuration = 300
}: UseSectionTransitionProps) => {
    const [activeSection, setActiveSection] = useState(initialSection);
    const [slideDirection, setSlideDirection] = useState('right');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSectionChange = useCallback((newSection: string) => {
        if (newSection === activeSection || isAnimating) return;

        const currentIndex = sections.findIndex(section => section.id === activeSection);
        const newIndex = sections.findIndex(section => section.id === newSection);

        setSlideDirection(newIndex > currentIndex ? 'left' : 'right');
        setIsAnimating(true);
        setActiveSection(newSection);

        setTimeout(() => {
            setIsAnimating(false);
        }, transitionDuration);
    }, [activeSection, isAnimating, sections, transitionDuration]);

    return {
        activeSection,
        slideDirection,
        isAnimating,
        handleSectionChange
    };
};
