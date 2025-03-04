import { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Tappable } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';
import { Icon24Person_add } from '@/icons/24/person_add';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';

interface SearchPanelProps {
    activeSection: string;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ activeSection }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isSticky, setIsSticky] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const filterContainerRef = useRef<HTMLDivElement>(null);
    const filterContentRef = useRef<HTMLDivElement>(null);
    const panelPositionRef = useRef<number | null>(null);

    // Function to check if the content is scrollable
    const checkScrollable = useCallback(() => {
        if (filterContainerRef.current && filterContentRef.current) {
            const containerWidth = filterContainerRef.current.clientWidth;
            const contentWidth = filterContentRef.current.scrollWidth;
            setIsScrollable(contentWidth > containerWidth);
        }
    }, []);

    const handleSearchClick = () => {
        setIsExpanded(true);
        if (containerRef.current) {
            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();
            const stickyTop = 76;
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

        setTimeout(() => {
            // Check scrollability after animation completes
            checkScrollable();

            // Blur the input field
            if (inputRef.current) {
                inputRef.current.blur();
            }

            // Force any active element to lose focus
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

            // Additional technique for iOS devices
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            if (isIOS) {
                // Create a hidden input, focus it, blur it, and remove it
                const temp = document.createElement('input');
                temp.style.position = 'absolute';
                temp.style.top = '-1000px';
                temp.setAttribute('readonly', 'readonly'); // important for iOS
                document.body.appendChild(temp);
                temp.focus();
                temp.blur();
                document.body.removeChild(temp);
            }
        }, 200);
    };

    const handleFilterClick = (filter: string) => {
        // Placeholder for filter functionality
        console.log(`Filter clicked: ${filter}`);
    };

    const handleAddClubClick = () => {
        // Placeholder for add club functionality
        console.log('Add a new club');
    };

    // Effect for expand/collapse focus handling and scrollability check
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            const focusTimeout = setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 200);
            return () => clearTimeout(focusTimeout);
        }

        // When expanding or collapsing, check scrollability after animation
        const animationTimeout = setTimeout(checkScrollable, 250);
        return () => clearTimeout(animationTimeout);
    }, [isExpanded, checkScrollable]);

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
            const stickyOffset = 74;
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

    // Check if filter buttons need scrolling - run on section change, window resize, or expand/collapse
    useEffect(() => {
        // Initial check
        checkScrollable();

        // Re-check on window resize
        window.addEventListener('resize', checkScrollable);

        // Cleanup
        return () => window.removeEventListener('resize', checkScrollable);
    }, [activeSection, checkScrollable]);

    // Render buttons based on active section
    const renderSectionButtons = () => {
        switch (activeSection) {
            case 'clubs':
                return (
                    <div
                        ref={filterContentRef}
                        className={`flex ${isScrollable ? '' : 'w-full'} ${isExpanded ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                    >
                        {/* Subject filter button */}
                        <div className={`transition-all duration-200 ease-in-out flex-shrink-0 mr-2 ${isScrollable ? '' : 'flex-grow'}`}>
                            <Button
                                mode="gray"
                                size="m"
                                after={
                                    <div style={{ color: 'var(--tgui--hint_color)' }}>
                                        <Icon20Chevron_vertical />
                                    </div>}
                                style={{
                                    padding: 8,
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'var(--tgui--section_bg_color)',
                                    width: isScrollable ? 'auto' : '100%'
                                }}
                                onClick={() => handleFilterClick('subjects')}
                            >
                                <div style={{ color: 'var(--tgui--hint_color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <span className="font-medium">Все предметы</span>
                                </div>
                            </Button>
                        </div>

                        {/* Organizers filter button */}
                        <div className={`transition-all duration-200 ease-in-out flex-shrink-0 mr-2 ${isScrollable ? '' : 'flex-grow'}`}>
                            <Button
                                mode="gray"
                                size="m"
                                after={
                                    <div style={{ color: 'var(--tgui--hint_color)' }}>
                                        <Icon20Chevron_vertical />
                                    </div>}
                                style={{
                                    padding: 8,
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'var(--tgui--section_bg_color)',
                                    width: isScrollable ? 'auto' : '100%'
                                }}
                                onClick={() => handleFilterClick('organizers')}
                            >
                                <div style={{ color: 'var(--tgui--hint_color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <span className="font-medium">Все организаторы</span>
                                </div>
                            </Button>
                        </div>

                        {/* Add club button */}
                        <div className="transition-all duration-200 ease-in-out flex-shrink-0">
                            <Button
                                mode="gray"
                                size="m"
                                style={{
                                    padding: 8,
                                    background: 'var(--tgui--section_bg_color)'
                                }}
                                onClick={handleAddClubClick}
                            >
                                <Icon24Person_add />
                            </Button>
                        </div>
                        {/* Invisible padding element after the last button */}
                        {isScrollable && (
                            <div className="w-2.5 flex-shrink-0" aria-hidden="true"></div>
                        )}
                    </div>
                );
            case 'tutors':
            default:
                // A completely different, standalone implementation for tutors section
                return (
                    <div
                        ref={filterContentRef}
                        style={{
                            display: 'flex',
                            width: '100%',
                            opacity: isExpanded ? 0 : 1,
                            pointerEvents: isExpanded ? 'none' : 'auto'
                        }}
                    >
                        {/* Departments filter with fixed styling */}
                        <div style={{
                            flexGrow: 1,
                            marginRight: '8px',
                            width: 'calc(100% - 50px)' // Reserve space for the add button
                        }}>
                            <Button
                                mode="gray"
                                size="m"
                                after={
                                    <div style={{ color: 'var(--tgui--hint_color)' }}>
                                        <Icon20Chevron_vertical />
                                    </div>
                                }
                                style={{
                                    padding: 8,
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'var(--tgui--section_bg_color)',
                                    width: '100%'
                                }}
                                onClick={() => handleFilterClick('departments')}
                            >
                                <div style={{ color: 'var(--tgui--hint_color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <span className="font-medium">Все кафедры</span>
                                </div>
                            </Button>
                        </div>

                        {/* Person Add Button with fixed styling */}
                        <div style={{ flexShrink: 0 }}>
                            <Button
                                mode="gray"
                                size="m"
                                style={{
                                    padding: 8,
                                    background: 'var(--tgui--section_bg_color)'
                                }}
                                onClick={handleAddClubClick}
                            >
                                <Icon24Person_add />
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            data-searchpanel
            className="sticky top-19 z-20 pt-1 pb-2"
            ref={containerRef}
            style={{
                backgroundColor: 'var(--tgui--secondary_bg_color)',
                boxShadow: isSticky ? '0 1px 0 var(--tgui--quartenary_bg_color)' : 'none',
                transition: 'box-shadow 0.4s ease-in-out',
                width: 'calc(100% + 20px)',
                marginLeft: '-10px',
                paddingLeft: '10px',
                paddingRight: isScrollable ? '0' : '10px',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            {/* Global CSS for hiding scrollbars */}
            <style jsx global>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                /* Hide scrollbar for IE, Edge and Firefox */
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>

            <div className="flex gap-2">
                <div
                    className="transition-all duration-200 ease-in-out"
                    style={{
                        width: isExpanded ? (isScrollable ? 'calc(100% - 10px)' : '100%') : '42px',
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

                <div
                    ref={filterContainerRef}
                    className="relative overflow-hidden no-scrollbar"
                    style={{
                        width: isExpanded ? '0' : 'calc(100% - 42px - 8px)',
                        overflowX: isScrollable ? 'auto' : 'hidden',
                    }}
                >
                    {/* If scrollable, add a wrapper with special overflow handling */}
                    {isScrollable && !isExpanded ? (
                        <div
                            className="overflow-x-auto no-scrollbar"
                            style={{
                                width: '100%',
                                paddingRight: '0'
                            }}
                        >
                            {renderSectionButtons()}
                        </div>
                    ) : (
                        renderSectionButtons()
                    )}
                </div>
            </div>

            {/* Add an invisible element to ensure the box-shadow extends full width */}
            <div className="absolute bottom-0 left-0 right-0 h-px" />
        </div>
    );
};
