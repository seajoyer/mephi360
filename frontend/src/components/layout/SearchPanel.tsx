import { useState, useRef, useEffect, forwardRef } from 'react';
import { Input, Button, Tappable } from '@telegram-apps/telegram-ui';
import { Icon24Search }           from '@/icons/24/search';
import { Icon24Close }            from '@/icons/24/close';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';

export const SearchPanel = forwardRef<HTMLDivElement>((props, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine the forwarded ref with our local ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        if (containerRef.current) {
          ref(containerRef.current);
        }
      } else if (containerRef.current) {
        ref.current = containerRef.current;
      }
    }
  }, [ref]);

  const handleSearchClick = () => {
    setIsExpanded(true);

    // Scroll to keep search panel visible if needed
    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const stickyTop = 8;

      if (containerRect.top < stickyTop) {
        return;
      }

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

      // Force keyboard to hide on mobile
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      const focusTimeout = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 200);
      return () => clearTimeout(focusTimeout);
    }
  }, [isExpanded]);

  return (
    <div data-searchpanel className="sticky top-2 z-10" ref={containerRef}>
      {/* Background overlay */}
      <div
        className="absolute inset-x-0 -top-2 -bottom-2"
        style={{ backgroundColor: 'var(--tgui--secondary_bg_color)' }}
      />

      <div className="flex relative gap-2 px-0 overflow-hidden">
        {/* Search input container */}
        <div
          className="transition-all duration-200 ease-in-out"
          style={{
            width: isExpanded ? '100%' : '42px',
            flexShrink: 0
          }}
        >
          <div className="relative">
            {/* Clickable overlay for collapsed state */}
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
                <div className={`transition-transform duration-200 ${
                  isExpanded ? '' : 'translate-x-[calc(50%-12px)]'
                }`}>
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
                    <Icon24Close style={{color: 'var(--tgui--section_fg_color)'}}/>
                  </Tappable>
                )
              }
            />
          </div>
        </div>

        {/* Department Selector (hidden when search is expanded) */}
        <div className={`transition-all duration-200 ease-in-out flex-grow min-w-0 ${
          isExpanded ? 'opacity-0 pointer-events-none w-0' : 'opacity-100 w-auto'
        }`}>
          <Button
            mode="gray"
            size="m"
            after={<Icon20Chevron_vertical />}
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
      </div>
    </div>
  );
});

SearchPanel.displayName = 'SearchPanel';
