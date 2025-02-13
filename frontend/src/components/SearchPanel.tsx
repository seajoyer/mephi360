import { Subheadline, Button, List, Input, Tappable } from '@telegram-apps/telegram-ui';

import { Icon20Chevron_vertical } from '@/../assets/icons/20/chevron_vertical';
import { Icon24Search } from '@/../assets/icons/24/search';
import { Icon24Close } from '@/../assets/icons/24/close';


import { useState } from 'react'
import type { FC } from 'react';

export const SearchPanel: FC = () => {

    /* const [interests, setInterests] = useState<MultiselectOption[]>([]); */

    const [value, setValue] = useState('');

    return (
        <div className="sticky top-2 z-10">
            <div className="absolute inset-x-0 -top-2 -bottom-2" style={{ backgroundColor: 'var(--tgui--secondary_bg_color)' }} />
            <div className="flex relative gap-2 pl-2">
                <Button
                    mode="gray"
                    size="m"
                    style={{
                        padding: 8
                    }}
                >
                    <Icon24Search />
                </Button>
                <Button
                    mode="gray"
                    size="m"
                    after={<Icon20Chevron_vertical />}
                    style={{
                        padding: 8
                    }}
                >
                    <Subheadline
                        level="2"
                        style={{
                            color: 'var(--tgui--hint_color)',
                        }}
                    >
                        <span className='font-medium'>Все кафедры</span>
                    </Subheadline>
                </Button>

                {/* <Chip
                mode="elevated"
                style={{
                    padding: 8
                }}
            >
                <Icon24Search />
            </Chip> */}
                {/* <Chip
                mode="elevated"
                after={<Icon16Chevron_vertical />}
                style={{
                    placeSelf: 'center',
                    padding: 8
                }}
            >
                <Subheadline
                    level="2"
                >
                    <span className='font-medium'>Все кафедры</span>
                </Subheadline>
            </Chip> */}
                {/* <Multiselect
                placeholder='Все кафедры'
                value={interests}
                closeDropdownAfterSelect
                selectedBehavior='hide'

                options={[
                { label: 'Кафедра иностранных языков №50', value: '1' },
                { label: 'Кафедра физики №23', value: '2' },
                { label: 'Кафедра высшей математики №30', value: '3' },
                { label: 'Кафедра общей физики №6', value: '4' },
                { label: 'Кафедра прикладной математики № 31', value: '5' },
                { label: 'Кафедра философии, онтологии и теории познания №54', value: '6' },
                ]}

                // onChange={(selected: any) => setGender(selected)}
                onChange={(e: MultiselectOption[]) => setInterests(e)}
                >
            </Multiselect> */}
            </div>
        </div>
    );
};
