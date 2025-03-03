import React, { useState, useEffect, useRef } from 'react';
import { InlineButtons } from '@telegram-apps/telegram-ui';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';
import { Icon24Heart } from '@/icons/24/heart';
import { Icon24Largegroup } from '@/icons/24/largegroup';
import { Icon24Folder } from '@/icons/24/folder';

export const SECTIONS = [
    { id: 'tutors', text: 'Преподы', icon: Icon24Heart, mode: 'bezeled' },
    { id: 'clubs', text: 'Кружки', icon: Icon24Largegroup, mode: 'gray' },
    { id: 'stuff', text: 'Материалы', icon: Icon24Folder, mode: 'gray' }
] as const;

interface NavigationProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
    activeSection,
    onSectionChange
}) => {
    const [isSticky, setIsSticky] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const navPositionRef = useRef<number | null>(null);

    useEffect(() => {
        if (!navRef.current) return;

        const storeInitialPosition = () => {
            if (!navRef.current || navPositionRef.current !== null) return;
            const rect = navRef.current.getBoundingClientRect();
            navPositionRef.current = rect.top + window.scrollY;
        };

        storeInitialPosition();

        const checkStickyState = () => {
            if (!navRef.current || navPositionRef.current === null) return;
            // Use a small offset to account for the sticky top-0 behavior
            const isCurrentlySticky = window.scrollY > (navPositionRef.current - 1);
            if (isSticky !== isCurrentlySticky) {
                setIsSticky(isCurrentlySticky);
            }
        };

        // Ensure we have the initial position
        setTimeout(storeInitialPosition, 100);

        // Set up event listeners
        checkStickyState(); // Initial check
        window.addEventListener('scroll', checkStickyState, { passive: true });
        window.addEventListener('resize', storeInitialPosition, { passive: true });

        return () => {
            window.removeEventListener('scroll', checkStickyState);
            window.removeEventListener('resize', storeInitialPosition);
        };
    }, [isSticky]);

    return (
        <div
            ref={navRef}
            className={`sticky top-0 z-10 pt-2 pb-1 transition-all duration-200`}
            style={{ backgroundColor: 'var(--tgui--secondary_bg_color)'}}
        >
            {/* Navigation buttons */}
            <InlineButtons>
                {SECTIONS.map(({ id, text, icon: Icon }) => (
                    <InlineButtonsItem
                        key={id}
                        text={!isSticky ? text : text}
                        mode={activeSection === id ? 'bezeled' : 'plain'}
                        onClick={() => onSectionChange(id)}
                    >
                        <Icon />
                    </InlineButtonsItem>
                ))}
            </InlineButtons>
        </div>
    );
};
