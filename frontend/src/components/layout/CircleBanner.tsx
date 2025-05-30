import React, { useState, useRef, useEffect } from 'react';
import { Section, Image, Chip, Button, Text, Caption, Subheadline } from '@telegram-apps/telegram-ui';
import { Icon24Chevron_down } from '@/icons/24/chevron_down';

interface CircleBannerProps {
    title: string;
    description: string;
    imageSrc: string;
    tags?: string[];
    onNavigate?: () => void;
    onTagClick?: (tag: string) => void;
    buttonText?: string;
}

export const CircleBanner: React.FC<CircleBannerProps> = ({
    title,
    description,
    imageSrc,
    tags = [],
    onNavigate,
    onTagClick,
    buttonText = 'Перейти'
}) => {
    const [expanded, setExpanded] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const [descriptionHeight, setDescriptionHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (descriptionRef.current) {
            setDescriptionHeight(expanded ? descriptionRef.current.scrollHeight : 18);
        }
    }, [expanded, description]);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    // Handler for tag click
    const handleTagClick = (e: React.MouseEvent, tag: string) => {
        e.stopPropagation(); // Prevent container toggle
        if (onTagClick) {
            onTagClick(tag);
        }
    };

    return (
        <Section className="overflow-hidden">
            <div onClick={handleToggle} className="block cursor-pointer">
                <div className="px-4 py-3 transition-all duration-200 ease-in-out">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                            <div className='mb-0.25'>
                                <Text weight="3">
                                    {title}
                                </Text>
                            </div>
                            <div
                                ref={descriptionRef}
                                className="leading-2 overflow-hidden transition-all duration-200 ease-in-out relative"
                                style={{
                                    maxHeight: `${descriptionHeight}px`,
                                    color: 'var(--tgui--hint_color)'
                                }}
                            >
                                <Caption level="1" weight="3">
                                    {description}
                                </Caption>
                                <div
                                    className="absolute right-0 top-0 h-4 pointer-events-none transition-opacity duration-200 ease-in-out"
                                    style={{
                                        width: '50%',
                                        background: 'linear-gradient(to right, transparent 0%, var(--tgui--section_bg_color, white) 70%)',
                                        opacity: expanded ? 0 : 1
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <Image size={40} src={imageSrc} style={{ borderRadius: '4px' }} />
                        </div>
                    </div>

                    <div className={`relative`}>
                        <div className={`flex ${tags.length != 0 && 'mt-3'} flex-wrap gap-2 pr-10 relative`}>
                            {/* Display only filter values as chips */}
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
                            <div
                                className={`absolute transition-all duration-200 ease-in-out`}
                                style={{
                                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    marginBottom: '6px',
                                    marginRight: '8px',
                                    right:  (tags.length == 0 && !expanded) ? '44px' : 0,
                                    bottom: (tags.length == 0 && !expanded) ? '4px' : 0,
                                }}
                            >
                                <Icon24Chevron_down color='var(--tgui--link_color)' />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="px-4 transition-all duration-200 ease-in-out overflow-hidden"
                    style={{
                        maxHeight: expanded ? '60px' : '0px',
                        opacity: expanded ? 1 : 0,
                        paddingBottom: expanded ? '16px' : '0px',
                        transform: expanded ? 'translateY(0)' : 'translateY(-10px)',
                    }}
                >
                    <Button
                        mode="bezeled"
                        size="m"
                        className="w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) onNavigate();
                        }}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </Section>
    );
}
