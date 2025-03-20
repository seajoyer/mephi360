import React from 'react';
import { Headline, Rating } from '@telegram-apps/telegram-ui';
import { Icon20Star_fill } from '@/icons/20/star_fill';

// Custom Star Icon Container for Rating component
const StarIconContainer = (props) => {
    return <Icon20Star_fill {...props} />;
};

/**
 * TutorRatingLayout - A component for displaying tutor ratings with categories
 * above the rating stars, properly aligned and styled.
 */
export const RatingLayout = ({ categoryRatings }) => {
    return (
        <div className="px-4">
            {Object.entries(categoryRatings).map(([category, rating]) => (
                <div key={category} className="mb-2">
                    {/* Category name - now on top and left-aligned */}
                    <div className="text-left" style={{ color: 'var(--tgui--subtitle_text_color)' }}>
                        {category}
                    </div>

                    {/* Rating display row */}
                    <div className="flex -ml-3 items-center justify-between">
                        <Rating
                            max={5}
                            precision={0.5}
                            value={rating}
                            className="rating"
                            IconContainer={StarIconContainer}
                        />

                        <Headline
                            weight="1"
                            className="ml-2"
                            style={{ color: 'var(--tgui--link_color)' }}
                        >
                            {rating.toFixed(1)}
                        </Headline>
                    </div>
                </div>
            ))}
        </div>
    );
};
