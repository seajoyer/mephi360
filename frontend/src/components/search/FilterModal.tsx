import React from 'react';
import { Cell, Divider, Text, Button, Modal } from '@telegram-apps/telegram-ui';

export interface FilterOption {
    id: string;
    name: string;
}

interface FilterModalProps {
    isOpen: boolean;
    options: FilterOption[];
    selectedOption: string | null;
    onSelect: (optionId: string | null) => void;
    title: string;
    onClose?: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    options,
    selectedOption,
    onSelect,
    title,
    onClose
}) => {
    // Handle selection and close modal
    const handleSelect = (optionId: string | null) => {
        onSelect(optionId);
        if (onClose) onClose();
    };

    // Handle cancel button
    const handleCancel = () => {
        if (onClose) onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleCancel}
        >
            <div className="p-4">
                <Text weight="1" className="text-center mb-4">{title}</Text>

                {/* Clear option */}
                <Cell
                    onClick={() => handleSelect(null)}
                    style={{
                        padding: '12px 16px',
                        backgroundColor: selectedOption === null ?
                            'var(--tgui--tertiary_bg_color)' : 'transparent',
                        borderRadius: '8px'
                    }}
                >
                    <span className="text-base font-medium">
                        Все
                    </span>
                </Cell>

                <Divider className="my-2" />

                {/* Option items */}
                <div className="max-h-[50vh] overflow-y-auto">
                    {options.map((option) => (
                        <Cell
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            style={{
                                padding: '12px 16px',
                                backgroundColor: selectedOption === option.id ?
                                    'var(--tgui--tertiary_bg_color)' : 'transparent',
                                borderRadius: '8px'
                            }}
                        >
                            <span className="text-base font-medium">
                                {option.name}
                            </span>
                        </Cell>
                    ))}
                </div>

                <Button
                    mode="plain"
                    size="m"
                    className="w-full mt-4"
                    onClick={handleCancel}
                >
                    Отмена
                </Button>
            </div>
        </Modal>
    );
};
