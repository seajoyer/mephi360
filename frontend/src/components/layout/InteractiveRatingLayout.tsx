import React, { useState, useEffect, useRef } from 'react';
import { Headline, Rating, Button } from '@telegram-apps/telegram-ui';
import { Icon20Star_fill } from '@/icons/20/star_fill';

// Custom Star Icon Container for Rating component
const StarIconContainer = (props) => {
    return <Icon20Star_fill {...props} />;
};

/**
 * A dictionary of rating categories and their values
 */
export type CategoryRatings = {
    [category: string]: number;
};

interface InteractiveRatingLayoutProps {
    // Current ratings displayed to everyone
    categoryRatings: CategoryRatings;
    // User's personal ratings (if they've already rated)
    userRating?: CategoryRatings;
    // Total number of votes
    totalVotes: number;
    // Callback when user saves their rating
    onSaveRating?: (newRating: CategoryRatings) => Promise<void>;
    // Callback when user resets their rating
    onResetRating?: () => Promise<void>;
}

/**
 * InteractiveRatingLayout - An enhanced version of RatingLayout that supports user interaction
 * and rating submission.
 */
export const InteractiveRatingLayout: React.FC<InteractiveRatingLayoutProps> = ({
    categoryRatings,
    userRating,
    totalVotes,
    onSaveRating,
    onResetRating
}) => {
    // State to track temporary rating changes by user
    const [tempRatings, setTempRatings] = useState<CategoryRatings>({});
    // State to track original user ratings for showing on long press
    const [showingMyRatings, setShowingMyRatings] = useState(false);
    // State to track if there are any changes
    const [hasChanges, setHasChanges] = useState(false);
    // State to track saving/resetting progress
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Ref for press and hold timer
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
    // Ref to track if all categories have been rated
    const [allCategoriesRated, setAllCategoriesRated] = useState(false);

    // Reset temp ratings when user rating changes (e.g. component remounts)
    useEffect(() => {
        setTempRatings({});
        setHasChanges(false);
    }, [userRating]);

    // Check if all categories have been rated
    useEffect(() => {
        if (!hasChanges) {
            setAllCategoriesRated(false);
            return;
        }

        const allCategories = Object.keys(categoryRatings);
        const ratedCategories = Object.keys(tempRatings);

        // Check if user has previously rated some categories and combine with temp ratings
        let combinedRatedCategories = [...ratedCategories];
        if (userRating) {
            Object.keys(userRating).forEach(cat => {
                if (!tempRatings[cat]) {
                    combinedRatedCategories.push(cat);
                }
            });
        }

        setAllCategoriesRated(
            allCategories.every(cat =>
                combinedRatedCategories.includes(cat) &&
                (tempRatings[cat] || (userRating && userRating[cat]))
            )
        );
    }, [tempRatings, categoryRatings, userRating, hasChanges]);

    // Handle rating change for a specific category
    const handleRatingChange = (category: string, value: number) => {
        setTempRatings(prev => ({
            ...prev,
            [category]: value
        }));
        setHasChanges(true);
    };

    // Handle save ratings
    const handleSaveRatings = async () => {
        if (onSaveRating && hasChanges) {
            setIsSubmitting(true);
            try {
                // Combine existing user ratings with new temp ratings
                const updatedRatings = {
                    ...(userRating || {}),
                    ...tempRatings
                };
                await onSaveRating(updatedRatings);
                // Reset temporary state after successful save
                setTempRatings({});
                setHasChanges(false);
            } catch (error) {
                console.error('Failed to save ratings:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Handle cancel rating changes
    const handleCancelRatings = () => {
        setTempRatings({});
        setHasChanges(false);
    };

    // Handle reset ratings
    const handleResetRatings = async () => {
        if (onResetRating) {
            setIsSubmitting(true);
            try {
                await onResetRating();
                setTempRatings({});
                setHasChanges(false);
            } catch (error) {
                console.error('Failed to reset ratings:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Handle long press start for "My Ratings" button
    const handleMyRatingsPress = () => {
        longPressTimerRef.current = setTimeout(() => {
            setShowingMyRatings(true);
        }, 300); // 300ms delay for long press
    };

    // Handle release of "My Ratings" button
    const handleMyRatingsRelease = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
        setShowingMyRatings(false);
    };

    // Determine which ratings to display (temp, user's, or global)
    const getRatingToShow = (category: string): number => {
        if (showingMyRatings && userRating && userRating[category]) {
            return userRating[category];
        }
        if (tempRatings[category]) {
            return tempRatings[category];
        }
        return categoryRatings[category];
    };

    return (
        <div className="px-4 pb-2">
            {/* Rating Items */}
            {Object.entries(categoryRatings).map(([category, rating]) => (
                <div key={category} className="mb-3">
                    <div
                        className="text-left mb-1"
                        style={{ color: 'var(--tgui--subtitle_text_color)' }}
                    >
                        {category}
                    </div>

                    <div className="flex -ml-3 items-center justify-between">
                        <Rating
                            max={5}
                            precision={0.5}
                            value={getRatingToShow(category)}
                            onChange={(value) => handleRatingChange(category, value)}
                            className="rating"
                            IconContainer={StarIconContainer}
                        />

                        <Headline
                            weight="1"
                            className="ml-2"
                            style={{ color: 'var(--tgui--link_color)' }}
                        >
                            {getRatingToShow(category).toFixed(1)}
                        </Headline>
                    </div>
                </div>
            ))}

            {/* Action Buttons */}
            {hasChanges ? (
                <div className="flex gap-2 mt-4 animate-fadeIn">
                    <Button
                        mode="outline"
                        size="m"
                        className="flex-1"
                        onClick={handleCancelRatings}
                        disabled={isSubmitting}
                    >
                        Отмена
                    </Button>
                    <Button
                        mode="bezeled"
                        size="m"
                        className="flex-1"
                        onClick={handleSaveRatings}
                        disabled={isSubmitting || !allCategoriesRated}
                    >
                        Сохранить
                    </Button>
                </div>
            ) : userRating ? (
                <div className="flex gap-2 mt-4 animate-fadeIn">
                    <Button
                        mode="outline"
                        size="m"
                        className="flex-1"
                        onMouseDown={handleMyRatingsPress}
                        onMouseUp={handleMyRatingsRelease}
                        onMouseLeave={handleMyRatingsRelease}
                        onTouchStart={handleMyRatingsPress}
                        onTouchEnd={handleMyRatingsRelease}
                        onTouchCancel={handleMyRatingsRelease}
                    >
                        Мой
                    </Button>
                    <Button
                        mode="bezeled"
                        size="m"
                        className="flex-1"
                        onClick={handleResetRatings}
                        disabled={isSubmitting}
                    >
                        Сбросить
                    </Button>
                </div>
            ) : null}

            {/* Add a style for fade-in animation */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
