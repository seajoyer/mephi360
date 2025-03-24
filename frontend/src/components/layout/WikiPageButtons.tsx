import React from 'react';
import { InlineButtons } from '@telegram-apps/telegram-ui';
import { Icon24Plus } from '@/icons/24/plus';
import { Icon24Search } from '@/icons/24/search';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';

export const SECTIONS = [
    { id: 'add', text: 'Дополнить', icon: Icon24Plus},
    { id: 'search', text: 'Найти', icon: Icon24Search},
] as const;

export const WikiPageButtons: React.FC = () => {
    const handleButtonClick = (id: string) => {
        if (id === 'add') {
            console.log('Add content clicked');
            // Implement add content functionality
        } else if (id === 'search') {
            console.log('Search clicked');
            // Implement search functionality
        }
    };

    return (
        <div
            className="pt-2"
            style={{ backgroundColor: 'var(--tgui--secondary_bg_color)'}}
        >
            <InlineButtons>
                {SECTIONS.map(({ id, text, icon: Icon }) => (
                    <InlineButtonsItem
                        key={id}
                        text={text}
                        mode={'plain'}
                        onClick={() => handleButtonClick(id)}
                    >
                        <Icon />
                    </InlineButtonsItem>
                ))}
            </InlineButtons>
        </div>
    );
};
