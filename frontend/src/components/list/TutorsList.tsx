import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section, Cell, Avatar, Divider } from '@telegram-apps/telegram-ui';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';
import { Link } from '@/components/common/Link';

// Types
interface Tutor {
    id: number;
    name: string;
    department: string;
    imageFileName: string;
}

const ITEMS_PER_PAGE = 20;

// Mock data - replace with your actual API call in production
const generateMockTutors = (): Tutor[] => {
    return Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        name: `Tutor ${index + 1}`,
        department: `Department ${Math.floor(index / 10) + 1}`,
        imageFileName: 'default.jpg'
    }));
};

// Create a cache object to store loaded sections
const sectionsCache: Record<string, Tutor[]> = {};

// Loading skeleton component
const TutorCellSkeleton: React.FC = () => (
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
        {Array.from({ length: 5 }).map((_, index) => (
            <React.Fragment key={`skeleton-${index}`}>
                <TutorCellSkeleton />
                {index < 2 && <Divider />}
            </React.Fragment>
        ))}
    </>
);

export const TutorsList: React.FC = () => {
    // Lazy load tutors data
    const allTutors = useRef<Tutor[]>([]);

    // Get cached data if available
    const cachedData = sectionsCache['tutors'] || [];
    const [displayedTutors, setDisplayedTutors] = useState<Tutor[]>(cachedData);
    const [isLoading, setIsLoading] = useState(cachedData.length === 0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    // Initialize tutors data if not already loaded
    useEffect(() => {
        if (allTutors.current.length === 0) {
            try {
                // In a real app, you'd fetch from an API here
                allTutors.current = generateMockTutors();
            } catch (err) {
                setError('Failed to load tutors data');
                console.error(err);
            }
        }
    }, []);

    const loadMoreTutors = useCallback(() => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            try {
                const startIndex = displayedTutors.length;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const nextItems = allTutors.current.slice(startIndex, endIndex);

                if (nextItems.length > 0) {
                    const newTutors = [...displayedTutors, ...nextItems];
                    setDisplayedTutors(newTutors);

                    // Update cache
                    sectionsCache['tutors'] = newTutors;
                    setHasMore(endIndex < allTutors.current.length);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                setError('Error loading more tutors');
                console.error(err);
            } finally {
                setIsLoading(false);
                loadingRef.current = false;
            }
        }, displayedTutors.length > 0 ? 0 : 500); // Only add delay for initial load when no cache
    }, [displayedTutors.length, hasMore, displayedTutors, error]);

    // Initial load only if no cached data
    useEffect(() => {
        if (displayedTutors.length === 0 && !error) {
            loadMoreTutors();
        }
    }, [loadMoreTutors, error]);

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
                loadMoreTutors();
            }
        }, options);

        observerRef.current = observer;

        return () => observer.disconnect();
    }, [loadMoreTutors, hasMore]);

    // Observe load trigger element
    useEffect(() => {
        const observer = observerRef.current;
        const trigger = loadTriggerRef.current;

        if (observer && trigger) {
            observer.observe(trigger);
            return () => observer.unobserve(trigger);
        }
    }, [displayedTutors]);

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
                <button
                    className="block mx-auto mt-2 p-2 bg-gray-200 rounded"
                    onClick={() => {
                        setError(null);
                        loadMoreTutors();
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
                {displayedTutors.map((tutor, index) => (
                    <div key={tutor.id}>
                        <Link to={`/tutor/${tutor.id}`}>
                            <Cell
                                before={
                                    <Avatar
                                        size={40}
                                        src={`/assets/tutors/${tutor.imageFileName}`}
                                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                                    />
                                }
                                after={
                                    <Icon16Chevron_right
                                        style={{color: 'var(--tg-theme-link-color)'}}
                                    />
                                }
                                description={tutor.department}
                            >
                                {tutor.name}
                            </Cell>
                        </Link>
                        {index < displayedTutors.length - 1 && <Divider />}
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
                {isLoading && displayedTutors.length === 0 && <LoadingState />}

                {/* Show loading indicator when loading more */}
                {isLoading && displayedTutors.length > 0 && (
                    <div className="py-4 text-center">
                        <div className="inline-block h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && displayedTutors.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No more tutors to load
                    </div>
                )}
            </Section>
        </div>
    );
};
