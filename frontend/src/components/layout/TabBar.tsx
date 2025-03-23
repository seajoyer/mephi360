import type { FC } from 'react';
import { FixedLayout } from '@telegram-apps/telegram-ui';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { Icon24Heart } from '@/icons/24/heart';
import { Icon24Largegroup } from '@/icons/24/largegroup';
import { Icon24Folder } from '@/icons/24/folder';
import { Icon24Globe } from '@/icons/24/globe';
import { Icon24Lifebuoy } from '@/icons/24/lifebuoy';
import { Icon24Lightbulb } from '@/icons/24/lightbulb';
import { Icon24Lightning } from '@/icons/24/lightning';
import { Icon24Lightning_alt } from '@/icons/24/lightning_alt';

interface TabBarProps {
    className?: string;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const TabBar: FC<TabBarProps> = ({
    className = '',
    activeSection,
    onSectionChange
}) => {
    const tabs = [
        {
            id: 'wiki',
            icon: (
                <div className="flex flex-col items-center">
                    <div className="mb-0 min-h-6">
                        <Icon24Globe />
                    </div>
                    <span className="text-xs">{"Wiki"}</span>
                </div>
            )
        },
        {
            id: 'circles',
            icon: (
                <div className="flex flex-col items-center">
                    <div className="mb-0 min-h-6">
                        <Icon24Lifebuoy />
                    </div>
                    <span className="text-xs">{"Кружки"}</span>
                </div>
            )
        },
        {
            id: 'active',
            icon: (
                <div className="flex flex-col items-center">
                    <div className="mb-0 min-h-6">
                        <Icon24Lightning_alt />
                    </div>
                    <span className="text-xs">{"Движ"}</span>
                </div>
            )
        },
        {
            id: 'stuff',
            icon: (
                <div className="flex flex-col items-center">
                    <div className="mb-0 min-h-6">
                        <Icon24Folder />
                    </div>
                    <span className="text-xs">{"Материалы"}</span>
                </div>
            )
        },
    ];

    return (
        <FixedLayout vertical="bottom" className={`${className}`}>
            <Tabbar>
                {tabs.map(({ id, icon }) => (
                    <Tabbar.Item
                        key={id}
                        selected={id === 'wiki'}
                        onClick={() => onSectionChange(id)}
                    >
                        {icon}
                    </Tabbar.Item>
                ))}
            </Tabbar>
        </FixedLayout>
    );
};
