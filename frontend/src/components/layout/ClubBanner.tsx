import React, { useState, useRef, useEffect } from 'react';
import { Section, Image, Chip, Button, Text, Caption, Cell, Subheadline } from '@telegram-apps/telegram-ui';
import { Tappable } from '@telegram-apps/telegram-ui/dist/components/Service/Tappable/Tappable';
import { Icon24Chevron_down } from '@/icons/24/chevron_down';

interface ClubBannerProps {
    title: string;
    description: string;
    imageSrc: string;
    tags?: string[];
    onNavigate?: () => void;
    buttonText?: string;
}

export const ClubBanner: React.FC<ClubBannerProps> = ({
    title,
    description,
    imageSrc,
    tags = [],
    onNavigate,
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

    return (
        <Section className="overflow-hidden">
            <div onClick={handleToggle} className="block cursor-pointer">
                <div className="p-4 transition-all duration-300 ease-in-out">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                            <div className='mb-0.25'>
                                <Text weight="2">
                                    {title}
                                </Text>
                            </div>
                            <div
                                ref={descriptionRef}
                                className="leading-2 overflow-hidden transition-all duration-300 ease-in-out relative"
                                style={{
                                    maxHeight: `${descriptionHeight}px`,
                                    color: 'var(--tgui--hint_color)'
                                }}
                            >
                                <Caption level="1" weight="3">
                                    {description}
                                </Caption>
                                <div
                                    className="absolute right-0 top-0 h-4 w-32 pointer-events-none transition-opacity duration-300 ease-in-out"
                                    style={{
                                        background: 'linear-gradient(to right, transparent, var(--tgui--section_bg_color, white))',
                                        opacity: expanded ? 0 : 1
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <Image size={40} src={imageSrc} style={{ borderRadius: '4px' }} />
                        </div>
                    </div>

                    <div className="mt-3 relative">
                        <div className="flex flex-wrap gap-2 pr-10 relative">
                            {tags.map((tag, index) => (
                                <Chip key={index} mode="outline">
                                    <Subheadline level="2" weight="3">
                                        {tag}
                                    </Subheadline>
                                </Chip>
                            ))}
                            <div
                                className="absolute right-0 bottom-0 transform transition-transform duration-300 ease-in-out"
                                style={{
                                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    marginBottom: '6px',
                                    marginRight: '8px',
                                }}
                            >
                                <Icon24Chevron_down color='var(--tg-theme-link-color)' />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="px-4 transition-all duration-300 ease-in-out overflow-hidden"
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
