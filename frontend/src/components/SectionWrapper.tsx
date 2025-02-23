import React, { useRef, useEffect } from 'react';
import { useScrollPosition } from '@/hooks/useScrollPosition';

interface SectionWrapperProps {
    sectionId: string;
    isActive: boolean;
    searchPanelRef: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
    sectionId,
    isActive,
    searchPanelRef,
    children
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useScrollPosition({
        sectionId,
        searchPanelRef,
        isActive
    });

    useEffect(() => {
        if (containerRef.current && isActive) {
            const containerHeight = window.innerHeight;
            containerRef.current.style.minHeight = `${containerHeight}px`;
        }
    }, [isActive]);

    return (
        <div
            ref={containerRef}
            className={`w-full transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            style={{
                position: isActive ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: isActive ? 'auto' : 'none'
            }}
        >
            {children}
        </div>
    );
};
