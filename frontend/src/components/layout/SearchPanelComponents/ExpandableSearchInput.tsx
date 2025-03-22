import React, { useRef, useEffect } from 'react';
import { Input, Tappable } from '@telegram-apps/telegram-ui';
import { Icon24Search } from '@/icons/24/search';
import { Icon24Close } from '@/icons/24/close';

interface ExpandableSearchInputProps {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  value: string;
  onChange: (value: string) => void;
  hasInstituteButton: boolean;
  disableTransition?: boolean;
}

export const ExpandableSearchInput = React.memo<ExpandableSearchInputProps>(({
  isExpanded,
  onExpand,
  onCollapse,
  value,
  onChange,
  hasInstituteButton,
  disableTransition = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const expandedWidth = hasInstituteButton ? 'calc(100% - 50px)' : '100%';

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      const focusTimeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(focusTimeout);
    }
  }, [isExpanded]);

  return (
    <div
      className={disableTransition ? "" : "transition-all duration-200 ease-in-out"}
      style={{
        width: isExpanded ? expandedWidth : '42px',
        flexShrink: 0,
        transition: disableTransition ? 'none' : undefined
      }}
    >
      <div className="relative">
        {!isExpanded && (
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={onExpand}
            aria-label="Expand search"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onExpand();
              }
            }}
          />
        )}

        <Input
          ref={inputRef}
          placeholder={isExpanded ? "Поиск..." : ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search"
          before={
            <div
              className={disableTransition ? "" : `transition-transform duration-200 ${isExpanded ? '' : 'translate-x-[calc(50%-12px)]'}`}
              style={{
                transform: isExpanded ? 'none' : 'translateX(calc(50% - 12px))',
                transition: disableTransition ? 'none' : undefined
              }}
              aria-hidden="true"
            >
              <Icon24Search />
            </div>
          }
          after={
            isExpanded ? (
              <Tappable
                Component="div"
                style={{
                  display: 'flex',
                  position: 'relative',
                  zIndex: 20,
                }}
                onClick={onCollapse}
                aria-label="Close search"
              >
                <Icon24Close style={{ color: 'var(--tgui--section_fg_color)' }} />
              </Tappable>
            ) : null
          }
        />
      </div>
    </div>
  );
});

ExpandableSearchInput.displayName = 'ExpandableSearchInput';
