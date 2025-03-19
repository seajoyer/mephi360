import React from 'react';

import { Badge, List, Cell, Avatar, Button, Title, Section, Headline, Subheadline } from '@telegram-apps/telegram-ui';

import { Icon20Star_fill } from '@/icons/20/star_fill';
import { Icon24Edit } from '@/icons/24/edit';
import { Icon24Folder } from '@/icons/24/folder';
import { CustomCell } from '@/components/layout/CustomCell';
import { Icon28Heart_fill } from '@/icons/28/heart_fill';

const TutorPage = () => {
    return (
        <List>
            <Cell
                className='-px-2'
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
                                before={<Icon24Edit />}
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
                                before={<Icon24Folder />}
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
        </List>
    );
};

export default TutorPage;
