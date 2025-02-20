import { InlineButtons } from '@telegram-apps/telegram-ui';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';

import { Icon24Heart } from '@/icons/24/heart';
import { Icon24Largegroup } from '@/icons/24/largegroup';
import { Icon24Folder } from '@/icons/24/folder';

import type { FC } from 'react';

export const NavigationButtons: FC = () => {
    return (
        <InlineButtons>
            <InlineButtonsItem
                text="Преподы"
                mode="bezeled"
            >
                <Icon24Heart />
            </InlineButtonsItem>
            <InlineButtonsItem
                text="Кружки"
                mode="gray"
            >
                <Icon24Largegroup />
            </InlineButtonsItem>
            <InlineButtonsItem
                text="Материалы"
                mode="gray"
            >
                <Icon24Folder />
            </InlineButtonsItem>
        </InlineButtons>
    );
};
