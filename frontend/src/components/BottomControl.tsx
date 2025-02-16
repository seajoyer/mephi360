import { useNavigate } from 'react-router-dom';
import { FixedLayout } from '@telegram-apps/telegram-ui';

import { Icon24Heart } from '@/../assets/icons/24/heart';
import { Icon24Lifebuoy } from '@/../assets/icons/24/lifebuoy';
import { Icon24Folder } from '@/../assets/icons/24/folder';

import { useLocation } from "react-router-dom";
import { Tabbar } from '@telegram-apps/telegram-ui';

import type { FC } from 'react';

interface BottomControlProps {
    className?: string;
}

export const BottomControl: FC<BottomControlProps> = ({ className = '' }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        {
            id: 'tutors-tab', path: '/',
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
            id: 'clubs-tab', path: '/clubs',
            icon: (
                <div className="flex flex-col items-center">
                    <div className="mb-0 min-h-6">
                        <Icon24Lifebuoy />
                    </div>
                    <span className="text-xs -mt-0">{"Кружки"}</span>
                </div>
            )
        },
        {
            id: 'materials-tab', path: '/materials',
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
                    {tabs.map(({ id, path, icon }) => (
                        <Tabbar.Item
                            key={id}
                            selected={path === location.pathname}
                            onClick={() => navigate(path)}
                        >
                            {icon}
                        </Tabbar.Item>
                    ))}
                </Tabbar>
            </FixedLayout>
        </div>
    );
};
