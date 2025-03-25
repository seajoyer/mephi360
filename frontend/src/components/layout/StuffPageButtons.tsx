import React from 'react';
import { InlineButtons } from '@telegram-apps/telegram-ui';
import { Icon24Plus } from '@/icons/24/plus';
import { Icon24Chat } from '@/icons/24/chat';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';

export const SECTIONS = [
    { id: 'add', text: 'Добавить', icon: Icon24Plus },
    { id: 'requests', text: 'Запросы', icon: Icon24Chat },
] as const;

export const StuffPageButtons: React.FC = () => {
    const handleButtonClick = (id: string) => {
        if (id === 'add') {
            console.log('Add content clicked');
            // Implement add content functionality
        } else if (id === 'requests') {
            console.log('Requests clicked');
            // Implement requests functionality
        }
    };

    return (
        <div
            className="pt-2"
            style={{ backgroundColor: 'var(--tgui--secondary_bg_color)' }}
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
