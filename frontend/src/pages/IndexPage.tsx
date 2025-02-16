import type { FC } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { SearchPanel } from '@/components/SearchPanel';
import { Heading } from '@/components/Heading';
import { TeachersList } from '@/components/TeachersList';
import { NavigationButtons } from '@/components/NavigationButtons';

export const IndexPage: FC = () => {
    return (
        <Page back={false}>
            <List>
                <Heading />
                <NavigationButtons />
                <SearchPanel />
                <TeachersList />
            </List>
        </Page>
    );
};
