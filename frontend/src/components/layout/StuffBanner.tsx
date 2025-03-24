import React from 'react';
import { Section, Chip, Tappable, Text, Caption, Subheadline } from '@telegram-apps/telegram-ui';
import { Link } from '@/components/common/Link';

interface StuffBannerProps {
    title: string;
    description: string;
    tags?: string[];
    telegramLink: string; // URL to the telegram message
    onTagClick?: (tag: string) => void;
}

export const StuffBanner: React.FC<StuffBannerProps> = ({
    title,
    description,
    tags = [],
    telegramLink,
    onTagClick
}) => {
    // Handler for tag click
    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.preventDefault(); // Prevent navigation to telegramLink
        e.stopPropagation(); // Prevent event bubbling
        if (onTagClick) {
            onTagClick(tag);
        }
    };

    return (
        <Section className="overflow-hidden">
            <Link to={telegramLink} className="block">
                <Tappable Component="div">
                    <div className="p-4">
                        <div className="flex-1">
                            <div className='mb-0.25'>
                                <Text weight="2">
                                    <span style={{ color: 'var(--tgui--link_color)' }}>{title}</span>
                                </Text>
                            </div>
                            <div
                                className="leading-2"
                                style={{
                                    color: 'var(--tgui--hint_color)'
                                }}
                            >
                                <Caption level="1" weight="3">
                                    {description}
                                </Caption>
                            </div>
                        </div>

                        <div>
                            <div className="flex mt-3 flex-wrap gap-2">
                                {/* Display tags as chips with click handler */}
                                {tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        mode="outline"
                                        onClick={(e) => handleTagClick(e, tag)}
                                    >
                                        <Subheadline level="2" weight="3">
                                            {tag}
                                        </Subheadline>
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </div>
                </Tappable>
            </Link>
        </Section>
    );
}
