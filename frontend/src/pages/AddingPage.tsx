import React, { useState } from 'react';
import { List, Input, Text, Select, Section, Textarea, Button, Divider, FixedLayout } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';

const AddingPage = () => {
    const [entityType, setEntityType] = useState('Teacher');

    const handleEntityChange = (e) => {
        setEntityType(e.target.value);
    };

    // Render the appropriate form based on the selected entity type
    const renderForm = () => {
        switch (entityType) {
            case 'Teacher':
                return <TeacherForm />;
            case 'Department':
                return <DepartmentForm />;
            case 'Club':
                return <ClubForm />;
            case 'Circle':
                return <CircleForm />;
            case 'Active':
                return <ActiveForm />;
            case 'Stuff':
                return <StuffForm />;
            default:
                return <TeacherForm />;
        }
    };

    return (
        <Page back={true}>
            <List>
                <Select
                    before={
                        <div
                            className='pl-4'
                        >
                            <Text weight='3'>
                                Добавить
                            </Text>
                        </div>
                    }
                    value={entityType}
                    onChange={handleEntityChange}
                >
                    <option value="Teacher">преподавателя</option>
                    <option value="Department">кафедру</option>
                    <option value="Club">клуб</option>
                    <option value="Circle">кружок</option>
                    <option value="Active">актив</option>
                    <option value="Stuff">материал</option>
                </Select>

                {renderForm()}

            </List>
        </Page>
    );
};

// Teacher Form Component
const TeacherForm = () => {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [proofLink, setProofLink] = useState('');

    const handleSubmit = () => {
        // Handle form submission
        console.log({ name, department, proofLink });
        // Add API call or state update logic here
    };

    return (
        <>
            <Section>
                <Textarea
                    placeholder="ФИО (полностью)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Divider />
                <Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option value="1">Кафедра №1</option>
                    <option value="2">Кафедра №2</option>
                    <option value="3">Кафедра №3</option>
                    <option value="4">Кафедра №4</option>
                    <option value="5">Кафедра №5</option>
                    <option value="6">Кафедра №6</option>
                    <option value="7">Кафедра №7</option>
                    <option value="8">Кафедра №8</option>
                    <option value="9">Кафедра №9</option>
                </Select>
            </Section>
            <Section header="Подтверждающая ссылка">
                <Textarea
                    placeholder="home.mephi.ru/..."
                    value={proofLink}
                    onChange={(e) => setProofLink(e.target.value)}
                />
            </Section>
            <FixedLayout
                vertical="bottom"
                className='px-3'
                style={{ zIndex: 2000 }}
            >
                <Button
                    onClick={handleSubmit}
                    className='w-full'
                    size='l'
                    disabled
                >
                    Добавить
                </Button>
                <div className='py-9.25' />
            </FixedLayout>
        </>
    );
};

// Department Form Component
const DepartmentForm = () => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [proofLink, setProofLink] = useState('');

    const handleSubmit = () => {
        console.log({ name, number, proofLink });
        // Add API call or state update logic here
    };

    return (
        <>
            <Section>
                <Textarea
                    placeholder="Полное название кафедры"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Divider />
                <Input
                    placeholder="Номер кафедры"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />
            </Section>
            <Section header="Подтверждающая ссылка">
                <Textarea
                    placeholder="home.mephi.ru/..."
                    value={proofLink}
                    onChange={(e) => setProofLink(e.target.value)}
                />
            </Section>
            <FixedLayout
                vertical="bottom"
                className='px-3'
                style={{ zIndex: 2000 }}
            >
                <Button
                    onClick={handleSubmit}
                    className='w-full'
                    size='l'
                    disabled
                >
                    Добавить
                </Button>
                <div className='py-9.25' />
            </FixedLayout>
        </>
    );
};

// Club Form Component
const ClubForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = () => {
        console.log({ name, description, link });
        // Add API call or state update logic here
    };

    return (
        <>
            <Section>
                <Input
                    placeholder="Название клуба"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Divider />
                <Textarea
                    placeholder="Описание"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Section>
            <Section header="Ссылка">
                <Textarea
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </Section>
            <FixedLayout
                vertical="bottom"
                className='px-3'
                style={{ zIndex: 2000 }}
            >
                <Button
                    onClick={handleSubmit}
                    className='w-full'
                    size='l'
                    disabled
                >
                    Добавить
                </Button>
                <div className='py-9.25' />
            </FixedLayout>
        </>
    );
};

