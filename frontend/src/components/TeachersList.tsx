import { Section, Cell, Avatar, Divider, Spinner } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';
import { Link } from '@/components/Link/Link';

interface Teacher {
    id: number;
    name: string;
    department: string;
    imageFileName: string;
}

// Mock teacher data (to be replaced by backend API in the future)
const allTeachers: Teacher[] = [
    { id: 1, name: 'Щербачев О.В.', department: 'Кафедра общей физики №6', imageFileName: 'Pepe.jpg' },
    { id: 2, name: 'Горячев А.П.', department: 'Кафедра высшей математики №30', imageFileName: 'Горячев АП.png' },
    { id: 3, name: 'Иванова Т.М.', department: 'Кафедра высшей математики №30', imageFileName: 'Иванова ТМ.jpg' },
    { id: 4, name: 'Прищепа А.Р.', department: 'Кафедра общей физики №6', imageFileName: 'Прищепа АР.jpg' },
    { id: 5, name: 'Стёпин Е.В.', department: 'Кафедра прикладной математики №31', imageFileName: 'Степин ЕВ.jpg' },
    { id: 6, name: 'Савин В.Ю.', department: 'Кафедра высшей математики №30', imageFileName: 'Савин ВЮ.jpg' },
    { id: 7, name: 'Агапова В.М.', department: 'Кафедра иностранных языков №50', imageFileName: 'Агапова ВМ.jpg' },
    { id: 8, name: 'Храмченков Д.В.', department: 'Кафедра физики №23', imageFileName: 'Храмченков ДВ.png' },
    { id: 9, name: 'Шмалий В.В.', department: 'Кафедра философии, онтологии и теории познания №54', imageFileName: 'Шмалий ВВ.jpg' },
    { id: 10, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 11, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 12, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 13, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 14, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 15, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 16, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 17, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 18, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 19, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 20, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 21, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 22, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 23, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 24, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 25, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
    { id: 26, name: 'Попруженко С.В.', department: 'Кафедра общей физики №6', imageFileName: 'Попруженко СВ.jpg' },
];

// Mock data fetching function (keep as is)
const fetchTeachers = (page: number, pageSize: number): Promise<Teacher[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            resolve(allTeachers.slice(start, end));
        }, 500);
    });
};;

interface ScrollState {
    startY: number;
    currentY: number;
    isOverscrolling: boolean;
}

export const TeachersList: FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollStateRef = useRef<ScrollState>({
        startY: 0,
        currentY: 0,
        isOverscrolling: false
    });

    useEffect(() => {
        const loadInitialTeachers = async () => {
            setIsLoading(true);
            const initialTeachers = await fetchTeachers(1, 10);
            setTeachers(initialTeachers);
            if (initialTeachers.length < 10) {
                setHasMore(false);
            }
            setIsLoading(false);
        };
        loadInitialTeachers();
    }, []);

    useEffect(() => {
        if (!sentinelRef.current || !hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    loadMoreTeachers();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, isLoading]);

    const loadMoreTeachers = async () => {
        setIsLoading(true);
        const nextPage = page + 1;
        const moreTeachers = await fetchTeachers(nextPage, 10);
        setTeachers((prev) => [...prev, ...moreTeachers]);
        setPage(nextPage);
        if (moreTeachers.length < 10) {
            setHasMore(false);
        }
        setIsLoading(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!containerRef.current) return;

        const touch = e.touches[0];
        scrollStateRef.current.startY = touch.clientY;
        scrollStateRef.current.isOverscrolling = false;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!containerRef.current) return;

        const touch = e.touches[0];
        const container = containerRef.current;
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 1;

        if (isAtBottom || isLoading) {
            const deltaY = touch.clientY - scrollStateRef.current.startY;

            if (deltaY > 0) {
                e.preventDefault();
                scrollStateRef.current.isOverscrolling = true;
                scrollStateRef.current.currentY = touch.clientY;

                // Calculate elastic transform based on drag distance
                const resistance = 0.3;
                const transform = `translateY(${deltaY * resistance}px)`;
                container.style.transform = transform;
            }
        }
    };

    const handleTouchEnd = () => {
        if (!containerRef.current || !scrollStateRef.current.isOverscrolling) return;

        // Animate back to original position
        const container = containerRef.current;
        container.style.transition = 'transform 0.3s cubic-bezier(0.19, 1, 0.22, 1)';
        container.style.transform = 'translateY(0)';

        // Reset transition after animation
        setTimeout(() => {
            if (container) {
                container.style.transition = '';
            }
        }, 300);

        scrollStateRef.current.isOverscrolling = false;
    };

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                overscrollBehavior: 'none',
                WebkitOverflowScrolling: 'touch'
            }}
        >
            <Section>
                {teachers.map((teacher) => (
                    <div key={teacher.id}>
                        <Link to={`/teacher/${teacher.id}`}>
                            <Cell
                                before={
                                    <Avatar
                                        size={40}
                                        src={`/assets/teachers/${teacher.imageFileName}`}
                                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                                    />
                                }
                                after={<Icon16Chevron_right />}
                                description={teacher.department}
                            >
                                {teacher.name}
                            </Cell>
                        </Link>
                        {teacher.id < teachers.length && <Divider />}
                    </div>
                ))}
            </Section>
            {hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
            {isLoading && (
                <div className="pb-4 justify-center flex items-center">
                    <Spinner size="m" />
                </div>
            )}
        </div>
    );
};
