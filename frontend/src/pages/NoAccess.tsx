import React from 'react';
import type { FC } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';

export const NoAccess: FC = () => {
    return (
        <Placeholder
            header="В разработке..."
            // description="В разработке"
        >
            <img
                alt="Telegram sticker"
                src="https://telegra.ph/file/db914ce03059dca6e2e02.gif"
                style={{ display: 'block', width: '144px', height: '144px' }}
            />
        </Placeholder>
    );
};
