import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section } from '@telegram-apps/telegram-ui';
import { ClubBanner } from '@/components/layout/ClubBanner';
import { getClubs } from '@/services/apiService';
import { useFilters } from '@/contexts/FilterContext';

// Types
interface Club {
    id: number;
    name: string;
    description: string;
    image: string;
    tags: string[];
    memberCount: number;
    department: string;
    subject: string;
    organizer: string;
}

interface ClubsListProps {
    searchQuery?: string;
    organizerFilter?: string | null;
    subjectFilter?: string | null;
}

// Loading skeleton component
const ClubBannerSkeleton: React.FC = () => (
    <div className="p-4 animate-pulse">
        <div className="flex items-start justify-between">
            <div className="flex-1 pr-3">
                <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
    </div>
);

const LoadingState: React.FC = () => (
    <>
        {Array.from({ length: 3 }).map((_, index) => (
            <Section key={`skeleton-${index}`} className="mb-2">
                <ClubBannerSkeleton />
            </Section>
        ))}
    </>
);

export const ClubsList: React.FC<ClubsListProps> = ({
    searchQuery = '',
    organizerFilter = null,
    subjectFilter = null
}) => {
    // Access filter context to get and update filters
    const { setClubOrganizer, setClubSubject } = useFilters();

    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    // Load clubs function with filters
    const loadMoreClubs = useCallback(async () => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setIsLoading(true);

        try {
            const response = await getClubs({
                search: searchQuery,
                organizer: organizerFilter || undefined,
                subject: subjectFilter || undefined,
                cursor: cursor || undefined,
                limit: 12
            });

            if (response.items.length > 0) {
                setClubs(prev => [...prev, ...response.items]);
                setCursor(response.nextCursor);
                setHasMore(!!response.nextCursor);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading clubs');
            console.error(err);
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }, [cursor, hasMore, error, searchQuery, organizerFilter, subjectFilter]);

    // Reset list when filters change
    useEffect(() => {
        setClubs([]);
        setCursor(null);
        setHasMore(true);
        setError(null);
        loadingRef.current = false;
    }, [searchQuery, organizerFilter, subjectFilter]);

    // Initial load
    useEffect(() => {
        if (clubs.length === 0 && !error) {
            loadMoreClubs();
        }
    }, [loadMoreClubs, error, clubs.length]);

    // Set up Intersection Observer for infinite scroll
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !loadingRef.current && hasMore) {
                loadMoreClubs();
            }
        }, options);

        observerRef.current = observer;

        return () => observer.disconnect();
    }, [loadMoreClubs, hasMore]);

    // Observe load trigger element
    useEffect(() => {
        const observer = observerRef.current;
        const trigger = loadTriggerRef.current;

        if (observer && trigger) {
            observer.observe(trigger);
            return () => observer.unobserve(trigger);
        }
    }, [clubs]);

    // Handle tag click to set filter
    const handleTagClick = (tag: string) => {
        // Determine if this tag is a subject or organizer
        const isSubject = clubs.some(club => club.subject === tag);
        const isOrganizer = clubs.some(club => club.organizer === tag);

        if (isSubject) {
            setClubSubject(tag);
        } else if (isOrganizer) {
            setClubOrganizer(tag);
        }
    };

    // Filter tags to only show those that aren't already applied as filters
    const filterVisibleTags = (tags: string[]) => {
        return tags.filter(tag =>
            (subjectFilter && tag === subjectFilter) ||
            (organizerFilter && tag === organizerFilter) ? false : true
        );
    };

    // Error state
    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
                <button
                    className="block mx-auto mt-2 p-2 bg-gray-200 rounded"
                    onClick={() => {
                        setError(null);
                        loadMoreClubs();
                    }}
                >
                    Повторить
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
            <div className="space-y-3">
                {clubs.map((club) => (
                    <div key={club.id}>
                        <ClubBanner
                            title={club.name}
                            description={club.description}
                            imageSrc={club.image}
                            tags={filterVisibleTags(club.tags)}
                            buttonText="Подробнее"
                            onTagClick={handleTagClick}
                            onNavigate={() => {
                                // In a real app, navigate to club page
                                console.log(`Navigate to club ${club.id}`);
                            }}
                        />
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
                {isLoading && clubs.length === 0 && <LoadingState />}

                {/* Show loading indicator when loading more */}
                {isLoading && clubs.length > 0 && (
                    <div className="py-4 text-center">
                        <div className="inline-block h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty state when no results */}
                {!isLoading && clubs.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Кружки не найдены</p>
                        <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска</p>
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && clubs.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        Все кружки загружены
                    </div>
                )}
            </div>
        </div>
    );
};
