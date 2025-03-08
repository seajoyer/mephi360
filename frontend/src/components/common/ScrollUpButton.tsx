import React, { useState, useEffect, useCallback } from 'react';
import { Button, FixedLayout } from '@telegram-apps/telegram-ui';
import { Icon32Chevron_up } from '@/icons/32/chevron_up';

interface ScrollUpButtonProps {
    scrollThreshold?: number; // Scroll position in pixels when the button should appear
    bottomOffset?: number;    // Distance from the bottom of the screen in pixels
}

export const ScrollUpButton: React.FC<ScrollUpButtonProps> = ({
    scrollThreshold = 400,
    bottomOffset = 17
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
        <FixedLayout vertical="bottom">
            <div
                className={`flex justify-end pr-4.25 transition-all duration-300 ease-in-out`}
                style={{
                    paddingBottom: `calc(${bottomOffset}px + var(--tgui--safe_area_inset_bottom, 0px))`,
                    transform: `translateY(${isVisible ? '0' : '100px'})`,
                    opacity: isVisible ? 1 : 0,
                    pointerEvents: isVisible ? 'auto' : 'none'
                }}
            >
                <Button
                    mode="gray"
                    size="m"
                    onClick={scrollToTop}
                    className="shadow-md"
                    style={{
                        borderRadius: '50%',
                        width: '54px',
                        height: '54px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon32Chevron_up style={{
                        marginLeft: '-2.5px',
                        marginBottom: '1px'
                    }} />
                </Button>
            </div>
        </FixedLayout>
    );
};
