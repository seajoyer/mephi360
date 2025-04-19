import { useState, useEffect, useRef } from 'react';
import { viewport } from '@telegram-apps/sdk-react';

export const useKeyboardVisibility = () => {
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

    return isKeyboardVisible;
};
