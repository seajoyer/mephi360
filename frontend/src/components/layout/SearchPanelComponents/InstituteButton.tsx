import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { Icon24All } from '@/icons/24/all';
import { Institute } from './types';

interface InstituteButtonProps {
  institute?: Institute;
  isSelected?: boolean;
  onClick: () => void;
  animationIndex?: number;
  disableAnimation?: boolean;
}

export const InstituteButton = React.memo<InstituteButtonProps>(({
  institute,
  isSelected = false,
  onClick,
  animationIndex = 0,
  disableAnimation = false
}) => {
  const InstituteIcon = institute?.Icon || Icon24All;
  const animationDelay = `${animationIndex * 20}ms`;
  const animationClass = disableAnimation
    ? ""
    : (animationIndex === 0 ? "institute-button-animate-first" : "institute-button-animate");

  return (
    <Button
      mode={isSelected ? "gray" : "plain"}
      size="m"
      onClick={onClick}
      className={animationClass}
      style={{
        padding: '0px',
        background: isSelected ? 'var(--tgui--section_bg_color)' : '',
        color: 'var(--tgui--text_color)',
        flexShrink: 0,
        animationDelay,
      }}
      aria-label={institute ? `Select institute ${institute.id}` : "All institutes"}
    >
      <InstituteIcon />
    </Button>
  );
});

InstituteButton.displayName = 'InstituteButton';
