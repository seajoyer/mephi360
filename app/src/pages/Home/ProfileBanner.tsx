import { ReactNode } from 'react';
import { Banner, Section } from '@telegram-apps/telegram-ui';

import { Icon28Chat } from '@telegram-apps/telegram-ui/dist/icons/28/chat';

type BannerProps = {
    id: number;
    icon: ReactNode;
    title: string;
    subhead: string,
}

const banner: BannerProps = {
    id: 1,
    icon: <Icon28Chat />,
    title: 'Петров Иван Федорович',
    subhead: 'Б24-215',
}

export const ProfileBanner = () => (
    <Section>
        <Banner
            key={banner.id}
            header={banner.title}
            subheader={banner.subhead}
        />
    </Section >
);
