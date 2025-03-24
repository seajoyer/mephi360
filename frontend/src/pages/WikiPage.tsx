import React from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/Page';
import { TopButtons } from '@/components/layout/TopButtons';
import { TopText } from '@/components/layout/TopText';
import { Button, Cell, List, Section } from '@telegram-apps/telegram-ui';
import { Icon24Tutor_hat } from '@/icons/24/tutor_hat';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon24Home } from '@/icons/24/home';
import { Icon24Group } from '@/icons/24/group';
import { Icon24Channel } from '@/icons/24/channel';
import { Icon24Questionmark } from '@/icons/24/questionmark';
import { TabBar } from '@/components/layout/TabBar';
import { WikiPageButtons } from '@/components/layout/WikiPageButtons';
import { shareURL } from '@telegram-apps/sdk-react';
import { getTelegramShareableUrl } from '@/config/appConfig';

export const WikiPage: FC = () => {
    const navigate = useNavigate();

    const handleCellClick = (path: string) => {
        navigate(path);
    };

    const handleShare = () => {
        if (shareURL.isAvailable()) {
            const shareLink = getTelegramShareableUrl(`/wiki`);
            const shareMessage = "Проверь МИФИ Wiki!";
            shareURL(shareLink, shareMessage);
        } else {
            console.log('Sharing is not available in this environment');
        }
    };

    return (
        <Page back={false}>
            <div>
                <TopButtons />
                <TopText />
                <div
                    // className='px-2'
                >
                    <List>
                        <WikiPageButtons />

                        <Section>
                            <Cell
                                before={<Icon24Tutor_hat />}
                                after={
                                    <Icon16Chevron_right
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                }
                                onClick={() => handleCellClick('/tutors')}
                            >
                                Преподаватели
                            </Cell>
                        </Section>

                        <Section>
                            <Cell
                                before={<Icon24Home />}
                                after={
                                    <Icon16Chevron_right
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                }
                                onClick={() => handleCellClick('/departments')}
                            >
                                Кафедры
                            </Cell>
                        </Section>

                        <Section>
                            <Cell
                                before={<Icon24Group />}
                                after={
                                    <Icon16Chevron_right
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                }
                                onClick={() => handleCellClick('/circles')}
                            >
                                Клубы
                            </Cell>
                        </Section>

                        <Section>
                            <Cell
                                before={<Icon24Channel />}
                                after={
                                    <Icon16Chevron_right
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                }
                                onClick={() => console.log('Channels clicked')}
                            >
                                Каналы
                            </Cell>
                        </Section>

                        <Section>
                            <Cell
                                before={<Icon24Questionmark />}
                                after={
                                    <Icon16Chevron_right
                                        style={{ color: `var(--tgui--hint_color)` }}
                                    />
                                }
                                onClick={() => console.log('Ask question clicked')}
                            >
                                Задать вопрос
                            </Cell>
                        </Section>

                        <Button
                            className="w-full"
                            mode="plain"
                            size="m"
                            onClick={handleShare}
                        >
                            Поделиться
                        </Button>
                    </List>
                </div>
                <TabBar />
            </div>
        </Page>
    );
};
