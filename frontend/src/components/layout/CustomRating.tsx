import React, { useState } from 'react';
import { Icon24Star_fill } from '@/icons/24/star_fill';

type PrecisionType = 0.25 | 0.5 | 1;

interface CustomRatingProps {
    value: number;
    onChange?: (value: number) => void;
    isActive: boolean;
    max?: number;
    precision?: PrecisionType;
    initialEmpty?: boolean;
    disabled?: boolean; // New prop for non-editable categories
}

export const CustomRating: React.FC<CustomRatingProps> = ({
    value,
    onChange,
    isActive = false,
    max = 5,
    precision = 0.5,
    initialEmpty = false,
    disabled = false
}) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Generate array of star indices
    const stars = Array.from({ length: max }, (_, i) => i + 1);

    // Determine display value (hover value takes precedence when active)
    // If initialEmpty is true and we're in active mode with no hover/selection, display empty stars
    const shouldShowEmpty = initialEmpty && isActive && hoverValue === null && value === 0;
    const displayValue = shouldShowEmpty ? 0 : (hoverValue !== null ? hoverValue : value);

    // Calculate whether a star should be shown as partially filled
    const getStarFillPercent = (starIndex: number): number => {
        if (starIndex <= Math.floor(displayValue)) {
            return 100; // Full star
        } else if (starIndex > Math.ceil(displayValue)) {
            return 0; // Empty star
        } else {
            // Partial fill calculation
            const fraction = displayValue - Math.floor(displayValue);
            return fraction * 100;
        }
    };

    // Generate possible rating values based on precision
    const getRatingValues = (): number[] => {
        const values: number[] = [];
        for (let i = 0; i < max; i++) {
            for (let j = precision; j <= 1; j += precision) {
                values.push(i + j);
            }
        }
        return values;
    };

    const ratingValues = getRatingValues();

    return (
        <div
            className="flex transition-all duration-200 ease-in-out"
        >
            {stars.map((star) => {
                const fillPercent = getStarFillPercent(star);

                return (
                    <div
                        key={star}
                        className="mx-0.5 transition-all duration-200 ease-in-out relative"
                        style={{
                            cursor: isActive && !disabled ? 'pointer' : 'default',
                            color: isActive && !disabled ? 'var(--tgui--secondary_fill)' : 'var(--tgui--tertiary_bg_color)',
                        }}
                    >
                        {/* Base star (empty) */}
                        <Icon24Star_fill />

                        {/* Filled overlay with clip-path for partial fills - always render for smooth transitions */}
                        <div
                            className="absolute top-0 left-0 transition-all duration-200 ease-in-out"
                            style={{
                                color: disabled ? 'var(--tgui--subtitle_text_color)' : 'var(--tgui--accent_text_color)',
                                clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
                                width: '100%',
                                height: '100%',
                                opacity: fillPercent > 0 ? 1 : 0 // Instead of conditional rendering, use opacity
                            }}
                        >
                            <Icon24Star_fill />
                        </div>

                        {/* Clickable areas for precision ratings - only render if not disabled */}
                        {isActive && !disabled && (
                            <div className="absolute top-0 left-0 w-full h-full flex">
                                {Array.from({ length: 1 / precision }).map((_, i) => {
                                    const ratingValue = (star - 1) + ((i + 1) * precision);

                                    return (
                                        <div
                                            key={i}
                                            className="h-full cursor-pointer"
                                            style={{ width: `${precision * 100}%` }}
                                            onMouseEnter={() => setHoverValue(ratingValue)}
                                            onMouseLeave={() => setHoverValue(null)}
                                            onClick={() => onChange && onChange(ratingValue)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
