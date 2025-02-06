import { List } from '@telegram-apps/telegram-ui';
import { ProfileBanner } from './ProfileBanner'
import { MainSection } from './MainSection'
import { FAQSection } from './FAQSection'

export const HomePage = () => (
    <List>
        <ProfileBanner />
        <MainSection />
        <FAQSection />
    </List>
);
