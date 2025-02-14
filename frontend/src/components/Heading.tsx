import type { FC } from 'react';

import { List, Section } from '@telegram-apps/telegram-ui';

import { TopControl } from '@/components/TopControl';
import { InfoText } from '@/components/InfoText';

/* import { Link } from '@/components/Link/Link.tsx'; */

export const Heading: FC = () => {
    return (
        <>
            <TopControl />
            <InfoText />
        </>
    );
};
