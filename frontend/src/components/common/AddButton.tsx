import React from 'react';
import { FixedLayout, Button } from '@telegram-apps/telegram-ui';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';

type AddButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const AddButton: React.FC<AddButtonProps> = ({ onClick, disabled = true }) => {
  const isKeyboardVisible = useKeyboardVisibility();

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <FixedLayout
      vertical="bottom"
      className='px-3'
      style={{ zIndex: 2000 }}
    >
      <Button
        onClick={onClick}
        className='w-full'
        size='l'
        disabled={disabled}
      >
        Добавить
      </Button>
      <div className='pb-5' />
    </FixedLayout>
  );
};
