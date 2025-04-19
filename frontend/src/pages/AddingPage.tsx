import React, { useState } from 'react';
import { List, Input, Text, Select, Section, Textarea, Button, Divider } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { KeyboardAwareFixedLayout } from '@/components/common/KeyboardAwareFixedLayout';
import { TabBar } from '@/components/layout/TabBar';

const AddingPage = () => {
    const [entityType, setEntityType] = useState('Teacher');
    const [formData, setFormData] = useState({});
    const [formIsValid, setFormIsValid] = useState(false);

    const handleEntityChange = (e) => {
        setEntityType(e.target.value);
        // Reset form data and validation when entity type changes
        setFormData({});
        setFormIsValid(false);
    };

    // Generic function to update form data
    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    // Generic function to handle form submission
    const handleSubmit = () => {
        console.log(`Submitting ${entityType} form:`, formData);

        // Here you would implement your API call to submit the data
        // Different actions based on entity type
        switch (entityType) {
            case 'Teacher':
                console.log('Adding new teacher...');
                // Teacher-specific submission logic
                break;
            case 'Department':
                console.log('Adding new department...');
                // Department-specific submission logic
                break;
            case 'Club':
                console.log('Adding new club...');
                // Club-specific submission logic
                break;
            case 'Circle':
                console.log('Adding new circle...');
                // Circle-specific submission logic
                break;
            case 'Active':
                console.log('Adding new active...');
                // Active-specific submission logic
                break;
            case 'Stuff':
                console.log('Adding new stuff...');
                // Stuff-specific submission logic
                break;
            default:
                console.log('Unknown entity type:', entityType);
        }
    };

    // Render the appropriate form based on the selected entity type
    const renderForm = () => {
        switch (entityType) {
            case 'Teacher':
                return <TeacherForm
                    formData={formData}
                    updateFormData={updateFormData}
                    setFormIsValid={setFormIsValid}
                />;
            case 'Department':
                return <DepartmentForm
                    formData={formData}
                    updateFormData={updateFormData}
                    setFormIsValid={setFormIsValid}
                />;
            case 'Club':
                return <ClubForm
                    formData={formData}
                    updateFormData={updateFormData}
                    setFormIsValid={setFormIsValid}
                />;
            case 'Circle':
                return <CircleForm
                    formData={formData}
                    updateFormData={updateFormData}
                    setFormIsValid={setFormIsValid}
                />;
            case 'Active':
                return <ActiveForm
                    formData={formData}
                    updateFormData={updateFormData}
                    setFormIsValid={setFormIsValid}
                />;
            case 'Stuff':
                return <StuffForm
                    formData={formData}
                    updateFormData={updateFormData}
                    setFormIsValid={setFormIsValid}
                />;
            default:
                return <TeacherForm
                    formData={formData}
                    updateFormData={updateFormData}
                    setFormIsValid={setFormIsValid}
                />;
        }
    };

    return (
        <Page back={true}>
            <List>
                <Select
                    value={entityType}
                    onChange={handleEntityChange}
                >
                    <option value="Teacher">Добавить преподавателя</option>
                    <option value="Department">Добавить кафедру</option>
                    <option value="Club">Добавить клуб</option>
                    <option value="Circle">Добавить кружок</option>
                    <option value="Active">Добавить актив</option>
                    <option value="Stuff">Добавить материал</option>
                </Select>

                {renderForm()}

            </List>

            {/* Single "Добавить" button for all forms */}
            <KeyboardAwareFixedLayout
                vertical="bottom"
                className='px-3 mb-5'
            >
                <Button
                    onClick={handleSubmit}
                    stretched
                    size='l'
                    disabled={!formIsValid}
                >
                    Добавить
                </Button>
            </KeyboardAwareFixedLayout>
        </Page>
    );
};

