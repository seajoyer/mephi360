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
    Select,
    Textarea,
} from '@telegram-apps/telegram-ui';
import { Icon24Discussion_fill } from '@/icons/24/discussion_fill';
import { Icon24Addhome } from '@/icons/24/addhome';
import { Icon20Copy } from '@/icons/20/copy';
import { Icon20Check } from '@/icons/20/check';
import { copyTextToClipboard } from '@telegram-apps/sdk-react';

import { CustomCell } from '@/components/layout/CustomCell';
import { departmentService } from '@/services/departmentService';
import { Department } from '@/types/department';
import { shareURL } from '@telegram-apps/sdk-react';
import { getTelegramShareableUrl } from '@/config/appConfig';
import { useScrollManager } from '@/hooks/useScrollManager';
import { DEPARTMENT_RATING_CATEGORIES } from '@/constants/ratingConstants';
import {
    EntityLoadingIndicator,
    EntityError,
    RatingDisplay,
    RatingAccordion,
    StaffAccordion,
    ActionButtons
} from '@/components/layout/SharedEntityComponents';
import { Icon24Channel_fill } from '@/icons/24/channel_fill';
import { Icon24Plus } from '@/icons/24/plus';
import { Icon20Questionmark } from '@/icons/20/questionmark';

// Calculate average rating across all categories
const calculateMeanRating = (categoryRatings: { [key: string]: number }): number => {
    const values = Object.values(categoryRatings);
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
};

export const DepartmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [department, setDepartment] = useState<Department | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Track which field was recently copied
    const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

    // Use scroll manager hook for smooth accordion transitions
    const { saveScrollPosition } = useScrollManager({ element: contentRef });

    // State for accordions
    const [expandedAccordions, setExpandedAccordions] = useState({
        ratings: false,
        staff: false
    });

    // Copy text to clipboard and show feedback
    const handleCopy = async (text: string, field: 'email' | 'phone') => {
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

    // Fetch department data
    const fetchDepartment = async () => {
        try {
            if (!id) throw new Error('No department ID provided');

            const departmentId = parseInt(id, 10);
            if (isNaN(departmentId)) throw new Error('Invalid department ID');

            setLoading(true);
            const fetchedDepartment = await departmentService.getDepartmentById(departmentId);

            if (!fetchedDepartment) throw new Error(`Department with ID ${id} not found`);

            setDepartment(fetchedDepartment);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, [id]);

    // Toggle accordion expanded state
    const toggleAccordion = (accordionName: keyof typeof expandedAccordions) => {
        // Save scroll position before state change
        saveScrollPosition();

        setExpandedAccordions(prev => ({
            ...prev,
            [accordionName]: !prev[accordionName]
        }));
    };

    // Handle rating change
    const handleRatingChange = (hasRated: boolean, userRatings?: { [key: string]: number }) => {
        if (!department || !userRatings) return;

        // Save scroll position before updating
        saveScrollPosition();

        // Update category ratings (this would normally save to backend)
        const updatedCategoryRatings = { ...department.ratings.categoryRatings };
        const oldTotalRaters = department.ratings.totalRaters;

        // Update ratings for each category
        for (const category of DEPARTMENT_RATING_CATEGORIES) {
            if (category in userRatings) {
                const rating = userRatings[category];
                if (hasRated) {
                    // Adding a rating - update each category's weighted average
                    updatedCategoryRatings[category] = ((updatedCategoryRatings[category] || 0) * oldTotalRaters + rating) / (oldTotalRaters + 1);
                } else {
                    // Removing a rating - reverse the weighted average calculation
                    updatedCategoryRatings[category] = oldTotalRaters <= 1
                        ? 0
                        : ((updatedCategoryRatings[category] || 0) * oldTotalRaters - rating) / (oldTotalRaters - 1);
                }
            }
        }

        // Calculate overall rating as the mean of all category ratings
        const newOverallRating = calculateMeanRating(updatedCategoryRatings);

        // Update department state with new ratings
        setDepartment({
            ...department,
            ratings: {
                ...department.ratings,
                overallRating: newOverallRating,
                categoryRatings: updatedCategoryRatings,
                totalRaters: department.ratings.totalRaters + (hasRated ? 1 : -1)
            }
        });
    };

    // Action handlers
    const handleReviewsClick = () => {
        console.log(`Navigate to reviews for department ${id}`);
    };

    const handleWebsiteClick = () => {
        console.log(`Navigate to website for department ${id}`);
    };

    const handleStaffClick = () => {
        console.log(`Navigate to all staff for department ${id}`);
    };

    // Handle share button click
    const handleShare = () => {
        if (!department) return;

        if (shareURL.isAvailable()) {
            const shareLink = getTelegramShareableUrl(`/department/${department.id}`);
            const shareMessage = `\nКафедра ${department.number} | ${department.name}`;

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
    if (error || !department) {
        return (
            <Page back={true}>
                <EntityError error={error} onRetry={fetchDepartment} />
            </Page>
        );
    }

    return (
        <Page back={true}>
            <div ref={contentRef}>
                <List>
                    {/* Department header with number and full name */}
                    <div className="entity-page-non-interactive">
                        <Cell
                            className="-mx-2 entity-page-non-interactive"
                        >
                            <Title weight="1">
                                Добавить
                            </Title>
                        </Cell>
                    </div>

                    <Select
                    >
                        <option>Преподавателя</option>
                        <option>Кафедру</option>
                        <option>Кружок</option>
                    </Select>

                    <Section
                        header="ФИО"
                    >
                        <Textarea
                            placeholder="Иванов Иван Иванович"
                        />
                    </Section>

                    <Section
                        header="Кафедра"
                    >
                        <Select
                        >
                            <option>№1</option>
                            <option>№2</option>
                            <option>№3</option>
                            <option>№4</option>
                            <option>№5</option>
                            <option>№6</option>
                            <option>№7</option>
                            <option>№8</option>
                            <option>№9</option>
                        </Select>
                    </Section>

                    <Section
                        header="Подтверждающая ссылка"
                    >
                        <Textarea
                            placeholder="home.mephi.ru/..."
                        />
                    </Section>
                </List>
            </div>
        </Page>
    );
};

export default DepartmentPage;
