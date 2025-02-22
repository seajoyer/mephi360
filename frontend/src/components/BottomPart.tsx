import React, { useState, useCallback } from 'react';
import { InlineButtons, List } from '@telegram-apps/telegram-ui';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';
import { Icon24Heart } from '@/icons/24/heart';
import { Icon24Largegroup } from '@/icons/24/largegroup';
import { Icon24Folder } from '@/icons/24/folder';
import { TutorsList } from '@/components/TutorsList';
import { ClubsList } from '@/components/ClubsList';
import { StuffList } from '@/components/StuffList';

const SECTIONS = [
  { id: 'tutors', text: 'Преподы', icon: Icon24Heart, mode: 'bezeled' },
  { id: 'clubs', text: 'Кружки', icon: Icon24Largegroup, mode: 'gray' },
  { id: 'stuff', text: 'Материалы', icon: Icon24Folder, mode: 'gray' }
];

const BottomPart = () => {
  const [activeSection, setActiveSection] = useState('tutors');
  const [slideDirection, setSlideDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSectionChange = useCallback((newSection) => {
    if (newSection === activeSection || isAnimating) return;

    const currentIndex = SECTIONS.findIndex(section => section.id === activeSection);
    const newIndex = SECTIONS.findIndex(section => section.id === newSection);

    setSlideDirection(newIndex > currentIndex ? 'left' : 'right');
    setIsAnimating(true);
    setActiveSection(newSection);

    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Match this with CSS transition duration
  }, [activeSection, isAnimating]);

  const renderContent = () => {
    switch (activeSection) {
      case 'tutors':
        return <TutorsList />;
      case 'clubs':
        return <ClubsList />;
      case 'stuff':
        return <StuffList />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <List>
      <InlineButtons>
        {SECTIONS.map(({ id, text, icon: Icon, mode }) => (
          <InlineButtonsItem
            key={id}
            text={text}
            mode={activeSection === id ? 'bezeled' : 'gray'}
            onClick={() => handleSectionChange(id)}
          >
            <Icon />
          </InlineButtonsItem>
        ))}
      </InlineButtons>

      <div className="relative overflow-hidden w-full">
        <div
          className={`transform transition-transform duration-300 ease-in-out w-full
            ${isAnimating ? (slideDirection === 'left' ? '-translate-x-full' : 'translate-x-full') : 'translate-x-0'}`}
        >
          {renderContent()}
        </div>
      </div>
      </List>
    </div>
  );
};

export default BottomPart;
