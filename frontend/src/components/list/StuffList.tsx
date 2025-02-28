import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section, Cell, Avatar, Divider } from '@telegram-apps/telegram-ui';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';
import { Link } from '@/components/common/Link';

// Types
interface Stuff {
    id: number;
    name: string;
    department: string;
    imageFileName: string;
}

const ITEMS_PER_PAGE = 20;

// Mock data - replace with your actual API call in production
const generateMockStuffs = (): Stuff[] => {
    return Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: `Stuff ${index + 1}`,
        department: `Department ${Math.floor(index / 10) + 1}`,
        imageFileName: 'default.jpg'
    }));
};

// Create a cache object to store loaded sections
const sectionsCache: Record<string, Stuff[]> = {};

// Loading skeleton component
const StuffCellSkeleton: React.FC = () => (
    <div className="flex items-center p-4 w-full">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="ml-3 flex-1">
            <div className="h-5 bg-gray-200 rounded w-32 mb-1 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
    </div>
);

const LoadingState: React.FC = () => (
    <>
        {Array.from({ length: 3 }).map((_, index) => (
            <React.Fragment key={`skeleton-${index}`}>
                <StuffCellSkeleton />
                {index < 2 && <Divider />}
            </React.Fragment>
        ))}
    </>
);

export const StuffList: React.FC = () => {
    // Lazy load stuffs data
    const allStuffs = useRef<Stuff[]>([]);

    // Get cached data if available
    const cachedData = sectionsCache['stuffs'] || [];
    const [displayedStuffs, setDisplayedStuffs] = useState<Stuff[]>(cachedData);
    const [isLoading, setIsLoading] = useState(cachedData.length === 0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    // Initialize stuffs data if not already loaded
    useEffect(() => {
        if (allStuffs.current.length === 0) {
            try {
                // In a real app, you'd fetch from an API here
                allStuffs.current = generateMockStuffs();
            } catch (err) {
                setError('Failed to load stuffs data');
                console.error(err);
            }
        }
    }, []);

    const loadMoreStuffs = useCallback(() => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            try {
                const startIndex = displayedStuffs.length;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const nextItems = allStuffs.current.slice(startIndex, endIndex);

                if (nextItems.length > 0) {
                    const newStuffs = [...displayedStuffs, ...nextItems];
                    setDisplayedStuffs(newStuffs);

                    // Update cache
                    sectionsCache['stuffs'] = newStuffs;
                    setHasMore(endIndex < allStuffs.current.length);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                setError('Error loading more stuffs');
                console.error(err);
            } finally {
                setIsLoading(false);
                loadingRef.current = false;
            }
        }, displayedStuffs.length > 0 ? 0 : 500); // Only add delay for initial load when no cache
    }, [displayedStuffs.length, hasMore, displayedStuffs, error]);

    // Initial load only if no cached data
    useEffect(() => {
        if (displayedStuffs.length === 0 && !error) {
            loadMoreStuffs();
        }
    }, [loadMoreStuffs, error]);

    // Set up Intersection Observer
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !loadingRef.current && hasMore) {
                loadMoreStuffs();
            }
        }, options);

        observerRef.current = observer;

        return () => observer.disconnect();
    }, [loadMoreStuffs, hasMore]);

    // Observe load trigger element
    useEffect(() => {
        const observer = observerRef.current;
        const trigger = loadTriggerRef.current;

        if (observer && trigger) {
            observer.observe(trigger);
            return () => observer.unobserve(trigger);
        }
    }, [displayedStuffs]);

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
                <button
                    className="block mx-auto mt-2 p-2 bg-gray-200 rounded"
                    onClick={() => {
                        setError(null);
                        loadMoreStuffs();
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto"
            style={{
                WebkitOverflowScrolling: 'touch'
            }}
        >
            <Section>
                {displayedStuffs.map((stuff, index) => (
                    <div key={stuff.id}>
                        <Link to={`/stuff/${stuff.id}`}>
                            <Cell
                                before={
                                    <Avatar
                                        size={40}
                                        src={`/assets/stuffs/${stuff.imageFileName}`}
                                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                                    />
                                }
                                after={
                                    <Icon16Chevron_right
                                        style={{color: 'var(--tg-theme-link-color)'}}
                                    />
                                }
                                description={stuff.department}
                            >
                                {stuff.name}
                            </Cell>
                        </Link>
                        {index < displayedStuffs.length - 1 && <Divider />}
                    </div>
                ))}

                {/* Invisible element to trigger loading more items */}
                {hasMore && (
                    <div
                        ref={loadTriggerRef}
                        className="h-1 opacity-0"
                        aria-hidden="true"
                    />
                )}

                {/* Show loading state when initially loading */}
                {isLoading && displayedStuffs.length === 0 && <LoadingState />}

                {/* Show loading indicator when loading more */}
                {isLoading && displayedStuffs.length > 0 && (
                    <div className="py-4 text-center">
                        <div className="inline-block h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && displayedStuffs.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No more stuffs to load
                    </div>
                )}
            </Section>
        </div>
    );
};