// Circle Form Component
const CircleForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [link, setLink] = useState('');


    const handleSubmit = () => {
        console.log({ name, description, subject, organizer, link });
        // Add API call or state update logic here
    };

    return (
        <>
            <Section>
                <Input
                    placeholder="Название кружка"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Divider />
                <Textarea
                    placeholder="Описание"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Section>
            <Section header="Предмет и организатор">
                <Select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                >
                    <option value="1">Математика</option>
                    <option value="2">Физика</option>
                    <option value="3">Химия</option>
                    <option value="4">Прога</option>
                    <option value="5">Астрономия</option>
                    <option value="6">Проектирование</option>
                    <option value="7">Дизайн</option>
                    <option value="8">Бизнес</option>
                </Select>
                <Select
                    value={organizer}
                    onChange={(e) => setSubject(e.target.value)}
                >
                    <option value="4">МатЛига</option>
                    <option value="3">СНО</option>
                    <option value="2">ОСО</option>
                    <option value="1">Старостат</option>
                    <option value="5">EngiTeams</option>
                    <option value="6">Бизнес клуб</option>
                </Select>
            </Section>
            <Section header="Ссылка">
                <Textarea
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </Section>
            <FixedLayout
                vertical="bottom"
                className='px-3'
                style={{ zIndex: 2000 }}
            >
                <Button
                    onClick={handleSubmit}
                    className='w-full'
                    size='l'
                    disabled
                >
                    Добавить
                </Button>
                <div className='py-9.25' />
            </FixedLayout>
        </>
    );
};

// Active Form Component
const ActiveForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = () => {
        console.log({ name, description, link });
        // Add API call or state update logic here
    };

    return (
        <>
            <Section>
                <Input
                    placeholder="Название"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                    placeholder="Описание"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Section>
            <Section header="Ссылка">
                <Textarea
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </Section>
            <FixedLayout
                vertical="bottom"
                className='px-3'
                style={{ zIndex: 2000 }}
            >
                <Button
                    onClick={handleSubmit}
                    className='w-full'
                    size='l'
                    disabled
                >
                    Добавить
                </Button>
                <div className='py-9.25' />
            </FixedLayout>
        </>
    );
};

