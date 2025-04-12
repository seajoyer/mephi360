import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import type { FC } from 'react';
import { FixedLayout } from '@telegram-apps/telegram-ui';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { viewport } from '@telegram-apps/sdk-react';

// Regular icons
import { Icon28Folder } from '@/icons/28/folder';
import { Icon28Globe } from '@/icons/28/globe';
import { Icon28Lifebuoy } from '@/icons/28/lifebuoy';
import { Icon28Lightning } from '@/icons/28/lightning';

// Filled variants for selected state
import { Icon28Folder_fill } from '@/icons/28/folder_fill';
import { Icon28Globe_fill } from '@/icons/28/globe_fill';
import { Icon28Lifebuoy_fill } from '@/icons/28/lifebuoy_fill';
import { Icon28Lightning_fill } from '@/icons/28/lightning_fill';

export const TabBar: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1] || 'wiki';
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const prevHeightRef = useRef<number>(window.innerHeight);

    useEffect(() => {
        // Function to detect keyboard visibility
        const checkKeyboardVisibility = () => {
            // Get the current viewport height
            const currentHeight = window.innerHeight;

            // If viewport height significantly decreased (by more than 20%),
            // we assume keyboard is open
            const heightDifference = prevHeightRef.current - currentHeight;
            const heightChangePercent = (heightDifference / prevHeightRef.current) * 100;

            if (heightChangePercent > 20) {
                setIsKeyboardVisible(true);
            } else {
                setIsKeyboardVisible(false);
            }
        };

        // Store initial viewport height on first render
        prevHeightRef.current = window.innerHeight;

        // Check for Telegram viewport events if available
        if (viewport && viewport.isStable && viewport.isStable.subscribe) {
            const unsubscribe = viewport.isStable.subscribe(isStable => {
                if (isStable) {
                    checkKeyboardVisibility();
                }
            });
            return unsubscribe;
        } else {
            // Fallback to window resize event
            window.addEventListener('resize', checkKeyboardVisibility);
            return () => {
                window.removeEventListener('resize', checkKeyboardVisibility);
            };
        }
    }, []);

    // Used to prevent layout shifts during transitions
    useEffect(() => {
        // Add a class to the body when keyboard is visible
        if (isKeyboardVisible) {
            document.body.classList.add('keyboard-visible');
        } else {
            document.body.classList.remove('keyboard-visible');
        }
    }, [isKeyboardVisible]);

    const tabs = [
        {
            id: 'wiki',
            path: '/wiki',
            label: "Wiki",
            regularIcon: Icon28Globe,
            filledIcon: Icon28Globe_fill
        },
        {
            id: 'circles',
            path: '/circles',
            label: "Кружки",
            regularIcon: Icon28Lifebuoy,
            filledIcon: Icon28Lifebuoy_fill
        },
        {
            id: 'active',
            path: '/active',
            label: "Движ",
            regularIcon: Icon28Lightning,
            filledIcon: Icon28Lightning_fill
        },
        {
            id: 'stuff',
            path: '/stuff',
            label: "Материалы",
            regularIcon: Icon28Folder,
            filledIcon: Icon28Folder_fill
        },
    ];

    const handleTabClick = (path: string) => {
        navigate(path);
    };

    // Don't render the TabBar if keyboard is visible
    if (isKeyboardVisible) {
        return null;
    }

    return (
        <FixedLayout vertical="bottom" style={{ zIndex: 10 }}>
            <Tabbar
                style={{
                    backgroundColor: 'var(--tgui--secondary_bg_color)'
                }}
            >
                {tabs.map(({ id, path, label, regularIcon: RegularIcon, filledIcon: FilledIcon }) => {
                    const isSelected = id === currentPath;
                    const IconComponent = isSelected ? FilledIcon : RegularIcon;

                    return (
                        <Tabbar.Item
                            key={id}
                            selected={isSelected}
                            text={label}
                            onClick={() => handleTabClick(path)}
                        >
                            <div className="mb-0 min-h-6">
                                <IconComponent />
                            </div>
                        </Tabbar.Item>
                    );
                })}
            </Tabbar>
        </FixedLayout>
    );
};
