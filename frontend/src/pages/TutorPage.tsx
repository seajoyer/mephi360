import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '@/components/Page';
import {
    List,
    Cell,
    Image,
    Avatar,
    Button,
    Title,
    Section,
    Headline,
    Divider,
    Accordion,
} from '@telegram-apps/telegram-ui';
import { Icon20Star_fill } from '@/icons/20/star_fill';
import { Icon24Discussion_fill } from '@/icons/24/discussion_fill';
import { Icon24Folder_fill } from '@/icons/24/folder_fill';
import { CustomCell } from '@/components/layout/CustomCell';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';
import { tutorService } from '@/services/tutorService';
import { Tutor } from '@/types/tutor';
import { shareURL } from '@telegram-apps/sdk-react';
import { getTelegramShareableUrl } from '@/config/appConfig';
import { RatingLayout, RATING_CATEGORIES } from '@/components/layout/RatingLayout';
import { useScrollManager } from '@/hooks/useScrollManager';
import { AccordionSummary } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary';
import { AccordionContent } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent';
import { Link } from '@/components/common/Link';
import { Icon12Chevron_right } from '@/icons/12/chevron_right';
import { Icon12Chevron_small_right } from '@/icons/12/chevron_small_right';

// Enhanced Tutor type with total raters
interface EnhancedTutor extends Tutor {
    ratings: {
        totalRaters: number;
        overallRating: number;
        categoryRatings: {
            [key: string]: number;
        };
        educationalProcess: {
            lessonStructure: string;
            intermediateAssessment: string;
            finalAssessment: string;
        };
    };
}

