import React from 'react';
import { TutorsList } from '@/components/list/TutorsList';
import { ClubsList } from '@/components/list/ClubsList';
import { StuffList } from '@/components/list/StuffList';
import { DepartmentList } from '@/components/list/DepartmentList';
import { useFilters } from '@/contexts/FilterContext';

interface SectionContentProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    className?: string;
    activeInstitute?: string | null;
}

export const SectionContent: React.FC<SectionContentProps> = ({
    activeSection,
    className = '',
    activeInstitute = null
}) => {
    // Use filter context to get active filters
    const { infoFilters, clubsFilters, stuffFilters } = useFilters();

    // Using animation classes for smooth transitions
    const getDisplayClass = (section: string) => {
        return activeSection === section
            ? 'block animate-fadeIn'
            : 'hidden';
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Info section (Tutors or Departments) */}
            <div
                className={`h-full ${getDisplayClass('info')}`}
                data-section="info"
            >
                {infoFilters.entityType === 'tutors' ? (
                    <TutorsList searchQuery={infoFilters.search} departmentFilter={infoFilters.department} />
                ) : (
                    <DepartmentList searchQuery={infoFilters.search} />
                )}
            </div>

            {/* Clubs section */}
            <div
                className={`h-full ${getDisplayClass('clubs')}`}
                data-section="clubs"
            >
                <ClubsList
                    searchQuery={clubsFilters.search}
                    organizerFilter={clubsFilters.organizer}
                    subjectFilter={clubsFilters.subject}
                />
            </div>

            {/* Stuff section */}
            <div
                className={`h-full ${getDisplayClass('stuff')}`}
                data-section="stuff"
            >
                <StuffList
                    searchQuery={stuffFilters.search}
                    typeFilter={stuffFilters.type}
                    teacherFilter={stuffFilters.teacher}
                    subjectFilter={stuffFilters.subject}
                    semesterFilter={stuffFilters.semester}
                    activeInstitute={activeInstitute}
                />
            </div>
        </div>
    );
};
