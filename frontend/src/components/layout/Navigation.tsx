import React from 'react';
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
    return (
        <div className="sticky top-2 z-20">
            {/* Background overlay */}
            <div
                className="absolute inset-x-0 -top-2 -bottom-2"
                style={{ backgroundColor: 'var(--tgui--secondary_bg_color)' }}
            />

            {/* Navigation buttons */}
            <div className="relative">
                <InlineButtons>
                    {SECTIONS.map(({ id, text, icon: Icon }) => (
                        <InlineButtonsItem
                            key={id}
                            text={text}
                            mode={activeSection === id ? 'bezeled' : 'gray'}
                            onClick={() => onSectionChange(id)}
                        >
                            <Icon />
                        </InlineButtonsItem>
                    ))}
                </InlineButtons>
            </div>
        </div>
    );
};
