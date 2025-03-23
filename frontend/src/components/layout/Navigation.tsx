import React from 'react';
import { InlineButtons } from '@telegram-apps/telegram-ui';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';
import { Icon24Largegroup } from '@/icons/24/largegroup';
import { Icon24Folder } from '@/icons/24/folder';
import { Icon24Lightbulb } from '@/icons/24/lightbulb';
import { Icon24Plus } from '@/icons/24/plus';
import { Icon24Edit } from '@/icons/24/edit';

export const SECTIONS = [
    { id: 'add', text: 'Дополнить', icon: Icon24Plus, mode: 'bezeled' },
    { id: 'edit', text: 'Править', icon: Icon24Edit, mode: 'gray' },
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
        <div
            className="pt-2"
            style={{ backgroundColor: 'var(--tgui--secondary_bg_color)'}}
        >
            {/* Navigation buttons */}
            <InlineButtons>
                {SECTIONS.map(({ id, text, icon: Icon }) => (
                    <InlineButtonsItem
                        key={id}
                        text={text}
                        mode={'plain'}
                        onClick={() => onSectionChange(id)}
                    >
                        <Icon />
                    </InlineButtonsItem>
                ))}
            </InlineButtons>
        </div>
    );
};
