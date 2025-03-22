import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '@/components/Page';
import {
    List,
    Cell,
    Avatar,
    Button,
    Title,
    Section,
    Divider
} from '@telegram-apps/telegram-ui';
import { Icon24Discussion_fill } from '@/icons/24/discussion_fill';
import { Icon24Folder_fill } from '@/icons/24/folder_fill';
import { CustomCell } from '@/components/layout/CustomCell';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';
import { tutorService } from '@/services/tutorService';
import { Tutor } from '@/types/tutor';
import { shareURL } from '@telegram-apps/sdk-react';
import { getTelegramShareableUrl } from '@/config/appConfig';
import { TUTOR_RATING_CATEGORIES } from '@/constants/ratingConstants';
import { useScrollManager } from '@/hooks/useScrollManager';
import { Link } from '@/components/common/Link';
import { Icon12Chevron_small_right } from '@/icons/12/chevron_small_right';
import {
    EntityLoadingIndicator,
    EntityError,
    RatingDisplay,
    RatingAccordion,
    TextAccordion,
    ActionButtons
} from '@/components/layout/SharedEntityComponents';

// Extract department ID from department name
const extractDepartmentId = (departmentName: string): number => {
    const match = departmentName.match(/№(\d+)/);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }

    // Fallback mapping for common departments
    const departmentMap: Record<string, number> = {
        "Кафедра №1": 1,
        "Кафедра №30": 30,
        "Кафедра №42": 42,
        "Кафедра №7": 7,
        "Кафедра №15": 15
    };

    return departmentMap[departmentName] || 97;
};

// Calculate mean of category ratings
const calculateMeanRating = (categoryRatings: { [key: string]: number }): number => {
    const values = Object.values(categoryRatings);
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
};

export const TutorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Use scroll manager hook for smooth transitions
    const { saveScrollPosition } = useScrollManager({ element: contentRef });

    // State for accordions
    const [expandedAccordions, setExpandedAccordions] = useState({
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

            // Ensure tutor has totalRaters property
            if (!fetchedTutor.ratings.totalRaters) {
                fetchedTutor.ratings.totalRaters = Math.floor(Math.random() * 20) + 5;
            }

            setTutor(fetchedTutor);
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
        saveScrollPosition();
        setExpandedAccordions(prev => ({
            ...prev,
            [accordionName]: !prev[accordionName]
        }));
    };

    // Handle rating change (adding or removing a rating)
    const handleRatingChange = (hasRated: boolean, userRatings?: { [key: string]: number }) => {
        if (!tutor || !userRatings) return;

        saveScrollPosition();

        // Update category ratings
        const updatedCategoryRatings = { ...tutor.ratings.categoryRatings };
        const oldTotalRaters = tutor.ratings.totalRaters || 0;

        // Update ratings for each category
        for (const category of TUTOR_RATING_CATEGORIES) {
            if (category in userRatings) {
                const rating = userRatings[category];
                if (hasRated) {
                    // Adding a rating - update weighted average
                    updatedCategoryRatings[category] = ((updatedCategoryRatings[category] || 0) * oldTotalRaters + rating) / (oldTotalRaters + 1);
                } else {
                    // Removing a rating - reverse weighted average
                    updatedCategoryRatings[category] = oldTotalRaters <= 1
                        ? 0
                        : ((updatedCategoryRatings[category] || 0) * oldTotalRaters - rating) / (oldTotalRaters - 1);
                }
            }
        }

        // Calculate new overall rating
        const newOverallRating = calculateMeanRating(updatedCategoryRatings);

        // Update tutor state
        setTutor({
            ...tutor,
            ratings: {
                ...tutor.ratings,
                overallRating: newOverallRating,
                categoryRatings: updatedCategoryRatings,
                totalRaters: oldTotalRaters + (hasRated ? 1 : -1)
            }
        });
    };

    // Action handlers
    const handleReviewsClick = () => {
        console.log(`Navigate to reviews for tutor ${id}`);
    };

    const handleMaterialsClick = () => {
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
                <EntityLoadingIndicator />
            </Page>
        );
    }

    // Error state
    if (error || !tutor) {
        return (
            <Page back={true}>
                <EntityError error={error} onRetry={fetchTutor} />
            </Page>
        );
    }

    return (
        <Page back={true}>
            <div ref={contentRef}>
                <List>
                    {/* Tutor header - non-interactive */}
                    <div className="entity-page-non-interactive">
                        <Cell
                            className="-mx-2 entity-page-non-interactive"
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
                                        <Icon12Chevron_small_right />
                                    </div>
                                </Link>
                            }
                            multiline
                            after={
                                <Avatar
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

                    {/* Position and rating - non-interactive wrapper with interactive buttons */}
                    <Section>
                        <div className="entity-page-non-interactive" style={{ position: 'relative' }}>
                            <CustomCell
                                className="entity-page-non-interactive"
                                subhead="Должность"
                                rightSubhead="Рейтинг"
                                after={
                                    <RatingDisplay
                                        rating={calculateMeanRating(tutor.ratings.categoryRatings)}
                                    />
                                }
                            >
                                <Title level="3" weight="1">{tutor.position}</Title>
                            </CustomCell>

                            {/* Button container with pointer events enabled */}
                            <ActionButtons
                                primaryAction={{
                                    label: "Отзывы",
                                    icon: <Icon24Discussion_fill />,
                                    onClick: handleReviewsClick
                                }}
                                secondaryAction={{
                                    label: "Материалы",
                                    icon: <Icon24Folder_fill />,
                                    onClick: handleMaterialsClick
                                }}
                            />
                        </div>
                    </Section>

                    {/* Ratings section */}
                    <Section className="entity-page-smooth-accordion">
                        <RatingAccordion
                            expanded={expandedAccordions.ratings}
                            onToggle={() => toggleAccordion('ratings')}
                            entityId={tutor.id}
                            categoryRatings={tutor.ratings.categoryRatings}
                            totalRaters={tutor.ratings.totalRaters || 0}
                            onRatingChange={handleRatingChange}
                        />
                    </Section>

                    {/* Educational process section */}
                    <Section header="Учебный процесс">
                        <TextAccordion
                            title="Как проходят занятия"
                            id="lessonStructure"
                            expanded={expandedAccordions.lessonStructure}
                            onToggle={() => toggleAccordion('lessonStructure')}
                            content={tutor.ratings.educationalProcess?.lessonStructure || ''}
                        />

                        <Divider />

                        <TextAccordion
                            title="Промежуточный контроль"
                            id="intermediateAssessment"
                            expanded={expandedAccordions.intermediateAssessment}
                            onToggle={() => toggleAccordion('intermediateAssessment')}
                            content={tutor.ratings.educationalProcess?.intermediateAssessment || ''}
                        />

                        <Divider />

                        <TextAccordion
                            title="Итоговый контроль"
                            id="finalAssessment"
                            expanded={expandedAccordions.finalAssessment}
                            onToggle={() => toggleAccordion('finalAssessment')}
                            content={tutor.ratings.educationalProcess?.finalAssessment || ''}
                        />
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

export default TutorPage;
