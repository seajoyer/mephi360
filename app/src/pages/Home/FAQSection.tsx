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

const faqCell: CellProps = {
  id: 6,
  left: <Icon48Addhome />,
  right: <Icon24ChevronRight />,
  text: 'ЧаВо',
  subtitle: 'Абитуриентам • студентам',
};

export const FAQSection = () => (
  <Section>
    <Cell
      key={faqCell.id}
      before={<IconContainer>{faqCell.left}</IconContainer>}
      after={<IconContainer>{faqCell.right}</IconContainer>}
      subtitle={faqCell.subtitle}
      className="fixed-height-cell"
    >
      {faqCell.text}
    </Cell>
  </Section>
);
