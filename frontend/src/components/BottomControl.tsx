import type { FC } from 'react';
import { FixedLayout } from '@telegram-apps/telegram-ui';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { Icon24Heart } from '@/icons/24/heart';
import { Icon24Largegroup } from '@/icons/24/largegroup';
import { Icon24Folder } from '@/icons/24/folder';

interface BottomControlProps {
    className?: string;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const BottomControl: FC<BottomControlProps> = ({
    className = '',
    activeSection,
    onSectionChange
}) => {
    const tabs = [
        {
            id: 'tutors',
            icon: (
                <div className="flex flex-col items-center">
                    <div className="mb-0 min-h-6">
                        <Icon24Heart />
                    </div>
                    <span className="text-xs -mt-0">{"Преподы"}</span>
                </div>
            )
        },
        {
            id: 'clubs',
            icon: (
                <div className="flex flex-col items-center">
                    <div className="mb-0 min-h-6">
                        <Icon24Largegroup />
                    </div>
                    <span className="text-xs -mt-0">{"Кружки"}</span>
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
                    <span className="text-xs -mt-0">{"Материалы"}</span>
                </div>
            )
        },
    ];

    return (
        <div className={`transition-all duration-200 ease-in-out ${className}`}>
            <FixedLayout vertical="bottom">
                <Tabbar>
                    {tabs.map(({ id, icon }) => (
                        <Tabbar.Item
                            key={id}
                            selected={id === activeSection}
                            onClick={() => onSectionChange(id)}
                        >
                            {icon}
                        </Tabbar.Item>
                    ))}
                </Tabbar>
            </FixedLayout>
        </div>
    );
};
