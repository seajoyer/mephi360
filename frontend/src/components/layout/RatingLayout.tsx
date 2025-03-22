import React, { useState, useEffect } from 'react';
import { Headline, Button, List } from '@telegram-apps/telegram-ui';
import { CustomRating } from './CustomRating';
import { RatingCategoryWithTooltip } from './RatingCategoryWithTooltip';
import { TUTOR_RATING_CATEGORIES } from '@/constants/ratingConstants';

// Non-editable categories for department ratings
const NON_EDITABLE_DEPARTMENT_CATEGORIES = [
    "Качество преподавания",
    "«Халявность»"
];

// Types for rating data
interface UserRating {
    [category: string]: number;
}

interface RatingLayoutProps {
    tutorId: number; // Used as entity ID (can be tutor ID or department ID)
    categoryRatings: { [key: string]: number };
    totalRaters: number;
    onRatingChange?: (hasRated: boolean, newRatings?: UserRating) => void;
    categories?: string[]; // Optional prop to override default categories
    entityType?: 'tutor' | 'department'; // To differentiate storage keys
}

// Mock storage functions - in a real app these would interact with API
const getStorageKey = (entityType: string, entityId: number): string => {
    return `user-rating-${entityType}-${entityId}`;
};

const saveUserRating = (entityType: string, entityId: number, ratings: UserRating): void => {
    localStorage.setItem(getStorageKey(entityType, entityId), JSON.stringify(ratings));
};

const getUserRating = (entityType: string, entityId: number): UserRating | null => {
    const stored = localStorage.getItem(getStorageKey(entityType, entityId));
    return stored ? JSON.parse(stored) : null;
};

const deleteUserRating = (entityType: string, entityId: number): void => {
    localStorage.removeItem(getStorageKey(entityType, entityId));
};

