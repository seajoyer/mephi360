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
    Headline,
    Divider,
    Accordion,
} from '@telegram-apps/telegram-ui';
import { Icon20Star_fill } from '@/icons/20/star_fill';
import { Icon24Discussion_fill } from '@/icons/24/discussion_fill';
import { Icon24Goto_fill } from '@/icons/24/goto_fill';
import { Icon24Addhome } from '@/icons/24/addhome';
import { CustomCell } from '@/components/layout/CustomCell';
import { departmentService } from '@/services/departmentService';
import { Department } from '@/types/department';
import { shareURL } from '@telegram-apps/sdk-react';
import { getTelegramShareableUrl } from '@/config/appConfig';
import { useScrollManager } from '@/hooks/useScrollManager';
import { AccordionSummary } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary';
import { AccordionContent } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent';

import { DEPARTMENT_RATING_CATEGORIES } from '@/constants/departmentConstants';

// Custom rating layout for departments that uses our specific categories
const DepartmentRatingLayout: React.FC<{
    departmentId: number;
    categoryRatings: { [key: string]: number };
    totalRaters: number;
    onRatingChange?: (hasRated: boolean, newRatings?: { [key: string]: number }) => void;
}> = ({ departmentId, categoryRatings, totalRaters, onRatingChange }) => {
    // We'll repurpose the RatingLayout component but with our department categories
    return (
        <div className='px-4 pb-3'>
            {DEPARTMENT_RATING_CATEGORIES.map(category => (
                <div key={category} className="mb-4">
                    {/* Category name */}
                    <div
                        className="text-left"
                        style={{ color: 'var(--tgui--subtitle_text_color)' }}
                    >
                        {category}
                    </div>

                    {/* Rating display row */}
                    <div className="flex mt-1 -ml-0.25 items-center justify-between">
                        {/* Here we would use the CustomRating component similar to RatingLayout */}
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                                <div key={star} style={{ color: star <= Math.round(categoryRatings[category] || 0) ? 'var(--tgui--link_color)' : 'var(--tgui--tertiary_bg_color)' }}>
                                    <Icon20Star_fill />
                                </div>
                            ))}
                        </div>

                        <Headline
                            weight="1"
                            className="transition-colors duration-200 ml-2"
                            style={{ color: 'var(--tgui--link_color)' }}
                        >
                            {(categoryRatings[category] || 0).toFixed(1)}
                        </Headline>
                    </div>
                </div>
            ))}

            {/* Rating action buttons would go here similar to RatingLayout */}
            <div className="mt-6 transition-all duration-200">
                <Button
                    onClick={() => {}}
                    mode="bezeled"
                    size="m"
                    className="w-full"
                >
                    Оценить
                </Button>
            </div>
        </div>
    );
};

