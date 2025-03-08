import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section } from '@telegram-apps/telegram-ui';
import { ClubBanner } from '@/components/layout/ClubBanner';

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

const ITEMS_PER_PAGE = 5;

// Mock data generator
const generateMockClubs = (): Club[] => {
    const clubTypes = [
        'Математический',
        'Программирования',
        'Робототехники',
        'Дизайна',
        'Киберспорта',
        'Астрономии',
        'Физики',
        'Химии',
        'Биологии',
        'Лингвистики'
    ];

    const subjects = [
        'Математика',
        'Информатика',
        'Инженерия',
        'Искусство',
        'Киберспорт',
        'Астрономия',
        'Физика',
        'Химия',
        'Биология',
        'Лингвистика'
    ];

    const organizers = [
        'Студенческий совет',
        'Научное сообщество',
        'Кафедра информатики',
        'Кафедра физики',
        'Кафедра математики',
        'Спортивный клуб',
        'Иностранные языки',
        'Творческий центр',
        'Робототехника',
        'Молодежный центр'
    ];

    return Array.from({ length: 30 }, (_, index) => {
        const clubType = clubTypes[index % clubTypes.length];
        const subject = subjects[index % subjects.length];
        const organizer = organizers[Math.floor(index / 3) % organizers.length];

        // Create tags that match the filter values in ClubsFilters
        const tags = [subject, organizer];

        // Create a more detailed description
        const description = `${clubType} кружок для студентов интересующихся ${clubType.toLowerCase()} наукой. Еженедельные занятия, совместные проекты и участие в конференциях. Присоединяйтесь к нашему сообществу и развивайте свои навыки вместе с нами!`;

        return {
            id: index + 1,
            name: `Кружок "${clubType}"`,
            description,
            image: `/assets/clubs/club${(index % 5) + 1}.jpg`,
            tags: tags,
            memberCount: Math.floor(Math.random() * 80) + 20,
            subject,
            organizer
        };
    });
};

// Create a cache object to store loaded sections
const sectionsCache: Record<string, Club[]> = {};

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

export const ClubsList: React.FC = () => {
    // Lazy load clubs data
    const allClubs = useRef<Club[]>([]);

    // Get cached data if available
    const cachedData = sectionsCache['clubs'] || [];
    const [displayedClubs, setDisplayedClubs] = useState<Club[]>(cachedData);
    const [isLoading, setIsLoading] = useState(cachedData.length === 0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    // Initialize clubs data if not already loaded
    useEffect(() => {
        if (allClubs.current.length === 0) {
            try {
                // In a real app, you'd fetch from an API here
                allClubs.current = generateMockClubs();
            } catch (err) {
                setError('Failed to load clubs data');
                console.error(err);
            }
        }
    }, []);

    const loadMoreClubs = useCallback(() => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            try {
                const startIndex = displayedClubs.length;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const nextItems = allClubs.current.slice(startIndex, endIndex);

                if (nextItems.length > 0) {
                    const newClubs = [...displayedClubs, ...nextItems];
                    setDisplayedClubs(newClubs);

                    // Update cache
                    sectionsCache['clubs'] = newClubs;
                    setHasMore(endIndex < allClubs.current.length);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                setError('Error loading more clubs');
                console.error(err);
            } finally {
                setIsLoading(false);
                loadingRef.current = false;
            }
        }, displayedClubs.length > 0 ? 300 : 800); // Add delay for better UX
    }, [displayedClubs.length, hasMore, displayedClubs, error]);

    // Initial load only if no cached data
    useEffect(() => {
        if (displayedClubs.length === 0 && !error) {
            loadMoreClubs();
        }
    }, [loadMoreClubs, error]);

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
    }, [displayedClubs]);

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
                {displayedClubs.map((club) => (
                    <div key={club.id}>
                        <ClubBanner
                            title={club.name}
                            description={club.description}
                            imageSrc={club.image}
                            tags={club.tags}
                            buttonText="Подробнее"
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
                {isLoading && displayedClubs.length === 0 && <LoadingState />}

                {/* Show loading indicator when loading more */}
                {isLoading && displayedClubs.length > 0 && (
                    <div className="py-4 text-center">
                        <div className="inline-block h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && displayedClubs.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        Все кружки загружены
                    </div>
                )}
            </div>
        </div>
    );
};
