import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section, Cell, Avatar, Divider } from '@telegram-apps/telegram-ui';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon24Addhome } from '@/icons/24/addhome';
import { Link } from '@/components/common/Link';
import { getDepartments } from '@/services/apiService';

interface Department {
  id: number;
  number: string;
  name: string;
}

interface DepartmentsListProps {
  searchQuery?: string;
}

// Loading skeleton component
const DepartmentCellSkeleton: React.FC = () => (
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
        <DepartmentCellSkeleton />
        {index < 4 && <Divider />}
      </React.Fragment>
    ))}
  </>
);

export const DepartmentList: React.FC<DepartmentsListProps> = ({
  searchQuery = ''
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadTriggerRef = useRef<HTMLDivElement>(null);

  // Load departments function
  const loadMoreDepartments = useCallback(async () => {
    if (loadingRef.current || !hasMore || error) return;

    loadingRef.current = true;
    setIsLoading(true);

    try {
      const response = await getDepartments({
        search: searchQuery,
        cursor: cursor || undefined,
        limit: 20
      });

      if (response.items.length > 0) {
        setDepartments(prev => [...prev, ...response.items]);
        setCursor(response.nextCursor);
        setHasMore(!!response.nextCursor);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading departments');
      console.error(err);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [cursor, hasMore, error, searchQuery]);

  // Reset when search query changes
  useEffect(() => {
    setDepartments([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
    loadingRef.current = false;
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    if (departments.length === 0 && !error) {
      loadMoreDepartments();
    }
  }, [loadMoreDepartments, error, departments.length]);

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
        loadMoreDepartments();
      }
    }, options);

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [loadMoreDepartments, hasMore]);

  // Observe load trigger element
  useEffect(() => {
    const observer = observerRef.current;
    const trigger = loadTriggerRef.current;

    if (observer && trigger) {
      observer.observe(trigger);
      return () => observer.unobserve(trigger);
    }
  }, [departments]);

  // Error state
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <button
          className="block mx-auto mt-2 p-2 bg-gray-200 rounded"
          onClick={() => {
            setError(null);
            loadMoreDepartments();
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
      <Section>
        {departments.map((department, index) => (
          <div key={department.id}>
            <Link to={`/department/${department.id}`}>
              <Cell
                before={
                  <Avatar
                    size={40}
                    src={`/assets/departments/department${department.id % 5 + 1}.jpg`}
                    fallbackIcon={<span><Icon24Addhome /></span>}
                  />
                }
                after={
                  <Icon16Chevron_right
                    style={{color: 'var(--tg-theme-link-color)'}}
                  />
                }
                description={department.name}
              >
                {`Кафедра ${department.number}`}
              </Cell>
            </Link>
            {index < departments.length - 1 && <Divider />}
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
        {isLoading && departments.length === 0 && <LoadingState />}

        {/* Show loading indicator when loading more */}
        {isLoading && departments.length > 0 && (
          <div className="py-4 text-center">
            <div className="inline-block h-6 w-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* End of list message */}
        {!hasMore && departments.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            Больше кафедр нет
          </div>
        )}
      </Section>
    </div>
  );
};
