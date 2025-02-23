import React from 'react';
import { TutorsList } from '@/components/TutorsList';
import { ClubsList } from '@/components/ClubsList';
import { StuffList } from '@/components/StuffList';

interface SectionContentProps {
    activeSection: string;
    className?: string;
}

export const SectionContent: React.FC<SectionContentProps> = ({
    activeSection,
    className
}) => {
    return (
        <div className={`w-full ${className}`}>
            <div
                style={{ display: activeSection === 'tutors' ? 'block' : 'none' }}
                className="h-full"
            >
                <TutorsList />
            </div>
            <div
                style={{ display: activeSection === 'clubs' ? 'block' : 'none' }}
                className="h-full"
            >
                <ClubsList />
            </div>
            <div
                style={{ display: activeSection === 'stuff' ? 'block' : 'none' }}
                className="h-full"
            >
                <StuffList />
            </div>
        </div>
    );
};
