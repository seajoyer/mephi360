import React, { useEffect, useRef, useState } from 'react';
import { Cell, Selectable, Subheadline } from '@telegram-apps/telegram-ui';

export interface FilterOption {
  id: string;
  name: string;
}

interface FilterDropdownProps {
  isOpen: boolean;
  options: FilterOption[];
  selectedOption: string | null;
  onSelect: (optionId: string | null) => void;
  title?: string;
  targetRef?: React.RefObject<HTMLElement>; // Reference to the button that triggered the dropdown
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  options,
  selectedOption,
  onSelect,
  title,
  targetRef
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on the target button
  const updatePosition = () => {
    if (!targetRef?.current || !dropdownRef.current) return;

    const buttonRect = targetRef.current.getBoundingClientRect();

    // On first render, dropdown might not have a proper height yet,
    // so we use an approximation based on the number of options
    const dropdownHeight = dropdownRef.current.clientHeight ||
      Math.min(300, (options.length + 1) * 48 + (title ? 44 : 0));

    const dropdownWidth = dropdownRef.current.clientWidth || 200;

    // Default position is below the button
    let top = buttonRect.bottom + 8;
    let left = buttonRect.left;

    // Check if dropdown would go off the right edge of the screen
    const rightEdge = left + dropdownWidth;
    if (rightEdge > window.innerWidth) {
      left = Math.max(16, window.innerWidth - dropdownWidth - 16);
    }

    // Check if dropdown would go off the bottom of the screen
    const bottomEdge = top + dropdownHeight;
    if (bottomEdge > window.innerHeight) {
      // Position above the button if there's more space
      if (buttonRect.top > window.innerHeight - buttonRect.bottom) {
        top = buttonRect.top - dropdownHeight - 8;
      }
    }

    setPosition({ top, left });

    // Schedule another position update after dropdown is rendered
    // to account for its actual dimensions
    setTimeout(updatePosition, 0);
  };

  // Update position when dropdown opens or window resizes
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, options.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      // Don't close if clicking on the target button (let the button's onClick handle it)
      if (targetRef?.current?.contains(event.target as Node)) {
        return;
      }

      // Close if clicking outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onSelect(selectedOption); // Keep current selection and close
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onSelect, selectedOption]);

  // Handle option selection
  const handleSelect = (optionId: string | null) => {
    onSelect(optionId);
    // The parent component should close the dropdown by setting isOpen to false
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="filter-dropdown"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
        width: 'auto',
        minWidth: '200px',
        maxWidth: '300px'
      }}
    >
      <div
        className="dropdown-options"
        style={{
          background: 'var(--tgui--bg_color)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxHeight: '300px',
          overflowY: 'auto',
          width: '100%'
        }}
      >
        {title && (
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--tgui--divider)',
              position: 'sticky',
              top: 0,
              background: 'var(--tgui--bg_color)',
              zIndex: 1
            }}
          >
            <Subheadline level="1" weight="2">{title}</Subheadline>
          </div>
        )}

        <div>
          {/* "All" option to clear filter */}
          <Cell
            Component="label"
            before={
              <Selectable
                checked={selectedOption === null}
                name="filter-option-group"
                value="all"
                onChange={() => handleSelect(null)}
              />
            }
          >
            Все
          </Cell>

          {/* Render options */}
          {options.map(option => (
            <Cell
              key={option.id}
              Component="label"
              before={
                <Selectable
                  checked={selectedOption === option.id}
                  name="filter-option-group"
                  value={option.id}
                  onChange={() => handleSelect(option.id)}
                />
              }
            >
              {option.name}
            </Cell>
          ))}
        </div>
      </div>
    </div>
  );
};
