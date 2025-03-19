import React, { useState } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page';

import { List, Cell, Avatar, Button, Title, Section, Headline, Rating, Accordion } from '@telegram-apps/telegram-ui';

import { Icon20Star_fill } from '@/icons/20/star_fill';
import { Icon24Discussion_fill } from '@/icons/24/discussion_fill';
import { Icon24Folder_fill } from '@/icons/24/folder_fill';
import { CustomCell } from '@/components/layout/CustomCell';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';
import { AccordionSummary } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary';
import { AccordionContent } from '@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent';

export const TutorPage: FC = () => {
    return (
        <Page back={true}>
            <List>
                <Cell
                    className='-mx-2'
                    subtitle='Кафедра №30'
                    after={
                        <Avatar
                            size={60}
                            src={`/assets/tutors/<id>`}
                            style={{ backgroundColor: 'var(--tgui--section_bg_color)' }}
                            fallbackIcon={<Icon28Heart_fill />}
                        />
                    }
                >
                    <Title
                        weight='1'
                    >
                        Горячев А.П.
                    </Title>
                </Cell>

                <Section>
                    <CustomCell
                        subhead="Должность"
                        rightSubhead="Рейтинг"
                        after={
                            <Headline
                                className='gap-1 flex justify-end items-center place-end'
                                style={{
                                    color: 'var(--tgui--green)'
                                }}
                                weight='1'
                            >
                                4.3
                                <div className='-mt-0.75'>
                                    <Icon20Star_fill />
                                </div>
                            </Headline>
                        }
                        bottom={
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button
                                    style={{
                                        minWidth: '115px',
                                        width: '50%'
                                    }}
                                    before={<Icon24Discussion_fill />}
                                    mode="bezeled"
                                    size="m"
                                >
                                    Отзывы
                                </Button>
                                <Button
                                    style={{
                                        minWidth: '115px',
                                        width: '50%'
                                    }}
                                    before={<Icon24Folder_fill />}
                                    mode="bezeled"
                                    size="m"
                                >
                                    Материалы
                                </Button>
                            </div>
                        }
                    >
                        <Headline weight="1">
                            Доцент
                        </Headline>
                    </CustomCell>
                </Section>

                <Section>
                    <Accordion expanded>
                        <AccordionSummary>
                            Оценки
                        </AccordionSummary>
                        <AccordionContent>

                            <Section>
                                <div
                                    className='flex place-content-between items-center'
                                >
                                    <Rating
                                        max={5}
                                        precision={0.5}
                                        onChange={() => {}}
                                        className="raiting"
                                    />
                                    <Headline
                                        weight='1'
                                        className='pr-4'
                                        plain
                                    >
                                        4.3
                                    </Headline>
                                </div>
                                <div
                                    className='flex place-content-between items-center'
                                >
                                    <Rating
                                        max={5}
                                        precision={0.5}
                                        onChange={() => {}}
                                        className="raiting"
                                    />
                                    <Headline
                                        weight='1'
                                        className='pr-4'
                                        plain
                                    >
                                        4.3
                                    </Headline>
                                </div>
                                <div
                                    className='flex place-content-between items-center'
                                >
                                    <Rating
                                        max={5}
                                        precision={0.5}
                                        onChange={() => {}}
                                        className="raiting"
                                    />
                                    <Headline
                                        weight='1'
                                        className='pr-4'
                                        plain
                                    >
                                        4.3
                                    </Headline>
                                </div>
                                <div
                                    className='flex place-content-between items-center'
                                >
                                    <Rating
                                        max={5}
                                        precision={0.5}
                                        onChange={() => {}}
                                        className="raiting"
                                    />
                                    <Headline
                                        weight='1'
                                        className='pr-4'
                                        plain
                                    >
                                        4.3
                                    </Headline>
                                </div>
                            </Section>
                        </AccordionContent>
                    </Accordion>
                </Section>

                <Section header='Учебный процесс'>
                    <Accordion expanded={false}>
                        <AccordionSummary>
                            Как проходит занятие
                        </AccordionSummary>
                        <AccordionContent>
                            <div
                                className='flex place-content-between items-center'
                            >
                                <Rating
                                    max={5}
                                    precision={0.5}
                                    onChange={() => {}}
                                    className="raiting"
                                />
                                <Headline
                                    weight='1'
                                    className='pr-4'
                                    plain
                                >
                                    4.3
                                </Headline>
                            </div>
                            <div
                                className='flex place-content-between items-center'
                            >
                                <Rating
                                    max={5}
                                    precision={0.5}
                                    onChange={() => {}}
                                    className="raiting"
                                />
                                <Headline
                                    weight='1'
                                    className='pr-4'
                                    plain
                                >
                                    4.3
                                </Headline>
                            </div>
                            <div
                                className='flex place-content-between items-center'
                            >
                                <Rating
                                    max={5}
                                    precision={0.5}
                                    onChange={() => {}}
                                    className="raiting"
                                />
                                <Headline
                                    weight='1'
                                    className='pr-4'
                                    plain
                                >
                                    4.3
                                </Headline>
                            </div>
                            <div
                                className='flex place-content-between items-center'
                            >
                                <Rating
                                    max={5}
                                    precision={0.5}
                                    onChange={() => {}}
                                    className="raiting"
                                />
                                <Headline
                                    weight='1'
                                    className='pr-4'
                                    plain
                                >
                                    4.3
                                </Headline>
                            </div>
                        </AccordionContent>
                    </Accordion>
                    <Accordion expanded={false}>
                        <AccordionSummary>
                            Промежуточная аттестация
                        </AccordionSummary>
                        <AccordionContent>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </AccordionContent>
                    </Accordion>
                    <Accordion expanded={false}>
                        <AccordionSummary>
                            Итоговая аттестация
                        </AccordionSummary>
                        <AccordionContent>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </AccordionContent>
                    </Accordion>

                </Section>

            </List>
        </Page >
    );
};