export const RatingLayout: React.FC<RatingLayoutProps> = ({
    tutorId,
    categoryRatings,
    totalRaters,
    onRatingChange,
    categories = TUTOR_RATING_CATEGORIES, // Default to tutor categories if not specified
    entityType = 'tutor' // Default to 'tutor' if not specified
}) => {
    // Rating state
    const [isRatingMode, setIsRatingMode] = useState(false);
    const [userRatings, setUserRatings] = useState<UserRating>({});
    const [hasUserRated, setHasUserRated] = useState(false);
    const [showingUserRating, setShowingUserRating] = useState(false);
    const [storedUserRatings, setStoredUserRatings] = useState<UserRating | null>(null);
    const [displayRatings, setDisplayRatings] = useState<{ [key: string]: number }>({});

    // Initialize display ratings based on available data
    useEffect(() => {
        const ratings: { [key: string]: number } = {};

        // Map each category to its rating (if available) or default to 0
        categories.forEach(category => {
            ratings[category] = categoryRatings[category] || 0;
        });

        setDisplayRatings(ratings);
    }, [categoryRatings, categories]);

    // Check if all editable categories have been rated
    const allCategoriesRated = categories.every(
        category => {
            // Skip checking non-editable categories for departments
            if (entityType === 'department' && NON_EDITABLE_DEPARTMENT_CATEGORIES.includes(category)) {
                return true;
            }
            return userRatings[category] !== undefined;
        }
    );

    // Load user's previous rating if exists
    useEffect(() => {
        const savedRating = getUserRating(entityType, tutorId);
        if (savedRating) {
            setStoredUserRatings(savedRating);
            setHasUserRated(true);
        }
    }, [tutorId, entityType]);

    // Start rating process
    const handleStartRating = () => {
        setIsRatingMode(true);

        // Initialize with existing ratings for non-editable categories
        if (entityType === 'department') {
            const initialRatings: UserRating = {};
            NON_EDITABLE_DEPARTMENT_CATEGORIES.forEach(category => {
                initialRatings[category] = displayRatings[category] || 0;
            });
            setUserRatings(initialRatings);
        } else {
            setUserRatings({});
        }
    };

    // Cancel rating
    const handleCancelRating = () => {
        setIsRatingMode(false);
        setUserRatings({});
    };

    // Calculate updated rating based on user's rating
    const calculateUpdatedRating = (
        oldRating: number,
        totalRaters: number,
        newRating: number,
        isAdding: boolean
    ): number => {
        if (isAdding) {
            // Adding a new rating
            return ((oldRating * totalRaters) + newRating) / (totalRaters + 1);
        } else {
            // Removing a rating
            return totalRaters <= 1
                ? 0
                : ((oldRating * totalRaters) - newRating) / (totalRaters - 1);
        }
    };

    // Save rating
    const handleSaveRating = () => {
        if (!allCategoriesRated) return;

        // For departments, make sure we're not modifying the non-editable categories
        let ratingsToSave: UserRating = {...userRatings};

        if (entityType === 'department') {
            // Remove non-editable categories before saving to localStorage
            NON_EDITABLE_DEPARTMENT_CATEGORIES.forEach(category => {
                delete ratingsToSave[category];
            });
        }

        saveUserRating(entityType, tutorId, ratingsToSave);
        setStoredUserRatings(ratingsToSave);
        setHasUserRated(true);

        // Calculate updated global ratings
        const updatedRatings = { ...displayRatings };
        for (const category of categories) {
            // Skip non-editable categories for departments
            if (entityType === 'department' && NON_EDITABLE_DEPARTMENT_CATEGORIES.includes(category)) {
                continue;
            }

            if (userRatings[category]) {
                updatedRatings[category] = calculateUpdatedRating(
                    displayRatings[category] || 0,
                    totalRaters,
                    userRatings[category],
                    true
                );
            }
        }

        setDisplayRatings(updatedRatings);
        setIsRatingMode(false);

        // Notify parent component if this is a new rating
        if (onRatingChange) {
            onRatingChange(true, ratingsToSave);
        }
    };

    // Reset rating
    const handleResetRating = () => {
        if (!storedUserRatings) return;

        // Calculate updated global ratings after removing user's rating
        const updatedRatings = { ...displayRatings };
        for (const category of categories) {
            // Skip non-editable categories for departments
            if (entityType === 'department' && NON_EDITABLE_DEPARTMENT_CATEGORIES.includes(category)) {
                continue;
            }

            if (storedUserRatings[category]) {
                updatedRatings[category] = calculateUpdatedRating(
                    displayRatings[category] || 0,
                    totalRaters,
                    storedUserRatings[category],
                    false
                );
            }
        }

        setDisplayRatings(updatedRatings);
        deleteUserRating(entityType, tutorId);
        setStoredUserRatings(null);
        setHasUserRated(false);

        // Notify parent component
        if (onRatingChange) {
            onRatingChange(false, storedUserRatings);
        }
    };

    // Handle rating change for a specific category
    const handleRatingChange = (category: string, value: number) => {
        setUserRatings(prev => ({
            ...prev,
            [category]: value
        }));
    };

    // Check if a category is non-editable for the current entity type
    const isNonEditableCategory = (category: string): boolean => {
        return entityType === 'department' && NON_EDITABLE_DEPARTMENT_CATEGORIES.includes(category);
    };

    return (
        <div>
            {categories.map(category => {
                const nonEditable = isNonEditableCategory(category);

                return (
                <div key={category} className="mb-4">
                    {/* Category name with tooltip */}
                    <div
                        className="text-left"
                        style={{
                            color: nonEditable && isRatingMode
                                ? 'var(--tgui--subtitle_text_color)'
                                : 'var(--tgui--subtitle_text_color)'
                        }}
                    >
                        <RatingCategoryWithTooltip
                            category={category}
                            entityType={entityType}
                        />

                    </div>

                    {/* Rating display row */}
                    <div className="flex mt-1 items-center justify-between">
                        <CustomRating
                            value={
                                isRatingMode && !nonEditable
                                    ? userRatings[category] || 0  // Empty or set value in rating mode
                                    : showingUserRating && storedUserRatings && !nonEditable
                                        ? storedUserRatings[category] || 0  // User's rating when showing
                                        : displayRatings[category] || 0  // Default global rating
                            }
                            onChange={(value) => {
                                if (!nonEditable) handleRatingChange(category, value);
                            }}
                            isActive={isRatingMode && !nonEditable}
                            precision={1}
                            initialEmpty={isRatingMode && !nonEditable && !userRatings[category]}
                            disabled={(nonEditable && isRatingMode) || (nonEditable && showingUserRating)}
                        />

                        <Headline
                            weight="1"
                            className="transition-colors duration-200 ml-2"
                            style={{
                                color: (nonEditable && isRatingMode) || (nonEditable && showingUserRating)
                                    ? 'var(--tgui--subtitle_text_color)'
                                    : 'var(--tgui--link_color)'
                            }}
                        >
                            {(isRatingMode && !nonEditable
                                ? userRatings[category] || 0
                                : showingUserRating && storedUserRatings && !nonEditable
                                    ? storedUserRatings[category] || 0
                                    : displayRatings[category] || 0
                            ).toFixed(1)}
                        </Headline>
                    </div>
                </div>
            )})}

            {/* Bottom buttons - transitions between states */}
            <div className="mt-6 transition-all duration-200">
                {!isRatingMode && !hasUserRated && (
                    <Button
                        onClick={handleStartRating}
                        mode="bezeled"
                        size="m"
                        className="w-full"
                    >
                        Оценить
                    </Button>
                )}

                {isRatingMode && (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleCancelRating}
                            mode="plain"
                            size="m"
                            className="flex-1"
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSaveRating}
                            mode="bezeled"
                            size="m"
                            className="flex-1"
                            disabled={!allCategoriesRated}
                        >
                            Сохранить
                        </Button>
                    </div>
                )}

                {!isRatingMode && hasUserRated && (
                    <div className="flex gap-2">
                        <Button
                            onMouseDown={() => setShowingUserRating(true)}
                            onMouseUp={() => setShowingUserRating(false)}
                            onMouseLeave={() => setShowingUserRating(false)}
                            onTouchStart={() => setShowingUserRating(true)}
                            onTouchEnd={() => setShowingUserRating(false)}
                            mode="bezeled"
                            size="m"
                            className="flex-1"
                        >
                            Моя оценка
                        </Button>
                        <Button
                            onClick={handleResetRating}
                            mode="plain"
                            size="m"
                            className="flex-1"
                        >
                            Сбросить
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
