import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section } from '@telegram-apps/telegram-ui';
import { StuffBanner } from '@/components/layout/StuffBanner';
import { getMaterials } from '@/services/apiService';
import { useFilters } from '@/contexts/FilterContext';

// Types
interface StudyMaterial {
    id: number;
    title: string;
    description: string;
    tags: string[];
    telegramLink: string;
    type: string;
    semester: string;
    teacher: string;
    institute: string;
    subject: string;
}

interface StuffListProps {
    searchQuery?: string;
    typeFilter?: string | null;
    teacherFilter?: string | null;
    subjectFilter?: string | null;
    semesterFilter?: string | null;
    activeInstitute?: string | null;
}

// Loading skeleton component
const StuffBannerSkeleton: React.FC = () => (
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
        <div className="mt-3.75 flex flex-wrap gap-2">
            <div className="h-9 rounded-lg w-11.25"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
            <div className="h-9 rounded-lg w-19"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
            <div className="h-9 rounded-lg w-22"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
            <div className="h-9 rounded-lg w-16.75"
                 style={{ backgroundColor: 'var(--tgui--quartenary_bg_color)' }}></div>
        </div>
    </div>
);

const LoadingState: React.FC = () => (
    <>
        {Array.from({ length: 5 }).map((_, index) => (
            <Section key={`skeleton-${index}`} className="mb-3">
                <StuffBannerSkeleton />
            </Section>
        ))}
    </>
);

export const StuffList: React.FC<StuffListProps> = ({
    searchQuery = '',
    typeFilter = null,
    teacherFilter = null,
    subjectFilter = null,
    semesterFilter = null,
    activeInstitute = null
}) => {
    // Access filter context to get and update filters
    const { setStuffType, setStuffTeacher, setStuffSubject, setStuffSemester } = useFilters();

    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    // Load study materials with filters
    const loadMoreMaterials = useCallback(async () => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setIsLoading(true);

        try {
            const response = await getMaterials({
                search: searchQuery,
                type: typeFilter || undefined,
                teacher: teacherFilter || undefined,
                subject: subjectFilter || undefined,
                semester: semesterFilter || undefined,
                institute: activeInstitute || undefined,
                cursor: cursor || undefined,
                limit: 12
            });

            if (response.items.length > 0) {
                setMaterials(prev => [...prev, ...response.items]);
                setCursor(response.nextCursor);
                setHasMore(!!response.nextCursor);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading materials');
            console.error(err);
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }, [
        cursor,
        hasMore,
        error,
        searchQuery,
        typeFilter,
        teacherFilter,
        subjectFilter,
        semesterFilter,
        activeInstitute
    ]);

    // Reset list when filters change
    useEffect(() => {
        setMaterials([]);
        setCursor(null);
        setHasMore(true);
        setError(null);
        loadingRef.current = false;
    }, [
        searchQuery,
        typeFilter,
        teacherFilter,
        subjectFilter,
        semesterFilter,
        activeInstitute
    ]);

    // Initial load
    useEffect(() => {
        if (materials.length === 0 && !error) {
            loadMoreMaterials();
        }
    }, [loadMoreMaterials, error, materials.length]);

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
                loadMoreMaterials();
            }
        }, options);

        observerRef.current = observer;

        return () => observer.disconnect();
    }, [loadMoreMaterials, hasMore]);

    // Observe load trigger element
    useEffect(() => {
        const observer = observerRef.current;
        const trigger = loadTriggerRef.current;

        if (observer && trigger) {
            observer.observe(trigger);
            return () => observer.unobserve(trigger);
        }
    }, [materials]);

    // Handle tag click to set filter
    const handleTagClick = (tag: string) => {
        // Determine what kind of tag was clicked
        const matchingMaterial = materials.find(mat =>
            mat.type === tag ||
            mat.teacher === tag ||
            mat.subject === tag ||
            mat.semester === tag
        );

        if (!matchingMaterial) return;

        if (matchingMaterial.type === tag) {
            setStuffType(tag);
        } else if (matchingMaterial.teacher === tag) {
            setStuffTeacher(tag);
        } else if (matchingMaterial.subject === tag) {
            setStuffSubject(tag);
        } else if (matchingMaterial.semester === tag) {
            setStuffSemester(tag);
        }
    };

    // Filter visible tags to only show those that aren't already applied
    const filterVisibleTags = (tags: string[]) => {
        return tags.filter(tag =>
            (typeFilter && tag === typeFilter) ||
            (teacherFilter && tag === teacherFilter) ||
            (subjectFilter && tag === subjectFilter) ||
            (semesterFilter && tag === semesterFilter) ? false : true
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
                        loadMoreMaterials();
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
                {materials.map((material) => (
                    <div key={material.id}>
                        <StuffBanner
                            title={material.title}
                            description={material.description}
                            tags={filterVisibleTags(material.tags)}
                            telegramLink={material.telegramLink}
                            onTagClick={handleTagClick}
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
                {isLoading && materials.length === 0 && (
                    <div className='-mt-4'>
                        <LoadingState />
                    </div>
                )}

                {/* Show loading indicator when loading more */}
                {isLoading && materials.length > 0 && (
                    <div className="py-4 text-center">
                        <div className="inline-block h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* Empty state when no results */}
                {!isLoading && materials.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Материалы не найдены</p>
                        <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры поиска</p>
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && materials.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        Все материалы загружены
                    </div>
                )}
            </div>
        </div>
    );
};
