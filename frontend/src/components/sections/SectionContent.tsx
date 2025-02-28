import React from 'react';
import { TutorsList } from '@/components/list/TutorsList';
import { ClubsList } from '@/components/list/ClubsList';
import { StuffList } from '@/components/list/StuffList';

interface SectionContentProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    className?: string;
}

export const SectionContent: React.FC<SectionContentProps> = ({
    activeSection,
    className = ''
}) => {
    // Using animation classes for smooth transitions
    const getDisplayClass = (section: string) => {
        return activeSection === section
            ? 'block animate-fadeIn'
            : 'hidden';
    };

    return (
        <div className={`w-full ${className}`}>
            <div
                className={`h-full ${getDisplayClass('tutors')}`}
                data-section="tutors"
            >
                <TutorsList />
            </div>
            <div
                className={`h-full ${getDisplayClass('clubs')}`}
                data-section="clubs"
            >
                <ClubsList />
            </div>
            <div
                className={`h-full ${getDisplayClass('stuff')}`}
                data-section="stuff"
            >
                <StuffList />
            </div>
        </div>
    );
};
