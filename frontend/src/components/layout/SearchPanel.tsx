import { useState, useRef, useEffect } from 'react';
import { Input, Button, Tappable } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { Icon24Person_add } from '@/icons/24/person_add';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';

export const SearchPanel = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const panelPositionRef = useRef<number | null>(null);

    const handleSearchClick = () => {
        setIsExpanded(true);
        if (containerRef.current) {
            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();
            const stickyTop = 84;
            if (containerRect.top < stickyTop) return;
            window.scrollTo({
                top: window.scrollY + containerRect.top - stickyTop,
                behavior: 'smooth'
            });
        }
    };

    const handleCloseClick = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsExpanded(false);
        setSearchValue('');
        if (inputRef.current) {
            inputRef.current.blur();
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        }
    };

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            const focusTimeout = setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 200);
            return () => clearTimeout(focusTimeout);
        }
    }, [isExpanded]);

    useEffect(() => {
        if (!containerRef.current) return;

        const storeInitialPosition = () => {
            if (!containerRef.current || panelPositionRef.current !== null) return;
            const rect = containerRef.current.getBoundingClientRect();
            panelPositionRef.current = rect.top + window.scrollY;
        };

        storeInitialPosition();

        const checkStickyState = () => {
            if (!containerRef.current || panelPositionRef.current === null) return;
            const stickyOffset = 83;
            const isCurrentlySticky = window.scrollY > (panelPositionRef.current - stickyOffset - 1);
            if (isSticky !== isCurrentlySticky) {
                setIsSticky(isCurrentlySticky);
            }
        };

        setTimeout(storeInitialPosition, 100);

        checkStickyState();
        window.addEventListener('scroll', checkStickyState, { passive: true });
        window.addEventListener('resize', storeInitialPosition, { passive: true });

        return () => {
            window.removeEventListener('scroll', checkStickyState);
            window.removeEventListener('resize', storeInitialPosition);
        };
    }, [isSticky]);

    return (
        <div data-searchpanel className="sticky top-21 z-10" ref={containerRef}>
            <div
                className="absolute"
                style={{
                    backgroundColor: 'var(--tgui--secondary_bg_color)',
                    boxShadow: isSticky
                        ? '0 1px 0 var(--tgui--quartenary_bg_color)'
                        : 'none',
                    transition: 'box-shadow 0.2s ease-in-out',
                    top: '-0.5rem',
                    bottom: '-0.5rem',
                    left: '50%',
                    width: '100vw',
                    transform: 'translateX(-50%)'
                }}
            />

            <div className="flex relative gap-2 px-0 overflow-hidden -mb-1">
                <div
                    className="transition-all duration-200 ease-in-out"
                    style={{
                        width: isExpanded ? '100%' : '42px',
                        flexShrink: 0
                    }}
                >
                    <div className="relative">
                        {!isExpanded && (
                            <div
                                className="absolute inset-0 z-10 cursor-pointer"
                                onClick={handleSearchClick}
                                aria-label="Expand search"
                            />
                        )}

                        <Input
                            ref={inputRef}
                            placeholder={isExpanded ? "Поиск..." : ""}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            before={
                                <div className={`transition-transform duration-200 ${isExpanded ? '' : 'translate-x-[calc(50%-12px)]'}`}>
                                    <Icon24Search />
                                </div>
                            }
                            after={
                                isExpanded && (
                                    <Tappable
                                        Component="div"
                                        style={{
                                            display: 'flex',
                                            position: 'relative',
                                            zIndex: 20,
                                        }}
                                        onClick={handleCloseClick}
                                    >
                                        <Icon24Close style={{ color: 'var(--tgui--section_fg_color)' }} />
                                    </Tappable>
                                )
                            }
                        />
                    </div>
                </div>

                <div className={`transition-all duration-200 ease-in-out flex-grow min-w-10 ${isExpanded ? 'pointer-events-none opacity-0' : 'w-auto opacity-100'}`}>
                    <Button
                        mode="gray"
                        size="m"
                        after={
                            <div style={{ color: 'var(--tgui--hint_color)' }}>
                                <Icon20Chevron_vertical />
                            </div>}
                        style={{
                            padding: 8,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'var(--tgui--section_bg_color)'
                        }}
                    >
                        <div style={{ color: 'var(--tgui--hint_color)' }}>
                            <span className="font-medium">Все кафедры</span>
                        </div>
                    </Button>
                </div>

                <div className={`transition-all duration-200 ease-in-out ${isExpanded ? 'pointer-events-none opacity-0' : 'w-auto opacity-100'}`}>
                    <Button
                        mode="gray"
                        size="m"
                        style={{
                            padding: 8,
                            background: 'var(--tgui--section_bg_color)'
                        }}
                    >
                        <Icon24Person_add />
                    </Button>
                </div>
            </div>
        </div>
    );
};
