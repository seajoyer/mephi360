import React, { useState, useEffect, useRef } from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
    minBottomSpace?: number; // Minimum space to maintain at bottom in pixels
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    minBottomSpace = 300 // Default minimum space
}) => {
    // Reference to the content container
    const containerRef = useRef<HTMLDivElement>(null);

    // State to track current viewport height
    const [viewportHeight, setViewportHeight] = useState<number>(
        typeof window !== 'undefined' ? window.innerHeight : 0
    );

    // Function to update viewport height measurement
    const updateViewportHeight = () => {
        setViewportHeight(window.innerHeight);
    };

    // Set up resize listener
    useEffect(() => {
        // Initialize viewport height
        updateViewportHeight();

        // Listen for resize events
        window.addEventListener('resize', updateViewportHeight);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateViewportHeight);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: `${viewportHeight + minBottomSpace}px`,
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}
        >
            {/* Main content area */}
            <div className="flex-1">
                {children}
            </div>

            {/* Flexible spacer */}
            <div
                style={{
                    height: `${minBottomSpace}px`,
                    flexShrink: 0
                }}
                aria-hidden="true"
            />
        </div>
    );
};
