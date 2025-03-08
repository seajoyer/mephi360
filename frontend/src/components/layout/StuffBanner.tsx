import React from 'react';
import { Section, Chip, Tappable, Text, Caption, Subheadline } from '@telegram-apps/telegram-ui';
import { Link } from '@/components/common/Link';

interface StuffBannerProps {
    title: string;
    description: string;
    tags?: string[];
    telegramLink: string; // URL to the telegram message
}

export const StuffBanner: React.FC<StuffBannerProps> = ({
    title,
    description,
    tags = [],
    telegramLink
}) => {
    return (
        <Section className="overflow-hidden">
            <Link to={telegramLink} className="block">
                <Tappable Component="div">
                    <div className="p-4">
                        <div className="flex-1">
                            <div className='mb-1'>
                                <Text weight="2">
                                    <span style={{ color: 'var(--tgui--link_color)' }}>{title}</span>
                                </Text>
                            </div>
                            <div
                                className="leading-normal"
                                style={{ color: 'var(--tgui--hint_color)' }}
                            >
                                <Caption level="1" weight="3">
                                    {description}
                                </Caption>
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                                {/* Display only filter values as chips */}
                                {tags.map((tag, index) => (
                                    <Chip key={index} mode="outline">
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