export const DepartmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [department, setDepartment] = useState<Department | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Use our scroll manager hook for smooth accordion transitions
    const { scrollPosition, saveScrollPosition } =
        useScrollManager({ element: contentRef });

    // State for accordions
    const [expandedAccordions, setExpandedAccordions] = useState<{
        ratings: boolean;
        staff: boolean;
        courses: boolean;
        research: boolean;
    }>({
        ratings: false,
        staff: false,
        courses: false,
        research: false
    });

    // Calculate average rating across all categories
    const calculateMeanRating = (categoryRatings: { [key: string]: number }): number => {
        const values = Object.values(categoryRatings);
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
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

    const handleStaffClick = () => {
        console.log(`Navigate to staff for department ${id}`);
    };

    const handleCoursesClick = () => {
        console.log(`Navigate to courses for department ${id}`);
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
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full" />
                </div>
            </Page>
        );
    }

    // Error state
    if (error || !department) {
        return (
            <Page back={true}>
                <div className="p-4 text-center">
                    <div className="text-red-500 mb-2">{error || 'Failed to load department data'}</div>
                    <Button mode="bezeled" size="m" onClick={() => fetchDepartment()}>
                        Retry
                    </Button>
                </div>
            </Page>
        );
    }

    return (
        <Page back={true}>
            <div ref={contentRef}>
                <List>
                    {/* Department header with number and full name */}
                    <div className="department-page-non-interactive">
                        <Cell
                            className="-mx-2 department-page-non-interactive"
                            subtitle={department.name}
                            multiline
                            after={
                                <Image
                                    size={60}
                                    src={`/assets/departments/${department.imageFileName}`}
                                    style={{ backgroundColor: 'var(--tgui--section_bg_color)' }}
                                    fallbackIcon={<Icon24Addhome />}
                                />
                            }
                        >
                            <Title weight="1">
                                Кафедра {department.number}
                            </Title>
                        </Cell>
                    </div>

                    {/* Rating and department head */}
                    <Section>
                        <div className="department-page-non-interactive" style={{ position: 'relative' }}>
                            <CustomCell
                                className="department-page-non-interactive"
                                subhead="Штаб"
                                rightSubhead="Рейтинг"
                                after={
                                    <Headline
                                        className="department-page-rating"
                                        weight="1"
                                    >
                                        {department.ratings.overallRating.toFixed(1)}
                                        <div className="department-page-rating-icon">
                                            <Icon20Star_fill />
                                        </div>
                                    </Headline>
                                }
                            >
                                <Headline weight="1">
                                    {department.contactInfo?.location}
                                </Headline>
                            </CustomCell>

                            {/* Action buttons */}
                            <div className="department-page-button-container">
                                <Button
                                    className="department-page-action-button"
                                    before={<Icon24Discussion_fill />}
                                    mode="bezeled"
                                    size="m"
                                    onClick={handleReviewsClick}
                                >
                                    Отзывы
                                </Button>
                                <Button
                                    className="department-page-action-button"
                                    before={<Icon24Goto_fill />}
                                    mode="bezeled"
                                    size="m"
                                    onClick={handleStaffClick}
                                >
                                    Сайт
                                </Button>
                            </div>
                        </div>
                    </Section>

                    {/* Ratings section with department-specific categories */}
                    <Section className="department-page-smooth-accordion">
                        <Accordion
                            id="ratings"
                            expanded={expandedAccordions.ratings}
                            onChange={() => toggleAccordion('ratings')}
                            className="department-page-smooth-accordion"
                        >
                            <AccordionSummary>
                                {`Оценки (${department.ratings.totalRaters})`}
                            </AccordionSummary>
                            <AccordionContent>
                                <DepartmentRatingLayout
                                    departmentId={department.id}
                                    categoryRatings={department.ratings.categoryRatings}
                                    totalRaters={department.ratings.totalRaters}
                                    onRatingChange={handleRatingChange}
                                />
                            </AccordionContent>
                        </Accordion>

                        <Divider />

                        {/* Staff listing */}
                        <Accordion
                            id="staff"
                            expanded={expandedAccordions.staff}
                            onChange={() => toggleAccordion('staff')}
                            className="department-page-smooth-accordion"
                        >
                            <AccordionSummary>
                                Преподаватели кафедры
                            </AccordionSummary>
                            <AccordionContent>
                                <List className="department-page-accordion-content">
                                    {department.staff?.slice(0, 3).map((staffMember, index) => (
                                        <React.Fragment key={staffMember.id}>
                                            <Cell
                                                subtitle={staffMember.position}
                                            >
                                                {staffMember.name}
                                            </Cell>
                                            {index < (department.staff?.slice(0, 3).length || 0) - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}

                                    <div className="mt-3 px-4 pb-2">
                                        <Button
                                            mode="bezeled"
                                            size="m"
                                            className="w-full"
                                            onClick={handleStaffClick}
                                        >
                                            Показать всех преподавателей
                                        </Button>
                                    </div>
                                </List>
                            </AccordionContent>
                        </Accordion>
                    </Section>

                    {/* Contact Information */}
                    <Section header="Контактная информация">
                        {department.contactInfo?.location && (
                            <Cell
                                subhead="Telegram:"
                            >
                                -
                            </Cell>
                        )}

                        <Divider />

                        {department.contactInfo?.email && (
                            <Cell
                                subhead="Email:"
                            >
                                {department.contactInfo.email}
                            </Cell>
                        )}

                        <Divider />

                        {department.contactInfo?.phone && (
                            <Cell
                                subhead="Телефон:"
                            >
                                {department.contactInfo.phone}
                            </Cell>
                        )}
                    </Section>

                    {/* <Section header="Контактная информация">
                        <div className="px-4 py-3">
                            {department.contactInfo?.location && (
                                <div className="mb-2">
                                    <div className="text-xs" style={{ color: 'var(--tgui--hint_color)' }}>
                                        Штаб:
                                    </div>
                                    <div className="text-sm">{department.contactInfo.location}</div>
                                </div>
                            )}

                            {department.contactInfo?.email && (
                                <div className="mb-2">
                                    <div className="text-xs" style={{ color: 'var(--tgui--hint_color)' }}>
                                        Email:
                                    </div>
                                    <div className="text-sm">{department.contactInfo.email}</div>
                                </div>
                            )}

                            {department.contactInfo?.phone && (
                                <div>
                                    <div className="text-xs" style={{ color: 'var(--tgui--hint_color)' }}>
                                        Телефон:
                                    </div>
                                    <div className="text-sm">{department.contactInfo.phone}</div>
                                </div>
                            )}
                        </div>
                    </Section> */}

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

export default DepartmentPage;
