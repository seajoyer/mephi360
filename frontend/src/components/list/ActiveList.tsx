import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Badge, Cell, Section } from '@telegram-apps/telegram-ui';
import { getActivities } from '@/services/apiService';
import { Icon16Person } from '@/icons/16/person';

// Types
interface Activity {
    id: number;
    title: string;
    description: string;
    memberCount: number;
    telegramLink: string;
    type: string;
}

interface ActiveListProps {
    searchQuery?: string;
}

// Loading skeleton component
const ActiveBannerSkeleton: React.FC = () => (
    <div className="p-4 animate-pulse">
        <div className="flex-1">
            <div className="h-4.5 rounded w-55 mb-3.5 mt-0.75"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
            <div className="h-3.5 rounded w-full"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
            <div className="h-3.5 rounded w-full mt-2.5"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
            <div className="h-3.5 rounded w-3/4 mt-2.5"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
        </div>
        <div className="mt-3.75 flex items-center">
            <div className="h-5 rounded-lg w-24"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
        </div>
    </div>
);

const LoadingState: React.FC = () => (
    <>
        {Array.from({ length: 5 }).map((_, index) => (
            <Section key={`skeleton-${index}`} className="mb-3">
                <ActiveBannerSkeleton />
            </Section>
        ))}
    </>
);

export const ActiveList: React.FC<ActiveListProps> = ({
    searchQuery = ''
}) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    // Load activities function
    const loadMoreActivities = useCallback(async () => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setIsLoading(true);

        try {
            const response = await getActivities({
                search: searchQuery,
                cursor: cursor || undefined,
                limit: 12
            });

            if (response.items.length > 0) {
                setActivities(prev => [...prev, ...response.items]);
                setCursor(response.nextCursor);
                setHasMore(!!response.nextCursor);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading activities');
            console.error(err);
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }, [cursor, hasMore, error, searchQuery]);

    // Reset list when search query changes
    useEffect(() => {
        setActivities([]);
        setCursor(null);
        setHasMore(true);
        setError(null);
        loadingRef.current = false;
    }, [searchQuery]);

    // Initial load
    useEffect(() => {
        if (activities.length === 0 && !error) {
            loadMoreActivities();
        }
    }, [loadMoreActivities, error, activities.length]);

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
                loadMoreActivities();
            }
        }, options);

        observerRef.current = observer;

        return () => observer.disconnect();
    }, [loadMoreActivities, hasMore]);

    // Observe load trigger element
    useEffect(() => {
        const observer = observerRef.current;
        const trigger = loadTriggerRef.current;

        if (observer && trigger) {
            observer.observe(trigger);
            return () => observer.unobserve(trigger);
        }
    }, [activities]);

    // Error state
    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
                <button
                    className="block mx-auto mt-2 p-2 bg-gray-200 rounded"
                    onClick={() => {
                        setError(null);
                        loadMoreActivities();
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
                {activities.map((activity) => (
                    <div key={activity.id}>
                        <Section className='mb-3'>
                            <Cell
                                description={activity.description}
                                titleBadge={
                                    <Badge
                                        type='number'
                                        mode='gray'
                                    >
                                        <div className='flex'>
                                            <Icon16Person
                                                style={{
                                                    marginRight: '4px',
                                                }}
                                            />
                                            {activity.memberCount}
                                        </div>
                                    </Badge>
                                }
                                multiline
                            >
                                <span style={{color: 'var(--tgui--accent_text_color)'}}>
                                    {activity.title}
                                </span>
                            </Cell>
                        </Section>
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
                {isLoading && activities.length === 0 && (
                    <div className='-mt-4'>
                        <LoadingState />
                    </div>
                )}

                {/* Show loading indicator when loading more */}
                {isLoading && activities.length > 0 && (
                    <div className="py-4 text-center">
                        <div className="inline-block h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty state when no results */}
                {!isLoading && activities.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Сообщества не найдены</p>
                        <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска</p>
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && activities.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        Больше сообществ нет
                    </div>
                )}
            </div>
        </div>
    );
};
