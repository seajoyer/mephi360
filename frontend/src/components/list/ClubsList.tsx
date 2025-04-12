import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Cell, Image, Divider } from '@telegram-apps/telegram-ui';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon24Group } from '@/icons/24/group';
import { Link } from '@/components/common/Link';
import { getClubs } from '@/services/apiService';
import { Club } from '@/types/club';

interface ClubsListProps {
    searchQuery?: string;
}

// Loading skeleton component
const ClubCellSkeleton: React.FC = () => (
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
                <ClubCellSkeleton />
                {index < 4 && <Divider />}
            </React.Fragment>
        ))}
    </>
);

export const ClubsList: React.FC<ClubsListProps> = ({
    searchQuery = ''
}) => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    // Load clubs from the dedicated clubs API
    const loadMoreClubs = useCallback(async () => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setIsLoading(true);

        try {
            const response = await getClubs({
                search: searchQuery,
                cursor: cursor || undefined,
                limit: 20
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
    }, [cursor, hasMore, error, searchQuery]);

    // Reset when search query changes
    useEffect(() => {
        setClubs([]);
        setCursor(null);
        setHasMore(true);
        setError(null);
        loadingRef.current = false;
    }, [searchQuery]);

    // Initial load
    useEffect(() => {
        if (clubs.length === 0 && !error) {
            loadMoreClubs();
        }
    }, [loadMoreClubs, error, clubs.length]);

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
            {clubs.map((club, index) => (
                <div key={club.id}>
                    <Link to={club.link}>
                        <Cell
                            before={
                                <Image
                                    size={40}
                                    src={`/assets/circles/circle${club.id % 5 + 1}.jpg`}
                                    fallbackIcon={<span><Icon24Group /></span>}
                                />
                            }
                            after={
                                <Icon16Chevron_right
                                    style={{ color: 'var(--tgui--hint_color)' }}
                                />
                            }
                            description={club.description}
                        >
                            {club.name}
                        </Cell>
                    </Link>
                    {index < clubs.length - 1 && <Divider />}
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
                    <p className="text-gray-500">Клубы не найдены</p>
                    <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска</p>
                </div>
            )}

            {/* End of list message */}
            {!hasMore && clubs.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                    Больше клубов нет
                </div>
            )}
        </div>
    );
};
