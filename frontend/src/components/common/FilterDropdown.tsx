import React, { useState, useRef, useEffect } from 'react';
import { Cell, Divider, Tappable, Button, Subheadline, Text } from '@telegram-apps/telegram-ui';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';
import { Icon24Close } from '@/icons/24/close';

// Define dropdown option type
export interface DropdownOption {
    id: string;
    name: string;
}

interface FilterDropdownProps {
    options: DropdownOption[];
    selectedOption: string | null;
    onSelect: (optionId: string | null) => void;
    placeholder: string;
    loading?: boolean;
    className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    options,
    selectedOption,
    onSelect,
    placeholder,
    loading = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedItem = options.find(option => option.id === selectedOption);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Select option and close dropdown
    const handleSelect = (option: DropdownOption | null) => {
        onSelect(option?.id || null);
        setIsOpen(false);
    };

    // Clear selected option
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(null);
    };

    return (
        <div
            ref={dropdownRef}
            className={`filter-dropdown ${className}`}
            style={{ width: '100%', zIndex: isOpen ? 100 : 0 }}
        >
            {/* Button to toggle dropdown */}
            <Button
                mode="gray"
                size="m"
                style={{
                    width: '100%',
                    justifyContent: "space-between",
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    background: 'var(--tgui--section_bg_color)',
                    color: selectedItem ? 'var(--tgui--text_color)' : 'var(--tgui--subtitle_text_color)',
                    textAlign: 'left',
                    position: 'relative',
                    zIndex: 1,
                }}
                onClick={toggleDropdown}
                after={
                    selectedItem ? (
                        <Tappable
                            onClick={handleClear}
                            className='-mr-0.5'
                        >
                            <Icon24Close style={{ color: 'var(--tgui--hint_color)' }} />
                        </Tappable>
                    ) : (
                        <Icon20Chevron_vertical style={{
                            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease-in-out'
                        }} />
                    )
                }
            >

                  {selectedItem ? selectedItem.name : placeholder}
            </Button>

            {/* Dropdown options */}
            {isOpen && (
                <div
                    className="dropdown-options"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        zIndex: 1000,
                        background: 'var(--tgui--bg_color)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden',
                        maxHeight: '300px',
                        overflowY: 'auto',
                    }}
                >
                    {/* Clear option */}
                    <Tappable onClick={() => handleSelect(null)}>
                        <Cell
                            style={{
                                padding: '8px 16px',
                                backgroundColor: selectedOption === null ?
                                    'var(--tgui--tertiary_bg_color)' : 'transparent'
                            }}
                        >
                            <Subheadline level="2" weight="3">
                                {placeholder}
                            </Subheadline>
                        </Cell>
                        <Divider />
                    </Tappable>

                    {/* Option items */}
                    {loading ? (
                        <div className="p-4 text-center">
                            <div className="inline-block h-5 w-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        options.map((option, index) => (
                            <React.Fragment key={option.id}>
                                <Tappable onClick={() => handleSelect(option)}>
                                    <Cell
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: selectedOption === option.id ?
                                                'var(--tgui--tertiary_bg_color)' : 'transparent'
                                        }}
                                    >
                                        <Subheadline level="2" weight="3">
                                            {option.name}
                                        </Subheadline>
                                    </Cell>
                                </Tappable>
                                {index < options.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
