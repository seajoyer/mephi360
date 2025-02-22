import type { FC } from 'react';

import { TopControl } from '@/components/TopControl';
import { InfoText } from '@/components/InfoText';

export const TopPart: FC = () => {
    return (
        <>
            <TopControl />
            <InfoText />
        </>
    );
};
