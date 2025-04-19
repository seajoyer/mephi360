import React, { useState, useEffect } from 'react';
import { FixedLayout, type FixedLayoutProps } from '@telegram-apps/telegram-ui';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';

export const KeyboardAwareFixedLayout: React.FC<React.PropsWithChildren<FixedLayoutProps>> = ({ children, ...props }) => {
    const isKeyboardVisible = useKeyboardVisibility();
    const [isReady, setIsReady] = useState(false);

    // Delay rendering until after initial layout calculation is complete
    useEffect(() => {
        // Use requestAnimationFrame to ensure we're in the next paint cycle
        const timeoutId = setTimeout(() => {
            setIsReady(true);
        }, 100); // Small delay to ensure document layout is stable

        return () => clearTimeout(timeoutId);
    }, []);

    // Don't render anything when keyboard is visible
    if (isKeyboardVisible || !isReady) {
        return null;
    }

    return <FixedLayout {...props}>{children}</FixedLayout>;
};
