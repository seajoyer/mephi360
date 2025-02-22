import { useEffect, RefObject, useState } from 'react';

interface UseScrollVisibilityProps {
    ref: RefObject<HTMLElement>;
    threshold?: number;
}

export const useScrollVisibility = ({ ref, threshold = 8 }: UseScrollVisibilityProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const containerRect = ref.current.getBoundingClientRect();
                setIsVisible(containerRect.top <= threshold);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref, threshold]);

    return isVisible;
};
