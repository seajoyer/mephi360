import { classNames } from '@telegram-apps/sdk-react';
import { Section, Cell, List, Avatar, Divider } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Icon24Chevron_right } from '@/../assets/icons/24/chevron_right';
import { Icon16Chevron_right } from '@/../assets/icons/16/chevron_right';
import { Icon28Heart_fill } from '@/../assets/icons/28/heart_fill';

import Sherbachev from '../../assets/Teachers/Щербачев ОВ.jpg';
import Goryachev from '../../assets/Teachers/Горячев АП.png';
import Ivanova from '../../assets/Teachers/Иванова ТМ.jpg';
import Agapova from '../../assets/Teachers/Агапова ВМ.jpg';
import Poprozhenko from '../../assets/Teachers/Попруженко СВ.jpg';
import Priishepa from '../../assets/Teachers/Прищепа АР.jpg';
import Savin from '../../assets/Teachers/Савин ВЮ.jpg';
import Stepin from '../../assets/Teachers/Степин ЕВ.jpg';
import Hramchenkov from '../../assets/Teachers/Храмченков ДВ.png';
import Shmaluy from '../../assets/Teachers/Шмалий ВВ.jpg';

import { SearchPanel } from '@/components/SearchPanel';

import { Link } from '@/components/Link/Link.tsx';

export const TeachersList: FC = () => {
    return (
        <Section>
            <Link to="https://home.mephi.ru"
            >
                <Cell
                    before={<Avatar
                        size={40}
                        src={Sherbachev}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра общей физики №6"
                >
                    {/* Щербачев Олег Вячеславович */}
                    Щербачев О.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Goryachev}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра высшей математики №30"
                >
                    {/* Горячев Александр Петрович */}
                    Горячев А.П.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Ivanova}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра высшей математики №30"
                >
                    {/* Иванова Татьяна Михайловна */}
                    Иванова Т.М.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Priishepa}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра общей физики №6"
                >
                    {/* Прищепа Анатолий Романович */}
                    Прищепа А.Р.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Stepin}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра прикладной математики № 31"
                >
                    {/* Стёпин Евгений Викторович */}
                    Стёпин Е.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Savin}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра высшей математики №30"
                >
                    {/* Савин Вячеслав Юрьевич */}
                    Савин В.Ю.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Agapova}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра иностранных языков №50"
                >
                    {/* Агапова Вероника Михайловна */}
                    Агапова В.М.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Hramchenkov}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра физики №23"
                >
                    {/* Храмченков Дмитрий Викторович */}
                    Храмченков Д.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Shmaluy}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Кафедра философии, онтологии и теории познания №54"
                >
                    {/* Шмалий Владимир Владимирович */}
                    Шмалий В.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
            <Divider />
            <Link to="/sherbachev">
                <Cell
                    before={<Avatar
                        size={40}
                        src={Poprozhenko}
                        fallbackIcon={<span><Icon28Heart_fill /></span>}
                    />}
                    after=<Icon16Chevron_right className={classNames('link')} />
                    description="Попруженко Сергей Васильевич"
                >
                    {/* Попруженко Сергей Васильевич */}
                    Попруженко С.В.
                </Cell>
            </Link>
        </Section>
    );
};
