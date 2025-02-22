import React from 'react';
import { TutorsList } from '@/components/TutorsList';
import { ClubsList } from '@/components/ClubsList';
import { StuffList } from '@/components/StuffList';

interface SectionContentProps {
    activeSection: string;
    slideDirection: string;
    isAnimating: boolean;
}

export const SectionContent: React.FC<SectionContentProps> = ({
    activeSection,
    slideDirection,
    isAnimating
}) => {
    const renderContent = () => {
        switch (activeSection) {
            case 'tutors':
                return <TutorsList />;
            case 'clubs':
                return <ClubsList />;
            case 'stuff':
                return <StuffList />;
            default:
                return null;
        }
    };

    return (
        <div className="relative overflow-hidden w-full">
            <div
                className={`transform transition-transform duration-300 ease-in-out w-full
                    ${isAnimating ?
                        (slideDirection === 'left' ? '-translate-x-full' : 'translate-x-full')
                        : 'translate-x-0'}`}
            >
                {renderContent()}
            </div>
        </div>
    );
};
