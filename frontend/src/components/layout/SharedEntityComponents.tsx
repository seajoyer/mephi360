import React from 'react';
import { Button, Cell, Headline, Divider, Accordion, List } from '@telegram-apps/telegram-ui';
import { AccordionSummary } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary';
import { AccordionContent } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent';
import { RatingLayout } from './RatingLayout';
import { Icon20Star_fill } from '@/icons/20/star_fill';

/**
 * Shared loading indicator component for entity pages (tutor, department)
 */
export const EntityLoadingIndicator: React.FC = () => (
    <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full" />
    </div>
);

/**
 * Shared error display component for entity pages
 */
interface EntityErrorProps {
    error: string | null;
    onRetry: () => void;
}

export const EntityError: React.FC<EntityErrorProps> = ({ error, onRetry }) => (
    <div className="p-4 text-center">
        <div className="text-red-500 mb-2">{error || 'Failed to load data'}</div>
        <Button mode="bezeled" size="m" onClick={onRetry}>
            Retry
        </Button>
    </div>
);

/**
 * Rating display component that shows a rating with a star icon
 */
interface RatingDisplayProps {
    rating: number;
    className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating, className = '' }) => (
    <Headline className={`entity-page-rating ${className}`} weight="1">
        {rating.toFixed(1)}
        <div className="entity-page-rating-icon">
            <Icon20Star_fill />
        </div>
    </Headline>
);

/**
 * RatingAccordion component for displaying ratings
 */
interface RatingAccordionProps {
    expanded: boolean;
    onToggle: () => void;
    entityId: number;
    categoryRatings: { [key: string]: number };
    totalRaters: number;
    onRatingChange: (hasRated: boolean, newRatings?: { [key: string]: number }) => void;
    categories?: string[];
    entityType?: 'tutor' | 'department';
}

export const RatingAccordion: React.FC<RatingAccordionProps> = ({
    expanded,
    onToggle,
    entityId,
    categoryRatings,
    totalRaters,
    onRatingChange,
    categories,
    entityType = 'tutor'
}) => (
    <Accordion
        id="ratings"
        expanded={expanded}
        onChange={onToggle}
        className="entity-page-smooth-accordion"
    >
        <AccordionSummary>
            {`Оценки (${totalRaters})`}
        </AccordionSummary>
        <AccordionContent>
            <List>
                <RatingLayout
                    tutorId={entityId}
                    categoryRatings={categoryRatings}
                    totalRaters={totalRaters}
                    onRatingChange={onRatingChange}
                    categories={categories}
                    entityType={entityType}
                />
            </List>
        </AccordionContent>
    </Accordion>
);

/**
 * Simple accordion with text content
 */
interface TextAccordionProps {
    title: string;
    id: string;
    expanded: boolean;
    onToggle: () => void;
    content: string;
}

export const TextAccordion: React.FC<TextAccordionProps> = ({
    title,
    id,
    expanded,
    onToggle,
    content
}) => (
    <Accordion
        id={id}
        expanded={expanded}
        onChange={onToggle}
        className="entity-page-smooth-accordion"
    >
        <AccordionSummary>{title}</AccordionSummary>
        <AccordionContent>
            <List className="entity-page-accordion-content">
                {content}
            </List>
        </AccordionContent>
    </Accordion>
);

/**
 * Staff listing accordion component
 */
interface StaffAccordionProps {
    expanded: boolean;
    onToggle: () => void;
    staff: { id: number; name: string; position: string }[];
    onViewAllStaff: () => void;
}

export const StaffAccordion: React.FC<StaffAccordionProps> = ({
    expanded,
    onToggle,
    staff,
    onViewAllStaff
}) => (
    <Accordion
        id="staff"
        expanded={expanded}
        onChange={onToggle}
        className="entity-page-smooth-accordion"
    >
        <AccordionSummary>
            Преподаватели кафедры
        </AccordionSummary>
        <AccordionContent>
            <div className="entity-page-accordion-content">
                {staff.slice(0, 3).map((staffMember, index) => (
                    <React.Fragment key={staffMember.id}>
                        <Cell subtitle={staffMember.position}>
                            {staffMember.name}
                        </Cell>
                    </React.Fragment>
                ))}

                <List>
                    <Button
                        mode="bezeled"
                        size="m"
                        className="w-full"
                        onClick={onViewAllStaff}
                    >
                        Показать всех преподавателей
                    </Button>
                </List>
            </div>
        </AccordionContent>
    </Accordion>
);

/**
 * Action buttons container for entity pages
 */
interface ActionButtonsProps {
    primaryAction: {
        label: string;
        icon: React.ReactNode;
        onClick: () => void;
    };
    secondaryAction: {
        label: string;
        icon: React.ReactNode;
        onClick: () => void;
    };
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    primaryAction,
    secondaryAction
}) => (
    <div className="entity-page-button-container">
        <Button
            className="entity-page-action-button"
            before={primaryAction.icon}
            mode="bezeled"
            size="m"
            onClick={primaryAction.onClick}
        >
            {primaryAction.label}
        </Button>
        <Button
            className="entity-page-action-button"
            before={secondaryAction.icon}
            mode="bezeled"
            size="m"
            onClick={secondaryAction.onClick}
        >
            {secondaryAction.label}
        </Button>
    </div>
);