// Teacher Form Component
const TeacherForm = ({ formData, updateFormData, setFormIsValid }) => {
    const { name = '', department = '', proofLink = '' } = formData;

    // Update validation state whenever inputs change
    React.useEffect(() => {
        const isValid = name.trim() !== '' && department !== '';
        setFormIsValid(isValid);
    }, [name, department, setFormIsValid]);

    return (
        <>
            <Section>
                <Textarea
                    placeholder="ФИО (полностью)"
                    value={name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                />
                <Divider />
                <Select
                    value={department}
                    onChange={(e) => updateFormData({ department: e.target.value })}
                >
                    <option value="">Выберите кафедру</option>
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
                    onChange={(e) => updateFormData({ proofLink: e.target.value })}
                />
            </Section>
        </>
    );
};

// Department Form Component
const DepartmentForm = ({ formData, updateFormData, setFormIsValid }) => {
    const { name = '', number = '', proofLink = '' } = formData;

    // Update validation state whenever inputs change
    React.useEffect(() => {
        const isValid = name.trim() !== '' && number.trim() !== '';
        setFormIsValid(isValid);
    }, [name, number, setFormIsValid]);

    return (
        <>
            <Section>
                <Textarea
                    placeholder="Полное название кафедры"
                    value={name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                />
                <Divider />
                <Input
                    placeholder="Номер кафедры"
                    value={number}
                    onChange={(e) => updateFormData({ number: e.target.value })}
                />
            </Section>
            <Section header="Подтверждающая ссылка">
                <Textarea
                    placeholder="home.mephi.ru/..."
                    value={proofLink}
                    onChange={(e) => updateFormData({ proofLink: e.target.value })}
                />
            </Section>
        </>
    );
};

// Club Form Component
const ClubForm = ({ formData, updateFormData, setFormIsValid }) => {
    const { name = '', description = '', link = '' } = formData;

    // Update validation state whenever inputs change
    React.useEffect(() => {
        const isValid = name.trim() !== '';
        setFormIsValid(isValid);
    }, [name, setFormIsValid]);

    return (
        <>
            <Section>
                <Input
                    placeholder="Название клуба"
                    value={name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                />
                <Divider />
                <Textarea
                    placeholder="Описание"
                    rows={3}
                    value={description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                />
            </Section>
            <Section header="Ссылка">
                <Textarea
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => updateFormData({ link: e.target.value })}
                />
            </Section>
        </>
    );
};

// Circle Form Component
const CircleForm = ({ formData, updateFormData, setFormIsValid }) => {
    const { name = '', description = '', subject = '', organizer = '', link = '' } = formData;

    // Update validation state whenever inputs change
    React.useEffect(() => {
        const isValid = name.trim() !== '' && subject !== '';
        setFormIsValid(isValid);
    }, [name, subject, setFormIsValid]);

    return (
        <>
            <Section>
                <Input
                    placeholder="Название кружка"
                    value={name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                />
                <Divider />
                <Textarea
                    placeholder="Описание"
                    rows={3}
                    value={description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                />
            </Section>
            <Section header="Предмет и организатор">
                <Select
                    value={subject}
                    onChange={(e) => updateFormData({ subject: e.target.value })}
                >
                    <option value="">Выберите предмет</option>
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
                    onChange={(e) => updateFormData({ organizer: e.target.value })}
                >
                    <option value="">Выберите организатора</option>
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
                    onChange={(e) => updateFormData({ link: e.target.value })}
                />
            </Section>
        </>
    );
};

// Active Form Component
const ActiveForm = ({ formData, updateFormData, setFormIsValid }) => {
    const { name = '', description = '', link = '' } = formData;

    // Update validation state whenever inputs change
    React.useEffect(() => {
        const isValid = name.trim() !== '';
        setFormIsValid(isValid);
    }, [name, setFormIsValid]);

    return (
        <>
            <Section>
                <Input
                    placeholder="Название"
                    value={name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                />
                <Textarea
                    placeholder="Описание"
                    rows={3}
                    value={description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                />
            </Section>
            <Section header="Ссылка">
                <Textarea
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => updateFormData({ link: e.target.value })}
                />
            </Section>
        </>
    );
};

// Stuff Form Component with special logic for non-existent teachers/subjects
const StuffForm = ({ formData, updateFormData, setFormIsValid }) => {
    const {
        title = '',
        description = '',
        type = '',
        teacher = '',
        subject = '',
        semester = '',
        newTeacherDepartment = ''
    } = formData;

    // States for handling non-existent teachers/subjects
    const [teacherExists, setTeacherExists] = useState(true);
    const [subjectExists, setSubjectExists] = useState(true);
    const [teacherInputDisabled, setTeacherInputDisabled] = useState(false);
    const [subjectInputDisabled, setSubjectInputDisabled] = useState(false);
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [showSubjectForm, setShowSubjectForm] = useState(false);

    // Update validation state whenever inputs change
    React.useEffect(() => {
        const isValid = title.trim() !== '' && type !== '' && teacher.trim() !== '' && subject.trim() !== '';
        setFormIsValid(isValid);
    }, [title, type, teacher, subject, setFormIsValid]);

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
        updateFormData({ teacher: value });
        if (value.trim()) {
            checkTeacherExists(value);
        } else {
            setTeacherExists(true); // Reset state if input is empty
        }
    };

    // Handle subject input change
    const handleSubjectChange = (e) => {
        const value = e.target.value;
        updateFormData({ subject: value });
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

    return (
        <>
            <div className='flex gap-2'>
                <div className="flex-1 min-w-[190px]">
                    <Select
                        value={type}
                        onChange={(e) => updateFormData({ type: e.target.value })}
                        className="w-full"
                    >
                        <option value="">Выберите тип</option>
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
                        onChange={(e) => updateFormData({ semester: e.target.value })}
                        className="w-full"
                    >
                        <option value="">Выберите семестр</option>
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
                    onChange={(e) => updateFormData({ title: e.target.value })}
                />
                <Textarea
                    placeholder="Описание (опционально)"
                    rows={3}
                    value={description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
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
                        <Input placeholder="ФИО" value={teacher} disabled />
                        <Select
                            value={newTeacherDepartment}
                            onChange={(e) => updateFormData({ newTeacherDepartment: e.target.value })}
                        >
                            <option value="">Выберите кафедру</option>
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
        </>
    );
};

export default AddingPage;
