import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from '@telegram-apps/telegram-ui';
import { Icon20Questionmark } from '../../icons/20/questionmark';
import { DEPARTMENT_RATING_DESCRIPTIONS } from '@/constants/ratingConstants';

interface RatingCategoryWithTooltipProps {
    category: string;
    entityType?: 'tutor' | 'department';
}

export const RatingCategoryWithTooltip: React.FC<RatingCategoryWithTooltipProps> = ({
    category,
    entityType = 'tutor'
}) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const questionMarkRef = useRef<HTMLButtonElement>(null);

    // Only show question mark for department entities and if we have a description
    const showQuestionMark = entityType === 'department' &&
        category in DEPARTMENT_RATING_DESCRIPTIONS;

    const toggleTooltip = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsTooltipVisible(!isTooltipVisible);
    };

    // Close tooltip when clicking outside
    useEffect(() => {
        if (!isTooltipVisible) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (questionMarkRef.current && !questionMarkRef.current.contains(event.target as Node)) {
                setIsTooltipVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isTooltipVisible]);

    return (
        <div className="flex items-center">
            <span>{category}</span>
            {showQuestionMark && (
                <div className="relative inline-flex items-center">
                    <button
                        ref={questionMarkRef}
                        onClick={toggleTooltip}
                        className="ml-1.5 flex items-center justify-center focus:outline-none"
                        style={{
                            color: 'var(--tgui--accent_text_color)',
                        }}
                        aria-label="Show category explanation"
                    >
                        <Icon20Questionmark />
                    </button>

                    {isTooltipVisible && (
                        <Tooltip
                            targetRef={questionMarkRef}
                            mode="dark"
                            placement="top-start"
                            withArrow
                            offsetByMainAxis={8}
                            offsetByCrossAxis={-10}
                        >
                            {DEPARTMENT_RATING_DESCRIPTIONS[category]}
                        </Tooltip>
                    )}
                </div>
            )}
        </div>
    );
};