// Stuff Form Component with special logic for non-existent teachers/subjects
const StuffForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [teacher, setTeacher] = useState('');
    const [subject, setSubject] = useState('');
    const [semester, setSemester] = useState('');

    // States for handling non-existent teachers/subjects
    const [teacherExists, setTeacherExists] = useState(true);
    const [subjectExists, setSubjectExists] = useState(true);
    const [teacherInputDisabled, setTeacherInputDisabled] = useState(false);
    const [subjectInputDisabled, setSubjectInputDisabled] = useState(false);
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [showSubjectForm, setShowSubjectForm] = useState(false);
    const [newTeacherDepartment, setNewTeacherDepartment] = useState('');

    // Mock function to check if teacher exists (replace with actual API call)
    const checkTeacherExists = (teacherName) => {
        // Simulate API call to check if teacher exists
        // For demo purposes, let's say a teacher doesn't exist if the name contains "new"
        if (teacherName.toLowerCase().includes('new')) {
            setTeacherExists(false);
        } else {
            setTeacherExists(true);
        }
    };

    // Mock function to check if subject exists (replace with actual API call)
    const checkSubjectExists = (subjectName) => {
        // Simulate API call to check if subject exists
        // For demo purposes, let's say a subject doesn't exist if the name contains "new"
        if (subjectName.toLowerCase().includes('new')) {
            setSubjectExists(false);
        } else {
            setSubjectExists(true);
        }
    };

    // Handle teacher input change
    const handleTeacherChange = (e) => {
        const value = e.target.value;
        setTeacher(value);
        if (value.trim()) {
            checkTeacherExists(value);
        } else {
            setTeacherExists(true); // Reset state if input is empty
        }
    };

    // Handle subject input change
    const handleSubjectChange = (e) => {
        const value = e.target.value;
        setSubject(value);
        if (value.trim()) {
            checkSubjectExists(value);
        } else {
            setSubjectExists(true); // Reset state if input is empty
        }
    };

    // Handle adding a new teacher
    const handleAddTeacher = () => {
        setTeacherInputDisabled(true);
        setShowTeacherForm(true);
    };

    // Handle adding a new subject
    const handleAddSubject = () => {
        setSubjectInputDisabled(true);
        setShowSubjectForm(true);
    };

    // Handle confirming new teacher
    const handleConfirmTeacher = () => {
        // Here you would typically save the new teacher to your backend
        console.log('Adding new teacher:', { name: teacher, department: newTeacherDepartment });
        setTeacherExists(true);
        setShowTeacherForm(false);
        setTeacherInputDisabled(false);
    };

    // Handle confirming new subject
    const handleConfirmSubject = () => {
        // Here you would typically save the new subject to your backend
        console.log('Adding new subject:', { name: subject });
        setSubjectExists(true);
        setShowSubjectForm(false);
        setSubjectInputDisabled(false);
    };

    // Handle cancel adding new teacher
    const handleCancelTeacher = () => {
        setShowTeacherForm(false);
        setTeacherInputDisabled(false);
    };

    // Handle cancel adding new subject
    const handleCancelSubject = () => {
        setShowSubjectForm(false);
        setSubjectInputDisabled(false);
    };

    const handleSubmit = () => {
        console.log({ title, description, type, teacher, subject, semester });
        // Add API call or state update logic here
    };

    return (
        <>
            <div className='flex gap-2'>
                <div className="flex-1 min-w-[190px]">
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full"
                    >
                        <option value="test">Контрольная</option>
                        <option value="lab">Лабораторная</option>
                        <option value="course">Курсовая</option>
                        <option value="bdz">БДЗ</option>
                        <option value="exam">Экзамен</option>
                        <option value="etc">Прочее</option>
                    </Select>
                </div>

                <div className="flex-1">
                    <Select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full"
                    >
                        <option value="1">1 сем</option>
                        <option value="2">2 сем</option>
                        <option value="3">3 сем</option>
                        <option value="4">4 сем</option>
                        <option value="5">5 сем</option>
                        <option value="6">6 сем</option>
                        <option value="7">7 сем</option>
                        <option value="8">8 сем</option>
                    </Select>
                </div>
            </div>

            <Section>
                <Input
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                    placeholder="Описание (опционально)"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Section>


            {/* Teacher input with special handling for non-existent teachers */}
            {!showTeacherForm && (
                <Section
                    header="Преподаватель"
                    footer={!teacherExists ? (
                        <div>
                            Преподаватель пока не добавлен, <button onClick={handleAddTeacher}>добавить</button>
                        </div>
                    ) : null}
                >
                    <Input
                        placeholder="ФИО"
                        status={!teacherExists ? 'error' : undefined}
                        disabled={teacherInputDisabled}
                        value={teacher}
                        onChange={handleTeacherChange}
                    />
                </Section>
            )}

            {/* Form for adding a new teacher */}
            {showTeacherForm && (
                <>
                    <Section header="Новый преподаватель" className="transition-all duration-300">
                        <Input placeholder="ФИО" value={teacher} />
                        <Select
                            value={newTeacherDepartment}
                            onChange={(e) => setNewTeacherDepartment(e.target.value)}
                        >
                            <option value="1">Кафедра №1</option>
                            <option value="2">Кафедра №2</option>
                            <option value="3">Кафедра №3</option>
                            <option value="4">Кафедра №4</option>
                            <option value="5">Кафедра №5</option>
                            <option value="6">Кафедра №6</option>
                            <option value="7">Кафедра №7</option>
                            <option value="8">Кафедра №8</option>
                            <option value="9">Кафедра №9</option>
                        </Select>
                    </Section>
                    <div className="flex justify-between mt-4">
                        <Button
                            onClick={handleConfirmTeacher}
                            mode='bezeled'
                            size='s'
                        >
                            Добавить
                        </Button>
                        <Button
                            onClick={handleCancelTeacher}
                            mode="plain"
                            size='s'
                        >
                            Отмена
                        </Button>
                    </div>
                </>
            )}

            {/* Subject input with special handling for non-existent subjects */}
            {!showSubjectForm && (
                <Section
                    header="Предмет"
                    footer={!subjectExists ? (
                        <div>
                            Предмет пока не добавлен, <button onClick={handleAddSubject}>добавить</button>
                        </div>
                    ) : null}
                >
                    <Textarea
                        placeholder="Математический анализ"
                        status={!subjectExists ? 'error' : undefined}
                        disabled={subjectInputDisabled}
                        value={subject}
                        onChange={handleSubjectChange}
                    />
                </Section>
            )}

            {/* Form for adding a new subject */}
            {showSubjectForm && (
                <>
                    <Section header="Новый предмет">
                        <Textarea placeholder="Полное название, как в расписании" value={subject} disabled />
                    </Section>
                    <div className="flex justify-between mt-4">
                        <Button
                            onClick={handleConfirmSubject}
                            mode='bezeled'
                            size='s'
                        >
                            Добавить
                        </Button>
                        <Button
                            onClick={handleCancelSubject}
                            mode="plain"
                            size='s'
                        >
                            Отмена
                        </Button>
                    </div>
                </>
            )}

            <FixedLayout
                vertical="bottom"
                className='px-3'
            >
                <Button
                    onClick={handleSubmit}
                    className='w-full'
                    size='l'
                    disabled
                >
                    Добавить
                </Button>
                <div className='py-9.25' />
            </FixedLayout>
        </>
    );
};

export default AddingPage;
