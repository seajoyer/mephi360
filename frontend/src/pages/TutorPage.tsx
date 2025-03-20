import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '@/components/Page';
import { List, Cell, Avatar, Image, Button, Title, Section, Headline, Accordion, Divider, Rating } from '@telegram-apps/telegram-ui';
import { Icon20Star_fill } from '@/icons/20/star_fill';
import { Icon24Discussion_fill } from '@/icons/24/discussion_fill';
import { Icon24Folder_fill } from '@/icons/24/folder_fill';
import { CustomCell } from '@/components/layout/CustomCell';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';
import { AccordionSummary } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary';
import { AccordionContent } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent';
import { tutorService } from '@/services/tutorService';
import { Tutor } from '@/types/tutor';
import { shareURL } from '@telegram-apps/sdk-react';
import { getTelegramShareableUrl } from '@/config/appConfig';
import { RatingLayout } from '@/components/layout/RatingLayout';

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

// Custom styles for non-interactive components
const nonInteractiveStyle = {
  pointerEvents: 'none' as const,
};

const buttonContainerStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  pointerEvents: 'auto',
  display: 'flex',
  gap: '8px',
};

export const TutorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<EnhancedTutor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    setExpandedAccordions(prev => ({
      ...prev,
      [accordionName]: !prev[accordionName]
    }));
  };

  // Handle rating change (adding or removing a rating)
  const handleRatingChange = (hasRated: boolean, userRatings?: {[key: string]: number}) => {
    if (!tutor || !userRatings) return;
    
    // Update category ratings
    const updatedCategoryRatings = { ...tutor.ratings.categoryRatings };
    const oldTotalRaters = tutor.ratings.totalRaters;
    
    for (const [category, rating] of Object.entries(userRatings)) {
      if (hasRated) {
        // Adding a rating - update each category's weighted average
        updatedCategoryRatings[category] = ((updatedCategoryRatings[category] * oldTotalRaters) + rating) / (oldTotalRaters + 1);
      } else {
        // Removing a rating - reverse the weighted average calculation
        updatedCategoryRatings[category] = oldTotalRaters <= 1 
          ? 0 
          : ((updatedCategoryRatings[category] * oldTotalRaters) - rating) / (oldTotalRaters - 1);
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
      {/* Inject CSS to override hover effects */}
      <style jsx global>{`
        .non-interactive-cell.tgui-b8dfba0b5c3d054c:hover {
          background: inherit !important;
          cursor: default !important;
        }

        @media (hover: hover) and (pointer: fine) {
          .non-interactive-cell.tgui-b8dfba0b5c3d054c:hover {
            background: inherit !important;
          }
        }
        
        .tutor-name {
          white-space: pre-line;
          line-height: 1.2;
        }
      `}</style>

      <List>
        {/* Tutor header - non-interactive */}
        <div className="non-interactive-cell" style={nonInteractiveStyle}>
          <Cell
            className='-mx-2 non-interactive-cell'
            subtitle={tutor.department}
            multiline
            after={
              <Image
                size={96}
                src={`/assets/tutors/${tutor.imageFileName}`}
                style={{ backgroundColor: 'var(--tgui--section_bg_color)' }}
                fallbackIcon={<Icon28Heart_fill />}
              />
            }
          >
            <Title weight='1' className="tutor-name">
              {tutor.name.split(' ').join('\n')}
            </Title>
          </Cell>
        </div>

        {/* Position and rating - non-interactive wrapper but with interactive buttons */}
        <Section>
          <div className="non-interactive-cell" style={{ position: 'relative' }}>
            <div style={nonInteractiveStyle}>
              <CustomCell
                className="non-interactive-cell"
                subhead="Должность"
                rightSubhead="Рейтинг"
                after={
                  <Headline
                    className='gap-1 flex items-center'
                    weight='1'
                  >
                    {calculateMeanRating(tutor.ratings.categoryRatings).toFixed(1)}
                    <div className='-mt-0.75'>
                      <Icon20Star_fill />
                    </div>
                  </Headline>
                }
              >
                <Headline weight="1">
                  {tutor.position}
                </Headline>
              </CustomCell>
            </div>

            {/* Button container with pointer events enabled */}
            <div style={{...buttonContainerStyle, padding: '0 16px 16px'}}>
              <Button
                style={{
                  minWidth: '50px',
                  width: '50%'
                }}
                before={<Icon24Discussion_fill />}
                mode="bezeled"
                size="m"
                onClick={handleReviewsClick}
              >
                Отзывы
              </Button>
              <Button
                style={{
                  minWidth: '50px',
                  width: '50%'
                }}
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

        {/* Ratings with updated layout */}
        <Section>
          <Accordion
            id="ratings"
            expanded={expandedAccordions.ratings}
            onChange={() => toggleAccordion('ratings')}
          >
            <AccordionSummary>
              Оценки ({tutor.ratings.totalRaters})
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
        <Section header='Учебный процесс'>
          <Accordion
            id="lessonStructure"
            expanded={expandedAccordions.lessonStructure}
            onChange={() => toggleAccordion('lessonStructure')}
          >
            <AccordionSummary>
              Как проходит занятие
            </AccordionSummary>
            <AccordionContent>
              <div
                className='px-4 py-2'
                style={{
                  color: 'var(--tgui--subtitle_text_color)'
                }}
              >
                {tutor.ratings.educationalProcess.lessonStructure}
              </div>
            </AccordionContent>
          </Accordion>

          <Divider />

          <Accordion
            id="intermediateAssessment"
            expanded={expandedAccordions.intermediateAssessment}
            onChange={() => toggleAccordion('intermediateAssessment')}
          >
            <AccordionSummary>
              Промежуточная аттестация
            </AccordionSummary>
            <AccordionContent>
              <div
                className='px-4 py-2'
                style={{
                  color: 'var(--tgui--subtitle_text_color)'
                }}
              >
                {tutor.ratings.educationalProcess.intermediateAssessment}
              </div>
            </AccordionContent>
          </Accordion>

          <Divider />

          <Accordion
            id="finalAssessment"
            expanded={expandedAccordions.finalAssessment}
            onChange={() => toggleAccordion('finalAssessment')}
          >
            <AccordionSummary>
              Итоговая аттестация
            </AccordionSummary>
            <AccordionContent>
              <div
                className='px-4 py-2'
                style={{
                  color: 'var(--tgui--subtitle_text_color)'
                }}
              >
                {tutor.ratings.educationalProcess.finalAssessment}
              </div>
            </AccordionContent>
          </Accordion>
        </Section>

        <Button
          className='w-full'
          mode='plain'
          size='m'
          onClick={handleShare}
        >
          Поделиться
        </Button>
      </List>

      {/* Additional space at the bottom for better scrolling */}
      <div className="h-36 w-full"></div>
    </Page>
  );
};
