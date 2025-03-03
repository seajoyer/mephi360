import { useState, useEffect, useRef, RefObject } from 'react';

export const useSticky = (stickyOffset: number): [boolean, RefObject<HTMLDivElement>] => {
    const [isSticky, setIsSticky] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const initialPositionRef = useRef<number | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const storeInitialPosition = () => {
            if (!ref.current || initialPositionRef.current !== null) return;
            const rect = ref.current.getBoundingClientRect();
            initialPositionRef.current = rect.top + window.scrollY;
        };

        storeInitialPosition();

        const checkStickyState = () => {
            if (!ref.current || initialPositionRef.current === null) return;
            const isCurrentlySticky = window.scrollY > (initialPositionRef.current - stickyOffset - 1);
            if (isSticky !== isCurrentlySticky) {
                setIsSticky(isCurrentlySticky);
            }
        };

        setTimeout(storeInitialPosition, 100);

        checkStickyState();
        window.addEventListener('scroll', checkStickyState, { passive: true });
        window.addEventListener('resize', storeInitialPosition, { passive: true });

        return () => {
            window.removeEventListener('scroll', checkStickyState);
            window.removeEventListener('resize', storeInitialPosition);
        };
    }, [isSticky, stickyOffset]);

    return [isSticky, ref];
};
