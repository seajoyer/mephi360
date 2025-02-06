import { ReactNode } from 'react';
import { Cell, IconContainer, Section } from '@telegram-apps/telegram-ui';
import { Icon48Addhome } from '../../icons/48/addhome';
import { Icon24ChevronRight } from '@telegram-apps/telegram-ui/dist/icons/24/chevron_right';

type CellProps = {
  id: number;
  left: ReactNode;
  right: ReactNode;
  text: string;
  subtitle: string;
}

const cells: CellProps[] = [
  {
    id: 1,
    left: <Icon48Addhome />,
    right: <Icon24ChevronRight />,
    text: 'Учёба',
    subtitle: 'Форум • кружки • материалы',
  },
  {
    id: 2,
    left: <Icon48Addhome />,
    right: <Icon24ChevronRight />,
    text: 'Студ. актив',
    subtitle: 'Клубы • события • движ',
  },
  {
    id: 3,
    left: <Icon48Addhome />,
    right: <Icon24ChevronRight />,
    text: 'Преподаватели',
    subtitle: '',
  },
  {
    id: 4,
    left: <Icon48Addhome />,
    right: <Icon24ChevronRight />,
    text: 'Библиотека',
    subtitle: '',
  },
  {
    id: 5,
    left: <Icon48Addhome />,
    right: <Icon24ChevronRight />,
    text: 'Свободные аудитории',
    subtitle: '',
  },
];

export const MainSection = () => (
  <Section>
    {cells.map((cell) => (
      <Cell
        key={cell.id}
        before={<IconContainer>{cell.left}</IconContainer>}
        after={<IconContainer>{cell.right}</IconContainer>}
        subtitle={cell.subtitle}
        className="fixed-height-cell"
      >
        {cell.text}
      </Cell>
    ))}
  </Section>
);
