import React, { useState } from 'react';
import { SearchPanel } from '@/components/layout/SearchPanel';
import { SectionContent } from '@/components/sections/SectionContent';
import { Navigation } from '@/components/layout/Navigation';
import { useFilters } from '@/contexts/FilterContext';
import { Avatar, Cell, List, Section } from '@telegram-apps/telegram-ui';
import { Icon24Home } from '@/icons/24/home';
import { Icon24Tutor } from '@/icons/24/tutor';
import { Icon16Chevron_right } from '@/icons/16/chevron_right';
import { Icon24Largegroup } from '@/icons/24/largegroup';
import { Icon24Questionmark } from '@/icons/24/questionmark';
import { TabBar } from '../layout/TabBar';
import { Icon24Group } from '@/icons/24/group';
import { Icon24Tutor_hat } from '@/icons/24/tutor_hat';
import { Icon24Channel } from '@/icons/24/channel';

interface BottomPartProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const BottomPart: React.FC<BottomPartProps> = ({ activeSection, onSectionChange }) => {
    // State for the selected institute (for stuff section)
    const [activeInstitute, setActiveInstitute] = useState<string | null>(null);

    // Access filter context
    const { stuffFilters, setStuffInstitute } = useFilters();

    // Handler for institute change
    const handleInstituteChange = (institute: string | null) => {
        setActiveInstitute(institute);
        setStuffInstitute(institute);
    };

    return (
        <>
            <List>
                <Navigation
                    activeSection={activeSection}
                    onSectionChange={onSectionChange}
                />

                <Section>
                    <Cell
                        before={<Icon24Tutor_hat />}
                        after={
                            <Icon16Chevron_right
                                style={{ color: `var(--tgui--hint_color)` }}
                            />
                        }
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
                    >
                        Задать вопрос
                    </Cell>
                </Section>
            </List>

            {/* <Section
                header="Каналы студентов"
            >
                <Cell
                    before={
                        <Avatar>
                        </Avatar>
                    }
                    subtitle="Мой крутой канал про бла-бла и не только"
                >
                    Канал №1
                </Cell>
                <Cell
                    before={
                        <Avatar>
                        </Avatar>
                    }
                    subtitle="Мой крутой канал про бла-бла и не только"
                >
                    Канал №1
                </Cell>
                <Cell
                    before={
                        <Avatar>
                        </Avatar>
                    }
                    subtitle="Мой крутой канал про бла-бла и не только"
                >
                    Канал №1
                </Cell>
                <Cell
                    before={
                        <Avatar>
                        </Avatar>
                    }
                    subtitle="Мой крутой канал про бла-бла и не только"
                >
                    Канал №1
                </Cell>
                <Cell
                    before={
                        <Avatar>
                        </Avatar>
                    }
                    subtitle="Мой крутой канал про бла-бла и не только"
                >
                    Канал №1
                </Cell>
                <Cell
                    before={
                        <Avatar>
                        </Avatar>
                    }
                    subtitle="Мой крутой канал про бла-бла и не только"
                >
                    Канал №1
                </Cell>
                <Cell
                    before={
                        <Avatar>
                        </Avatar>
                    }
                    subtitle="Мой крутой канал про бла-бла и не только"
                >
                    Канал №1
                </Cell>
            </Section> */}

            {/* <SearchPanel
                activeSection={activeSection}
                activeInstitute={activeSection === 'stuff' ? activeInstitute : null}
                onInstituteChange={handleInstituteChange}
            /> */}
            <TabBar />
        </>
    );
};
