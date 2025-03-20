import React, { useState, useEffect } from 'react';
import { Headline, Button, List } from '@telegram-apps/telegram-ui';
import { CustomRating } from './CustomRating';

// Define standard rating categories that apply to all tutors
export const RATING_CATEGORIES = [
  "Подача материала",
  "«Халявность»",
  "Знания",
  "В общении"
];

// Types for rating data
interface UserRating {
    [category: string]: number;
}

interface RatingLayoutProps {
    tutorId: number;
    categoryRatings: { [key: string]: number };
    totalRaters: number;
    onRatingChange?: (hasRated: boolean, newRatings?: UserRating) => void;
}

// Mock storage functions
const saveUserRating = (tutorId: number, ratings: UserRating): void => {
    localStorage.setItem(`user-rating-${tutorId}`, JSON.stringify(ratings));
};

const getUserRating = (tutorId: number): UserRating | null => {
    const stored = localStorage.getItem(`user-rating-${tutorId}`);
    return stored ? JSON.parse(stored) : null;
};

const deleteUserRating = (tutorId: number): void => {
    localStorage.removeItem(`user-rating-${tutorId}`);
};

// Calculate new weighted average rating
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

export const RatingLayout: React.FC<RatingLayoutProps> = ({
    tutorId,
    categoryRatings,
    totalRaters,
    onRatingChange
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

        // Map each standard category to its rating (if available) or default to 0
        RATING_CATEGORIES.forEach(category => {
            ratings[category] = categoryRatings[category] || 0;
        });

        setDisplayRatings(ratings);
    }, [categoryRatings]);

    // Check if all categories have been rated
    const allCategoriesRated = RATING_CATEGORIES.every(
        category => userRatings[category] !== undefined
    );

    // Load user's previous rating if exists
    useEffect(() => {
        const savedRating = getUserRating(tutorId);
        if (savedRating) {
            setStoredUserRatings(savedRating);
            setHasUserRated(true);
        }
    }, [tutorId]);

    // Start rating process
    const handleStartRating = () => {
        setIsRatingMode(true);
        setUserRatings({});
    };

    // Cancel rating
    const handleCancelRating = () => {
        setIsRatingMode(false);
        setUserRatings({});
    };

    // Save rating
    const handleSaveRating = () => {
        if (!allCategoriesRated) return;

        saveUserRating(tutorId, userRatings);
        setStoredUserRatings(userRatings);
        setHasUserRated(true);

        // Calculate updated global ratings
        const updatedRatings = { ...displayRatings };
        for (const category of RATING_CATEGORIES) {
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
            onRatingChange(true, userRatings);
        }
    };

    // Reset rating
    const handleResetRating = () => {
        if (!storedUserRatings) return;

        // Calculate updated global ratings after removing user's rating
        const updatedRatings = { ...displayRatings };
        for (const category of RATING_CATEGORIES) {
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
        deleteUserRating(tutorId);
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

    return (
        <List>
            {RATING_CATEGORIES.map(category => (
                <div key={category}>
                    {/* Category name */}
                    <div
                        className="text-left"
                        style={{ color: 'var(--tgui--subtitle_text_color)' }}
                    >
                        {category}
                    </div>

                    {/* Rating display row */}
                    <div className="flex mt-1 -ml-0.25 items-center justify-between">
                        <CustomRating
                            value={
                                isRatingMode
                                    ? userRatings[category] || 0  // Empty or set value in rating mode
                                    : showingUserRating && storedUserRatings
                                        ? storedUserRatings[category] || 0  // User's rating when showing
                                        : displayRatings[category] || 0  // Default global rating
                            }
                            onChange={(value) => handleRatingChange(category, value)}
                            isActive={isRatingMode}
                            precision={0.5}
                            initialEmpty={isRatingMode && !userRatings[category]}
                        />

                        <Headline
                            weight="1"
                            className="transition-colors duration-200 ml-2"
                            style={{
                                color: (showingUserRating && storedUserRatings) || isRatingMode
                                    ? 'var(--tgui--link_color)'
                                    : 'var(--tgui--link_color)'
                            }}
                        >
                            {(isRatingMode
                                ? userRatings[category] || 0
                                : showingUserRating && storedUserRatings
                                    ? storedUserRatings[category] || 0
                                    : displayRatings[category] || 0
                            ).toFixed(1)}
                        </Headline>
                    </div>
                </div>
            ))}

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
        </List>
    );
};
