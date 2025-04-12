import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '@/components/Page';
import {
    List,
    Cell,
    Image,
    Button,
    Title,
    Section,
    Divider,
    Badge,
} from '@telegram-apps/telegram-ui';
import { Icon24Discussion_fill } from '@/icons/24/discussion_fill';
import { Icon24Group } from '@/icons/24/group';
import { Icon20Copy } from '@/icons/20/copy';
import { Icon20Check } from '@/icons/20/check';
import { Icon24Calendar } from '@/icons/24/calendar';
import { Icon24Pin } from '@/icons/24/pin';
import { copyTextToClipboard } from '@telegram-apps/sdk-react';

import { CustomCell } from '@/components/layout/CustomCell';
import { clubService } from '@/services/clubService';
import { Club } from '@/types/club';
import { shareURL } from '@telegram-apps/sdk-react';
import { getTelegramShareableUrl } from '@/config/appConfig';
import { useScrollManager } from '@/hooks/useScrollManager';
import {
    EntityLoadingIndicator,
    EntityError,
    ActionButtons
} from '@/components/layout/SharedEntityComponents';
import { Icon24Channel_fill } from '@/icons/24/channel_fill';
import { Icon16Person } from '@/icons/16/person';

export const ClubPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Track which field was recently copied
    const [copiedField, setCopiedField] = useState<'email' | 'telegram' | null>(null);

    // Use scroll manager hook for smooth transitions
    const { saveScrollPosition } = useScrollManager({ element: contentRef });

    // Copy text to clipboard and show feedback
    const handleCopy = async (text: string, field: 'email' | 'telegram') => {
        try {
            await copyTextToClipboard(text);
            setCopiedField(field);

            // Reset after 2 seconds
            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    // Fetch club data
    const fetchClub = async () => {
        try {
            if (!id) throw new Error('No club ID provided');

            const clubId = parseInt(id, 10);
            if (isNaN(clubId)) throw new Error('Invalid club ID');

            setLoading(true);
            const fetchedClub = await clubService.getClubById(clubId);

            if (!fetchedClub) throw new Error(`Club with ID ${id} not found`);

            setClub(fetchedClub);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClub();
    }, [id]);

    // Action handlers
    const handleDiscussClick = () => {
        if (club?.contactInfo?.telegramLink) {
            window.open(club.contactInfo.telegramLink, '_blank');
        } else {
            console.log(`No Telegram link for club ${id}`);
        }
    };

    const handleJoinClick = () => {
        console.log(`Join club ${id}`);
        // In a real app, this would handle the join functionality
    };

    // Handle share button click
    const handleShare = () => {
        if (!club) return;

        if (shareURL.isAvailable()) {
            const shareLink = getTelegramShareableUrl(`/club/${club.id}`);
            const shareMessage = `\n${club.name}`;

            shareURL(shareLink, shareMessage);
        } else {
            console.log('Sharing is not available in this environment');
        }
    };

    // Loading state
    if (loading) {
        return (
            <Page back={true}>
                <EntityLoadingIndicator />
            </Page>
        );
    }

    // Error state
    if (error || !club) {
        return (
            <Page back={true}>
                <EntityError error={error} onRetry={fetchClub} />
            </Page>
        );
    }

    return (
        <Page back={true}>
            <div ref={contentRef}>
                <List>
                    {/* Club header with name and description */}
                    <div className="entity-page-non-interactive">
                        <Cell
                            className="-mx-2 entity-page-non-interactive"
                            subtitle={club.description}
                            multiline
                            after={
                                <Image
                                    size={60}
                                    src={`/assets/circles/${club.imageFileName}`}
                                    style={{ backgroundColor: 'var(--tgui--section_bg_color)' }}
                                    fallbackIcon={<Icon24Group />}
                                />
                            }
                        >
                            <Title weight="1">
                                {club.name}
                            </Title>
                        </Cell>
                    </div>

                    {/* Member count and action buttons */}
                    <Section>
                        <div className="entity-page-non-interactive" style={{ position: 'relative' }}>
                            <CustomCell
                                className="entity-page-non-interactive"
                                subhead="Организатор"
                                rightSubhead="Участников"
                                after={
                                    <div className="flex items-center">
                                        <Icon16Person
                                            style={{
                                                marginRight: '4px',
                                                color: 'var(--tgui--accent_text_color)'
                                            }}
                                        />
                                        <span
                                            style={{
                                                color: 'var(--tgui--accent_text_color)',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {club.memberCount}
                                        </span>
                                    </div>
                                }
                            >
                                <Title level="3" weight="1">
                                    {club.organizer}
                                </Title>
                            </CustomCell>

                            {/* Action buttons */}
                            <ActionButtons
                                primaryAction={{
                                    label: "Обсудить",
                                    icon: <Icon24Discussion_fill />,
                                    onClick: handleDiscussClick
                                }}
                                secondaryAction={{
                                    label: "Вступить",
                                    icon: <Icon24Channel_fill />,
                                    onClick: handleJoinClick
                                }}
                            />
                        </div>
                    </Section>

                    {/* Meeting Information */}
                    {(club.meetingSchedule || club.location) && (
                        <Section header="Информация о встречах">
                            {club.meetingSchedule && (
                                <Cell
                                    before={<Icon24Calendar />}
                                    description="Расписание встреч"
                                >
                                    {club.meetingSchedule}
                                </Cell>
                            )}

                            {club.meetingSchedule && club.location && <Divider />}

                            {club.location && (
                                <Cell
                                    before={<Icon24Pin />}
                                    description="Место проведения"
                                >
                                    {club.location}
                                </Cell>
                            )}
                        </Section>
                    )}

                    {/* Club Type */}
                    {club.type && (
                        <Section header="Тип клуба">
                            <Cell>
                                <Badge mode="primary">
                                    {club.type}
                                </Badge>
                            </Cell>
                        </Section>
                    )}

                    {/* Contact Information */}
                    {(club.contactInfo?.email || club.contactInfo?.telegramLink) && (
                        <Section header="Контактная информация">
                            {club.contactInfo?.email && (
                                <>
                                    <Cell
                                        subhead="Email:"
                                        className="contact-info-value"
                                        after={
                                            copiedField === 'email' ? (
                                                <Icon20Check
                                                    style={{ color: `var(--tgui--accent_text_color)` }}
                                                />
                                            ) : (
                                                <Icon20Copy
                                                    style={{ color: `var(--tgui--subtitle_text_color)` }}
                                                />
                                            )
                                        }
                                        multiline
                                        onClick={() => handleCopy(club.contactInfo?.email || '', 'email')}
                                    >
                                        {club.contactInfo.email}
                                    </Cell>
                                    {club.contactInfo?.telegramLink && <Divider />}
                                </>
                            )}

                            {club.contactInfo?.telegramLink && (
                                <Cell
                                    subhead="Telegram:"
                                    className="contact-info-value"
                                    after={
                                        copiedField === 'telegram' ? (
                                            <Icon20Check
                                                style={{ color: `var(--tgui--accent_text_color)` }}
                                            />
                                        ) : (
                                            <Icon20Copy
                                                style={{ color: `var(--tgui--subtitle_text_color)` }}
                                            />
                                        )
                                    }
                                    multiline
                                    onClick={() => handleCopy(club.contactInfo?.telegramLink || '', 'telegram')}
                                >
                                    {club.contactInfo.telegramLink}
                                </Cell>
                            )}
                        </Section>
                    )}

                    <Button
                        className="w-full mb-6"
                        mode="plain"
                        size="m"
                        onClick={handleShare}
                    >
                        Поделиться
                    </Button>
                </List>
            </div>
        </Page>
    );
};

export default ClubPage;
