import type { FC } from 'react';

import { themeParams } from '@telegram-apps/sdk-react';
import { LargeTitle, Subheadline } from '@telegram-apps/telegram-ui';

export const TopText: FC = () => {
    return (
        <div className="flex flex-col gap-1.5 mt-2 pt-7 pb-7 text-center">
            <Subheadline
                level="1"
                weight="3"
                style={{
                    color: 'var(--tgui--hint_color)',
                }}
            >
                Дней до сессии
            </Subheadline>

            <LargeTitle
                weight="2"
                style={{ fontSize: 43, textAlign: 'center', letterSpacing: '0.0em'}}
            >
                <span style={{
                    color: `var(--tgui--hint_color)`
                }}>≈</span>107
            </LargeTitle>
        </div>
    );
};
