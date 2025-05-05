import React from 'react';
import type { FC } from 'react';
import { Placeholder } from '@telegram-apps/telegram-ui';
import { openLink } from '@telegram-apps/sdk-react';

export const NoAccess: FC = () => {
    return (
        <Placeholder
            header="В разработке..."
            description={
                <>
                    Чтобы пощупать интерфейс, напишите мне{' '}
                    <span
                        onClick={() => openLink('https://t.me/seajoyer')}
                        style={{
                            color: 'var(--tgui--link_color)',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        @seajoyer
                    </span>
                </>
            }
        >
            <img
                alt="Telegram sticker"
                src="https://telegra.ph/file/db914ce03059dca6e2e02.gif"
                style={{ display: 'block', width: '144px', height: '144px' }}
            />
        </Placeholder>
    );
};
