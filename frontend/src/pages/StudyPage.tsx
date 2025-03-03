import React, { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { TopPart } from '@/components/sections/TopPart';
import { BottomPart } from '@/components/sections/BottomPart';

export const StudyPage: FC = () => {
    // Tracking active section
    const [activeSection, setActiveSection] = useState<string>('tutors');

    // Ref for the div wrapping TopPart
    const topPartContainerRef = useRef<HTMLDivElement>(null);
    const topPartHeightRef = useRef<number | null>(null);

    // Calculate Top Part height
    useEffect(() => {
        const updateTopPartHeight = () => {
            if (topPartContainerRef.current) {
                topPartHeightRef.current = topPartContainerRef.current.getBoundingClientRect().height;
            }
        };

        // Initial measurement
        updateTopPartHeight();

        // Update on resize
        window.addEventListener('resize', updateTopPartHeight);

        return () => {
            window.removeEventListener('resize', updateTopPartHeight);
        };
    }, []);

    // Handle section changes
    const handleSectionChange = (newSection: string) => {
        if (newSection === activeSection) return;

        // Check if Navigation is sticky (scrolled past Top Part)
        if (topPartHeightRef.current && window.scrollY > topPartHeightRef.current) {
            // The List wrapper adds 8px gap, so we need to adjust our scroll calculation
            // to target the exact boundary of the Navigation buttons
            const navigationTopBoundary = topPartHeightRef.current + 14;

            // Reset scroll to the top boundary of Navigation buttons
            window.scrollTo({
                top: navigationTopBoundary,
                behavior: 'auto' // Instant scroll without animation
            });
        }

        setActiveSection(newSection);
    };

    return (
        <Page back={false}>
            <div>
                {/* List wrapper handles consistent styling */}
                <List>
                    {/* Top section with navigation buttons */}
                    <div ref={topPartContainerRef}>
                        <TopPart />
                    </div>
                </List>

                    {/* Bottom section with search and content */}
                    <BottomPart
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                    />
            </div>
        </Page>
    );
};
