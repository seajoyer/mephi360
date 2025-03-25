import React, { useState } from 'react';
import { Page } from '@/components/Page';
import { StuffList } from '@/components/list/StuffList';
import { StuffSearchPanel } from '@/components/search/StuffSearchPanel';
import { TabBar } from '@/components/layout/TabBar';
import { Button, Cell, InlineButtons, List, Placeholder, Section } from '@telegram-apps/telegram-ui';
import stuff_512 from "@/stickers/stuff_512.gif"
import { TopButtons } from '@/components/layout/TopButtons';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';
import { Icon24Plus } from '@/icons/24/plus';
import { Icon24Folder } from '@/icons/24/folder';
import { Icon24Addfolder } from '@/icons/24/addfolder';
import { Icon24Tutor_hat } from '@/icons/24/tutor_hat';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon24Home } from '@/icons/24/home';
import { Icon24Group } from '@/icons/24/group';
import { Icon24Channel } from '@/icons/24/channel';
import { Icon24Questionmark } from '@/icons/24/questionmark';
import { Icon24Chevron_right } from '@/icons/24/chevron_right';
import { Icon20Chevron_vertical } from '@/icons/20/chevron_vertical';

export const StuffPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [teacherFilter, setTeacherFilter] = useState<string | null>(null);
    const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
    const [semesterFilter, setSemesterFilter] = useState<string | null>(null);
    const [instituteFilter, setInstituteFilter] = useState<string | null>(null);

    return (
        <Page back={false}>
            <TopButtons />

            <Placeholder
                className='-mt-3'
            >
                <img
                    className='size-24'
                    alt="Stuff sticker"
                    src={stuff_512}
                />
            </Placeholder>

            <List>
                <Section>
                    <Cell
                        before={<Icon24Tutor_hat />}
                        after={
                            <Icon20Chevron_vertical
                                style={{ color: `var(--tgui--hint_color)` }}
                            />
                        }
                        onClick={() => handleCellClick('/tutors')}
                    >
                        Преподаватель
                    </Cell>
                </Section>

                <Section>
                    <Cell
                        before={<Icon24Home />}
                        after={
                            <Icon20Chevron_vertical
                                style={{ color: `var(--tgui--hint_color)` }}
                            />
                        }
                        onClick={() => handleCellClick('/departments')}
                    >
                        Предмет
                    </Cell>
                </Section>

                <Section>
                    <Cell
                        before={<Icon24Group />}
                        after={
                            <Icon20Chevron_vertical
                                style={{ color: `var(--tgui--hint_color)` }}
                            />
                        }
                        onClick={() => handleCellClick('/circles')}
                    >
                        Семестр
                    </Cell>
                </Section>

                <Section>
                    <Cell
                        before={<Icon24Channel />}
                        after={
                            <Icon20Chevron_vertical
                                style={{ color: `var(--tgui--hint_color)` }}
                            />
                        }
                        onClick={() => handleCellClick('/blogs')}
                    >
                        Тип
                    </Cell>
                </Section>

                <Button
                    className='w-full'
                    mode='bezeled'
                    after={<Icon16Chevron_right />}
                >
                    Найти
                </Button>
            </List>

            {/* <Button
                className='w-full'
                mode='bezeled'
                size='m'
            >
                Добавить
            </Button>
 */}

            {/* <div className="pl-2 overflow-x-hidden">
                <StuffSearchPanel
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    typeFilter={typeFilter}
                    onTypeFilterChange={setTypeFilter}
                    teacherFilter={teacherFilter}
                    onTeacherFilterChange={setTeacherFilter}
                    subjectFilter={subjectFilter}
                    onSubjectFilterChange={setSubjectFilter}
                    semesterFilter={semesterFilter}
                    onSemesterFilterChange={setSemesterFilter}
                    instituteFilter={instituteFilter}
                    onInstituteFilterChange={setInstituteFilter}
                />

                <div className='pr-2'>
                    <StuffList
                        searchQuery={searchQuery}
                        typeFilter={typeFilter}
                        teacherFilter={teacherFilter}
                        subjectFilter={subjectFilter}
                        semesterFilter={semesterFilter}
                        activeInstitute={instituteFilter}
                    />
                </div>
            </div> */}

            <TabBar />
        </Page>
    );
};
