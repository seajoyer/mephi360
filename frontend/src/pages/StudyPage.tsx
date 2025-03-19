import React, { useState } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page';
import { TopPart } from '@/components/sections/TopPart';
import { BottomPart } from '@/components/sections/BottomPart';

export const StudyPage: FC = () => {
    // Tracking active section
    const [activeSection, setActiveSection] = useState<string>('tutors');

    // Handle section changes
    const handleSectionChange = (newSection: string) => {
        if (newSection === activeSection) return;
        setActiveSection(newSection);
    };

    return (
        <Page back={false}>
            <div>
                {/* List wrapper handles consistent styling */}
                <div className='p-2'>
                    {/* Top section with navigation buttons */}
                    <div>
                        <TopPart />
                    </div>

                    {/* Bottom section with search and content */}
                    <BottomPart
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                    />
                </div>
            </div>
        </Page>
    );
};
