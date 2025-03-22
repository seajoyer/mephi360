import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { Icon24Person_add } from '@/icons/24/person_add';

interface AddButtonProps {
  onClick: () => void;
}

export const AddButton: React.FC<AddButtonProps> = React.memo(({ onClick }) => (
  <Button
    mode="gray"
    size="m"
    style={{
      padding: 8,
      marginLeft: '8px',
      background: 'var(--tgui--section_bg_color)',
    }}
    onClick={onClick}
    aria-label="Add item"
  >
    <Icon24Person_add />
  </Button>
));

AddButton.displayName = 'AddButton';
