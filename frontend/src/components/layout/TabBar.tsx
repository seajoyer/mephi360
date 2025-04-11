import { useNavigate, useLocation } from 'react-router-dom';
import type { FC } from 'react';
import { FixedLayout } from '@telegram-apps/telegram-ui';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { Icon24Folder } from '@/icons/24/folder';
import { Icon24Globe } from '@/icons/24/globe';
import { Icon24Lifebuoy } from '@/icons/24/lifebuoy';
import { Icon24Lightning_alt } from '@/icons/24/lightning_alt';

export const TabBar: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1] || 'wiki';

    const tabs = [
        {
            id: 'wiki',
            path: '/wiki',
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
            path: '/circles',
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
            path: '/active',
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
            path: '/stuff',
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

    const handleTabClick = (tabId: string, path: string) => {
        // Pass special state to indicate this is TabBar navigation (to skip transitions)
        navigate(path, { state: { skipTransition: true } });
    };

    return (
        <FixedLayout vertical="bottom" style={{ zIndex: 10 }}>
            <Tabbar
                style={{
                    backgroundColor: 'var(--tgui--secondary_bg_color)'
                }}
            >
                {tabs.map(({ id, path, icon }) => (
                    <Tabbar.Item
                        key={id}
                        selected={id === currentPath}
                        onClick={() => handleTabClick(id, path)}
                    >
                        {icon}
                    </Tabbar.Item>
                ))}
            </Tabbar>
        </FixedLayout>
    );
};
