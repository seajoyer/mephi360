import { AppRoot, List } from '@telegram-apps/telegram-ui';
import { HomePage } from './pages/Home/Page';

export const App = () => (
    <AppRoot>
        <List>
            <HomePage />
            {/* <FormSection />
            <BannerSection />
            <TimelineSection />
            <TooltipSection />
            <ModalSection /> */}
        </List>
    </AppRoot>
);
