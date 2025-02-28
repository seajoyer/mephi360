import React from 'react';
import type { FC } from 'react';

import { TopNavigation } from '@/components/layout/TopNavigation';
import { TopButtons } from '@/components/layout/TopButtons';
import { TopText } from '@/components/layout/TopText';

interface TopPartProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const TopPart: FC<TopPartProps> = ({ activeSection, onSectionChange }) => {
    return (
        <>
            <TopButtons />
            <TopText />
            <TopNavigation
                activeSection={activeSection}
                onSectionChange={onSectionChange}
            />
        </>
    );
};
