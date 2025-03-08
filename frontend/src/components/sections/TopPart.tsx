import React from 'react';
import type { FC } from 'react';

import { TopButtons } from '@/components/layout/TopButtons';
import { TopText } from '@/components/layout/TopText';
import { Section } from '@telegram-apps/telegram-ui';

export const TopPart: FC = () => {
    return (
        <>
            <TopButtons />
            <TopText />
        </>
    );
};
