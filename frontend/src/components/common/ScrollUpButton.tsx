import React, { useState, useEffect, useCallback } from 'react';
import { Button, FixedLayout, IconButton } from '@telegram-apps/telegram-ui';
import { Icon32Chevron_up } from '@/icons/32/chevron_up';
import { Icon24Chevron_up } from '@/icons/24/chevron_up';

interface ScrollUpButtonProps {
    scrollThreshold?: number; // Scroll position in pixels when the button should appear
    bottomOffset?: number;    // Distance from the bottom of the screen in pixels
}

export const ScrollUpButton: React.FC<ScrollUpButtonProps> = ({
    scrollThreshold = 400,
    bottomOffset = 67
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = useCallback(() => {
        const currentScrollPos = window.scrollY;
        const shouldBeVisible = currentScrollPos > scrollThreshold;

        if (isVisible !== shouldBeVisible) {
            setIsVisible(shouldBeVisible);
        }
    }, [scrollThreshold, isVisible]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <FixedLayout vertical="bottom" style={{ pointerEvents: 'none', zIndex: 5 }}>
            <div
                className={`flex justify-end pr-3.5 transition-all duration-150 ease-in-out`}
                style={{
                    paddingBottom: `calc(${bottomOffset}px + var(--tgui--safe_area_inset_bottom, 0px))`,
                    transform: `translateY(${isVisible ? '0' : '100px'})`,
                    opacity: isVisible ? 1 : 0,
                }}
            >
                <IconButton
                    mode="gray"
                    size="m"
                    onClick={scrollToTop}
                    className="shadow-md"
                    style={{
                        backgroundColor: 'var(--tgui--secondary_bg_color)',
                        pointerEvents: 'auto',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon24Chevron_up style={{
                    }} />
                </IconButton>
            </div>
        </FixedLayout>
    );
};
