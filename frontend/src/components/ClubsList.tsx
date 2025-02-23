import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section, Cell, Avatar, Divider } from '@telegram-apps/telegram-ui';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';
import { Link } from '@/components/Link/Link';

interface Tutor {
    id: number;
    name: string;
    department: string;
    imageFileName: string;
}

// Mock data - replace with your actual data or API call
const allTutors: Tutor[] = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Club ${index + 1}`,
    department: `Department ${Math.floor(index / 10) + 1}`,
    imageFileName: 'default.jpg'
}));

const ITEMS_PER_PAGE = 20;

// Create a cache object to store loaded sections
const sectionsCache: Record<string, Tutor[]> = {};

const TutorCellSkeleton = () => (
    <div className="flex items-center p-4 w-full">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="ml-3 flex-1">
            <div className="h-5 bg-gray-200 rounded w-32 mb-1 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
    </div>
);

const LoadingState = () => (
    <>
        {[...Array(3)].map((_, index) => (
            <React.Fragment key={`skeleton-${index}`}>
                <TutorCellSkeleton />
                {index < 2 && <Divider />}
            </React.Fragment>
        ))}
    </>
);

export const ClubsList: React.FC = () => {
    // Get cached data if available
    const cachedData = sectionsCache['tutors'] || [];
    const [displayedTutors, setDisplayedTutors] = useState<Tutor[]>(cachedData);
    const [isLoading, setIsLoading] = useState(cachedData.length === 0);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    const loadMoreTutors = useCallback(() => {
        if (loadingRef.current || !hasMore) return;

        loadingRef.current = true;
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const startIndex = displayedTutors.length;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const nextItems = allTutors.slice(startIndex, endIndex);

            if (nextItems.length > 0) {
                const newTutors = [...displayedTutors, ...nextItems];
                setDisplayedTutors(newTutors);
                // Update cache
                sectionsCache['tutors'] = newTutors;
                setHasMore(endIndex < allTutors.length);
            } else {
                setHasMore(false);
            }

            setIsLoading(false);
            loadingRef.current = false;
        }, displayedTutors.length > 0 ? 0 : 500); // Only add delay for initial load when no cache
    }, [displayedTutors.length, hasMore, displayedTutors]);

    // Initial load only if no cached data
    useEffect(() => {
        if (displayedTutors.length === 0) {
            loadMoreTutors();
        }
    }, [loadMoreTutors]);

    // Set up Intersection Observer
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
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

                {hasMore && (
                    <div
                        ref={loadTriggerRef}
                        className="relative"
                        style={{
                            height: '1px',
                            opacity: 0
                        }}
                    />
                )}

                {isLoading && displayedTutors.length === 0 && <LoadingState />}

                {!hasMore && displayedTutors.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No more tutors to load
                    </div>
                )}
            </Section>
        </div>
    );
};
