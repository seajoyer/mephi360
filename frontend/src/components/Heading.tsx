import type { FC } from 'react';

import { TopControl } from '@/components/TopControl';
import { InfoText } from '@/components/InfoText';

export const Heading: FC = () => {
    return (
        <>
            <TopControl />
            <InfoText />
        </>
    );
};
