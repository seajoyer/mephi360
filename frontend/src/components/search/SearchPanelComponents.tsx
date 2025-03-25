import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { Icon24Close } from '@/icons/24/close';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';
import { Icon20Chevron_down } from '@/icons/20/chevron_down';
import { Icon16Chevron } from '@/icons/16/chevron';

interface FilterContainerProps {
  children: React.ReactNode;
  className?: string;
  isHidden?: boolean; // To hide when search is expanded
}

/**
 * A responsive container for filter buttons that automatically switches between
 * static (evenly spaced) and scrollable layouts depending on available width.
 */
export const FilterContainer: React.FC<FilterContainerProps> = ({
  children,
  className = '',
  isHidden = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expandFilters, setExpandFilters] = useState(false);

  // Measure if content fits container
  const measureContainers = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;

      // If content width is less than container width, expand filters
      setExpandFilters(contentWidth <= containerWidth);
    }
  }, []);

  // Set up ResizeObserver to detect width changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!isHidden) {
        measureContainers();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial measurement
    if (!isHidden) {
      measureContainers();
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureContainers, isHidden]);

  // Re-measure when visibility changes
  useEffect(() => {
    if (!isHidden) {
      setTimeout(measureContainers, 0);
    }
  }, [isHidden, measureContainers]);

  if (isHidden) {
    return null;
  }

  // Count React children to distribute width evenly
  const childCount = React.Children.count(children);

  return (
    <div
      ref={containerRef}
      className={`flex-1 ${expandFilters ? '' : 'overflow-x-auto no-scrollbar'} ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div
        ref={contentRef}
        className="flex gap-2"
        style={{
          width: expandFilters ? '100%' : 'auto',
        }}
      >
        {expandFilters
          ? React.Children.map(children, (child) => (
              <div style={{ flex: `1 1 ${100 / childCount}%` }}>{child}</div>
            ))
          : children}
      </div>
    </div>
  );
};

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  onClear?: () => void;
  expandable?: boolean;
}

/**
 * A standardized filter button with selection state and clear functionality
 */
export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  selected,
  onClick,
  onClear,
  expandable = true
}) => {
  return (
    <Button
      mode="gray"
      size="m"
      style={{
        justifyContent: "space-between",
        paddingLeft: '10px',
        paddingRight: '10px',
        background: 'var(--tgui--section_bg_color)',
        width: '100%',
      }}
      onClick={onClick}
      after={
        selected ? (
          <Icon24Close
            style={{
              cursor: 'pointer',
              marginRight: '-2px',
            }}
            onClick={onClear ? (e) => {
              e.stopPropagation();
              onClear();
            } : undefined}
          />
        ) : (
          <Icon16Chevron />
        )
      }
    >
          <div
              style={{
                  color: selected ? 'var(--tgui--text_color)' : 'var(--tgui--subtitle_text_color)',
              }}
          >
              {label}
          </div>
    </Button>
  );
};

/**
 * Common styles for all search panels - fixed to prevent horizontal overflow
 */
export const SearchPanelStyles = () => (
  <style jsx global>{`
    .search-panel {
      position: sticky;
      top: 0;
      z-index: 50;
      padding-top: 16px;
      padding-bottom: 16px;
      background-color: var(--tgui--secondary_bg_color);
      transition: box-shadow 0.2s ease-in-out;
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    .search-panel.sticky {
      box-shadow: 0 1px 0 var(--tgui--quartenary_bg_color);
    }

    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);
