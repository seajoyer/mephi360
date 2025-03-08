import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section } from '@telegram-apps/telegram-ui';
import { StuffBanner } from '@/components/layout/StuffBanner';

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
    activeInstitute?: string | null;
}

const ITEMS_PER_PAGE = 5;

// Mock data generator
const generateMockStudyMaterials = (): StudyMaterial[] => {
    const materialTypes = [
        'Теория',
        'КР',
        'Лаба',
        'БДЗ',
        'Зачет',
        'Экзамен',
        'Пересдача',
        'Комиссия',
    ];

    const semesters = [
        '1 сем',
        '2 сем',
        '3 сем',
        '4 сем',
        '5 сем',
        '6 сем',
        '7 сем',
        '8 сем'
    ];

    const institutes = [
        'ИЯФИТ',
        'ЛаПлаз',
        'ИФИБ',
        'ИНТЭЛ',
        'ИИКС',
        'ИФТИС',
        'ИФТЭБ',
        'ИМО',
        'ФБИУКС'
    ];

    const teachers = [
        'Иванов И.И.',
        'Петров П.П.',
        'Сидоров С.С.',
        'Кузнецова К.К.',
        'Смирнова С.С.',
        'Васильев В.В.',
        'Михайлов М.М.',
        'Андреев А.А.'
    ];

    const subjects = [
        'Математика',
        'Физика',
        'Информатика',
        'Программирование',
        'Электроника',
        'Схемотехника',
        'Теория вероятностей',
        'Дискретная математика',
        'Базы данных',
        'Операционные системы'
    ];

    return Array.from({ length: 30 }, (_, index) => {
        // Select attributes for this material
        const materialType = materialTypes[index % materialTypes.length];
        const semester = semesters[Math.floor(Math.random() * semesters.length)];
        const institute = institutes[Math.floor(Math.random() * institutes.length)];
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];

        // Create tags from attributes - include only the filterable properties but exclude institute
        // as it is now handled by the institute panel
        const tags = [materialType, teacher, subject, semester].filter(Boolean);

        // Create a detailed description
        const description = `${materialType} по предмету "${subject}" для студентов ${institute}. Подготовлено преподавателем ${teacher} для ${semester}.`;

        return {
            id: index + 1,
            title: `${subject} - ${materialType}`,
            description,
            tags,
            telegramLink: `https://t.me/c/1234567890/${index + 1}`,
            type: materialType,
            semester,
            teacher,
            institute,
            subject
        };
    });
};

// Create a cache object to store loaded sections
const sectionsCache: Record<string, StudyMaterial[]> = {};

// Loading skeleton component
const StuffBannerSkeleton: React.FC = () => (
    <div className="p-4 animate-pulse">
        <div className="flex-1">
            <div className="h-5 bg-gray-500 rounded w-40 mb-2"></div>
            <div className="h-3 bg-gray-500 rounded w-full"></div>
            <div className="h-3 bg-gray-500 rounded w-full mt-1"></div>
            <div className="h-3 bg-gray-500 rounded w-3/4 mt-1"></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-6 bg-gray-500 rounded w-16"></div>
            <div className="h-6 bg-gray-500 rounded w-20"></div>
            <div className="h-6 bg-gray-500 rounded w-14"></div>
        </div>
    </div>
);

const LoadingState: React.FC = () => (
    <>
        {Array.from({ length: 3 }).map((_, index) => (
            <Section key={`skeleton-${index}`} className="mb-3">
                <StuffBannerSkeleton />
            </Section>
        ))}
    </>
);

export const StuffList: React.FC<StuffListProps> = ({ activeInstitute = null }) => {
    // Lazy load study materials data
    const allMaterials = useRef<StudyMaterial[]>([]);

    // Get cached data based on the active institute filter
    const cacheKey = activeInstitute ? `stuff-${activeInstitute}` : 'stuff';
    const cachedData = sectionsCache[cacheKey] || [];

    const [displayedMaterials, setDisplayedMaterials] = useState<StudyMaterial[]>(cachedData);
    const [isLoading, setIsLoading] = useState(cachedData.length === 0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState<string | null>(activeInstitute);

    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadTriggerRef = useRef<HTMLDivElement>(null);

    // Initialize study materials data if not already loaded
    useEffect(() => {
        if (allMaterials.current.length === 0) {
            try {
                // In a real app, you'd fetch from an API here
                allMaterials.current = generateMockStudyMaterials();
            } catch (err) {
                setError('Failed to load study materials data');
                console.error(err);
            }
        }
    }, []);

    // Reset displayed materials when institute filter changes
    useEffect(() => {
        if (currentFilter !== activeInstitute) {
            setDisplayedMaterials([]);
            setIsLoading(true);
            setHasMore(true);
            setCurrentFilter(activeInstitute);
        }
    }, [activeInstitute, currentFilter]);

    const loadMoreMaterials = useCallback(() => {
        if (loadingRef.current || !hasMore || error) return;

        loadingRef.current = true;
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            try {
                // Filter materials by institute if selected
                const filteredAllMaterials = activeInstitute
                    ? allMaterials.current.filter(material => material.institute === activeInstitute)
                    : allMaterials.current;

                const startIndex = displayedMaterials.length;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const nextItems = filteredAllMaterials.slice(startIndex, endIndex);

                if (nextItems.length > 0) {
                    const newMaterials = [...displayedMaterials, ...nextItems];
                    setDisplayedMaterials(newMaterials);

                    // Update cache with the institute-specific key
                    sectionsCache[cacheKey] = newMaterials;
                    setHasMore(endIndex < filteredAllMaterials.length);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                setError('Error loading more study materials');
                console.error(err);
            } finally {
                setIsLoading(false);
                loadingRef.current = false;
            }
        }, displayedMaterials.length > 0 ? 200 : 400); // Add delay for better UX
    }, [displayedMaterials, hasMore, error, activeInstitute, cacheKey]);

    // Initial load only if no cached data
    useEffect(() => {
        if (displayedMaterials.length === 0 && !error) {
            loadMoreMaterials();
        }
    }, [loadMoreMaterials, displayedMaterials.length, error]);

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
    }, [displayedMaterials]);

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
                {displayedMaterials.map((material) => (
                    <div key={material.id}>
                        <StuffBanner
                            title={material.title}
                            description={material.description}
                            tags={material.tags}
                            telegramLink={material.telegramLink}
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
                {isLoading && displayedMaterials.length === 0 && (
                    <div className='-mt-4'>
                        <LoadingState />
                    </div>
                )}

                {/* Show loading indicator when loading more */}
                {isLoading && displayedMaterials.length > 0 && (
                    <div className="py-4 text-center">
                        <div className="inline-block h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && displayedMaterials.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        Все материалы загружены
                    </div>
                )}
            </div>
        </div>
    );
};
