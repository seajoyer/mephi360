import { useState, useCallback } from 'react';

interface SectionCache<T> {
    data: T[];
    isLoaded: boolean;
}

export const useSectionCache = <T,>(sectionId: string) => {
    const [cache, setCache] = useState<SectionCache<T>>({
        data: [],
        isLoaded: false
    });

    const updateCache = useCallback((newData: T[]) => {
        setCache({
            data: newData,
            isLoaded: true
        });
    }, []);

    return {
        data: cache.data,
        isLoaded: cache.isLoaded,
        updateCache
    };
};