export const TutorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tutor, setTutor] = useState<EnhancedTutor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    
    // Function to extract department ID from department name
    const extractDepartmentId = (departmentName: string): number => {
        // Try to extract department number (e.g., "Кафедра №30" -> 30)
        const match = departmentName.match(/№(\d+)/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        
        // If no number found, use a simple mapping for common departments
        // In a real app, this would be retrieved from an API or a complete mapping
        const departmentMap: Record<string, number> = {
            "Кафедра №1": 1,
            "Кафедра №30": 30,
            "Кафедра №42": 42,
            "Кафедра №7": 7,
            "Кафедра №15": 15
        };
        
        return departmentMap[departmentName] || 97; // Default to department 97 if not found
    };

    // Use our scroll manager hook
    const { scrollPosition, saveScrollPosition, restoreScrollPosition } =
        useScrollManager({ element: contentRef });

    // Utility function to calculate the mean of category ratings
    const calculateMeanRating = (categoryRatings: { [key: string]: number }): number => {
        const values = Object.values(categoryRatings);
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    };

    // State for accordions
    const [expandedAccordions, setExpandedAccordions] = useState<{
        ratings: boolean;
        lessonStructure: boolean;
        intermediateAssessment: boolean;
        finalAssessment: boolean;
    }>({
        ratings: false,
        lessonStructure: false,
        intermediateAssessment: false,
        finalAssessment: false
    });

    // Fetch tutor data
    const fetchTutor = async () => {
        try {
            if (!id) throw new Error('No tutor ID provided');

            const tutorId = parseInt(id, 10);
            if (isNaN(tutorId)) throw new Error('Invalid tutor ID');

            setLoading(true);
            const fetchedTutor = await tutorService.getTutorById(tutorId);
            if (!fetchedTutor) throw new Error(`Tutor with ID ${id} not found`);

            // Add totalRaters if it doesn't exist
            const enhancedTutor: EnhancedTutor = {
                ...fetchedTutor,
                ratings: {
                    ...fetchedTutor.ratings,
                    totalRaters: fetchedTutor.ratings.totalRaters || Math.floor(Math.random() * 20) + 5
                }
            };

            setTutor(enhancedTutor);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutor();
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

    // Handle rating change (adding or removing a rating)
    const handleRatingChange = (hasRated: boolean, userRatings?: { [key: string]: number }) => {
        if (!tutor || !userRatings) return;

        // Save scroll position before updating
        saveScrollPosition();

        // Update category ratings
        const updatedCategoryRatings = { ...tutor.ratings.categoryRatings };
        const oldTotalRaters = tutor.ratings.totalRaters;

        // Only update ratings for our defined categories
        for (const category of RATING_CATEGORIES) {
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

        // Update tutor state with new ratings
        setTutor({
            ...tutor,
            ratings: {
                ...tutor.ratings,
                overallRating: newOverallRating,
                categoryRatings: updatedCategoryRatings,
                totalRaters: tutor.ratings.totalRaters + (hasRated ? 1 : -1)
            }
        });
    };

    // Navigation handlers
    const handleReviewsClick = () => {
        // Navigate to reviews page (future implementation)
        console.log(`Navigate to reviews for tutor ${id}`);
    };

    const handleMaterialsClick = () => {
        // Navigate to materials page (future implementation)
        console.log(`Navigate to materials for tutor ${id}`);
    };

    // Handle share button click
    const handleShare = () => {
        if (!tutor) return;

        if (shareURL.isAvailable()) {
            const shareLink = getTelegramShareableUrl(`/tutor/${tutor.id}`);
            const shareMessage = `\n${tutor.name}\n${tutor.department}`;

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
    if (error || !tutor) {
        return (
            <Page back={true}>
                <div className="p-4 text-center">
                    <div className="text-red-500 mb-2">{error || 'Failed to load tutor data'}</div>
                    <Button mode="bezeled" size="m" onClick={() => fetchTutor()}>
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
                    {/* Tutor header - non-interactive */}
                    <div className="tutor-page-non-interactive">
                        <Cell
                            className="-mx-2 tutor-page-non-interactive"
                            subtitle={
                                <Link
                                    to={`/department/${extractDepartmentId(tutor.department)}`}
                                    className="department-link"
                                    style={{
                                        position: 'relative',
                                        zIndex: 2,
                                        pointerEvents: 'auto'
                                    }}
                                >
                                    <div className='flex items-center'>
                                        {tutor.department}
                                        &nbsp;
                                        {<Icon12Chevron_small_right />}
                                    </div>
                                </Link>
                            }
                            multiline
                            after={
                                <Avatar
                                    // className='-mt-4.25'
                                    size={96}
                                    src={`/assets/tutors/${tutor.imageFileName}`}
                                    style={{ backgroundColor: 'var(--tgui--section_bg_color)' }}
                                    fallbackIcon={<Icon28Heart_fill />}
                                />
                            }
                        >
                            <Title weight="1" className="tutor-page-name">
                                {tutor.name.split(' ').join('\n')}
                            </Title>
                        </Cell>
                    </div>

                    {/* Position and rating - non-interactive wrapper but with interactive buttons */}
                    <Section>
                        <div className="tutor-page-non-interactive" style={{ position: 'relative' }}>
                            <CustomCell
                                className="tutor-page-non-interactive"
                                subhead="Должность"
                                rightSubhead="Рейтинг"
                                after={
                                    <Headline
                                        className="tutor-page-rating"
                                        weight="1"
                                    >
                                        {calculateMeanRating(tutor.ratings.categoryRatings).toFixed(1)}
                                        <div className="tutor-page-rating-icon">
                                            <Icon20Star_fill />
                                        </div>
                                    </Headline>
                                }
                            >
                                <Headline weight="1">
                                    {tutor.position}
                                </Headline>
                            </CustomCell>

                            {/* Button container with pointer events enabled */}
                            <div className="tutor-page-button-container">
                                <Button
                                    className="tutor-page-action-button"
                                    before={<Icon24Discussion_fill />}
                                    mode="bezeled"
                                    size="m"
                                    onClick={handleReviewsClick}
                                >
                                    Отзывы
                                </Button>
                                <Button
                                    className="tutor-page-action-button"
                                    before={<Icon24Folder_fill />}
                                    mode="bezeled"
                                    size="m"
                                    onClick={handleMaterialsClick}
                                >
                                    Материалы
                                </Button>
                            </div>
                        </div>
                    </Section>

                    {/* Ratings with standard Accordion */}
                    <Section className="tutor-page-smooth-accordion">
                        <Accordion
                            id="ratings"
                            expanded={expandedAccordions.ratings}
                            onChange={() => toggleAccordion('ratings')}
                            className="tutor-page-smooth-accordion"
                        >
                            <AccordionSummary>
                                {`Оценки (${tutor.ratings.totalRaters})`}
                            </AccordionSummary>
                            <AccordionContent>
                                <RatingLayout
                                    tutorId={tutor.id}
                                    categoryRatings={tutor.ratings.categoryRatings}
                                    totalRaters={tutor.ratings.totalRaters}
                                    onRatingChange={handleRatingChange}
                                />
                            </AccordionContent>
                        </Accordion>
                    </Section>

                    {/* Educational process */}
                    <Section header="Учебный процесс">
                        <Accordion
                            id="lessonStructure"
                            expanded={expandedAccordions.lessonStructure}
                            onChange={() => toggleAccordion('lessonStructure')}
                            className="tutor-page-smooth-accordion"
                        >
                            <AccordionSummary>
                                Как проходят занятия
                            </AccordionSummary>
                            <AccordionContent>
                                <List className="tutor-page-accordion-content">
                                    {tutor.ratings.educationalProcess.lessonStructure}
                                </List>
                            </AccordionContent>
                        </Accordion>

                        <Divider />

                        <Accordion
                            id="intermediateAssessment"
                            expanded={expandedAccordions.intermediateAssessment}
                            onChange={() => toggleAccordion('intermediateAssessment')}
                            className="tutor-page-smooth-accordion"
                        >
                            <AccordionSummary>
                                Промежуточная аттестация
                            </AccordionSummary>
                            <AccordionContent>
                                <List className="tutor-page-accordion-content">
                                    {tutor.ratings.educationalProcess.intermediateAssessment}
                                </List>
                            </AccordionContent>
                        </Accordion>

                        <Divider />

                        <Accordion
                            id="finalAssessment"
                            expanded={expandedAccordions.finalAssessment}
                            onChange={() => toggleAccordion('finalAssessment')}
                            className="tutor-page-smooth-accordion"
                        >
                            <AccordionSummary>
                                Итоговая аттестация
                            </AccordionSummary>
                            <AccordionContent>
                                <List className="tutor-page-accordion-content">
                                    {tutor.ratings.educationalProcess.finalAssessment}
                                </List>
                            </AccordionContent>
                        </Accordion>
                    </Section>

                    <Button
                        className="w-full"
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
