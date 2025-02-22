import { InlineButtons } from '@telegram-apps/telegram-ui';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';

import { Icon24Heart } from '@/icons/24/heart';
import { Icon24Largegroup } from '@/icons/24/largegroup';
import { Icon24Folder } from '@/icons/24/folder';

import { openLink } from '@telegram-apps/sdk-react';
import { useNavigate } from 'react-router-dom';
import { type FC, useCallback } from 'react';

interface NavigationItemProps {
  to: string;
  text: string;
  mode?: 'bezeled' | 'gray';
  icon?: React.ReactNode;
}

const NavigationItem: FC<NavigationItemProps> = ({ to, text, mode = 'gray', icon }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    const targetUrl = new URL(to, window.location.toString());
    const currentUrl = new URL(window.location.toString());
    const isExternal = targetUrl.protocol !== currentUrl.protocol
      || targetUrl.host !== currentUrl.host;

    if (isExternal) {
      openLink(targetUrl.toString());
    } else {
      navigate(to);
    }
  }, [to, navigate]);

  return (
    <InlineButtonsItem
      text={text}
      mode={mode}
      onClick={handleClick}
    >
      {icon}
    </InlineButtonsItem>
  );
};

export const NavigationButtons: FC = () => {
  return (
    <InlineButtons>
      <NavigationItem
        to="/study/tutors"
        text="Преподы"
        mode="bezeled"
        icon={<Icon24Heart />}
      />
      <NavigationItem
        to="/study/clubs"
        text="Кружки"
        mode="gray"
        icon={<Icon24Largegroup />}
      />
      <NavigationItem
        to="/study/stuff"
        text="Материалы"
        mode="gray"
        icon={<Icon24Folder />}
      />
    </InlineButtons>
  );
};
