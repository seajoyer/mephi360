import React, { useState, useEffect } from 'react';
import { List, Input, Text, Select, Section, Textarea, Divider } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { useAddingPage, EntityType } from '@/contexts/AddingPageContext';

const AddingPage = () => {
    const {
        entityType,
        setEntityType,
        formData,
        updateFormData,
        setIsFormValid
    } = useAddingPage();

    const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEntityType(e.target.value as EntityType);

        // Reset form data when entity type changes
        updateFormData({});
        setIsFormValid(false);
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
        </Page>
    );
};

// Teacher Form Component
const TeacherForm = () => {
    const { updateFormData, formData, setIsFormValid } = useAddingPage();
    const [name, setName] = useState(formData.name || '');
    const [department, setDepartment] = useState(formData.department || '');
    const [proofLink, setProofLink] = useState(formData.proofLink || '');

    // Update form data when inputs change
    useEffect(() => {
        updateFormData({ name, department, proofLink });

        // Check if form is valid
        setIsFormValid(name.trim() !== '' && department !== '');
    }, [name, department, proofLink, updateFormData, setIsFormValid]);

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
        </>
    );
};

// Department Form Component
const DepartmentForm = () => {
    const { updateFormData, formData, setIsFormValid } = useAddingPage();
    const [name, setName] = useState(formData.name || '');
    const [number, setNumber] = useState(formData.number || '');
    const [proofLink, setProofLink] = useState(formData.proofLink || '');

    // Update form data when inputs change
    useEffect(() => {
        updateFormData({ name, number, proofLink });

        // Check if form is valid
        setIsFormValid(name.trim() !== '' && number.trim() !== '');
    }, [name, number, proofLink, updateFormData, setIsFormValid]);

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
        </>
    );
};

// Club Form Component
const ClubForm = () => {
    const { updateFormData, formData, setIsFormValid } = useAddingPage();
    const [name, setName] = useState(formData.name || '');
    const [description, setDescription] = useState(formData.description || '');
    const [link, setLink] = useState(formData.link || '');

    // Update form data when inputs change
    useEffect(() => {
        updateFormData({ name, description, link });

        // Check if form is valid
        setIsFormValid(name.trim() !== '');
    }, [name, description, link, updateFormData, setIsFormValid]);

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
        </>
    );
};

// Circle Form Component
const CircleForm = () => {
    const { updateFormData, formData, setIsFormValid } = useAddingPage();
    const [name, setName] = useState(formData.name || '');
    const [description, setDescription] = useState(formData.description || '');
    const [subject, setSubject] = useState(formData.subject || '');
    const [organizer, setOrganizer] = useState(formData.organizer || '');
    const [link, setLink] = useState(formData.link || '');

    // Update form data when inputs change
    useEffect(() => {
        updateFormData({ name, description, subject, organizer, link });

        // Check if form is valid
        setIsFormValid(name.trim() !== '' && subject !== '' && organizer !== '');
    }, [name, description, subject, organizer, link, updateFormData, setIsFormValid]);

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
                    onChange={(e) => setOrganizer(e.target.value)}
                >
                    <option value="">Организатор</option>
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
        </>
    );
};

// Active Form Component
const ActiveForm = () => {
    const { updateFormData, formData, setIsFormValid } = useAddingPage();
    const [name, setName] = useState(formData.name || '');
    const [description, setDescription] = useState(formData.description || '');
    const [link, setLink] = useState(formData.link || '');

    // Update form data when inputs change
    useEffect(() => {
        updateFormData({ name, description, link });

        // Check if form is valid
        setIsFormValid(name.trim() !== '');
    }, [name, description, link, updateFormData, setIsFormValid]);

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
        </>
    );
};

// Stuff Form Component with special logic for non-existent teachers/subjects
const StuffForm = () => {
    const { updateFormData, formData, setIsFormValid } = useAddingPage();
    const [title, setTitle] = useState(formData.title || '');
    const [description, setDescription] = useState(formData.description || '');
    const [type, setType] = useState(formData.type || '');
    const [teacher, setTeacher] = useState(formData.teacher || '');
    const [subject, setSubject] = useState(formData.subject || '');
    const [semester, setSemester] = useState(formData.semester || '');

    // States for handling non-existent teachers/subjects
    const [teacherExists, setTeacherExists] = useState(true);
    const [subjectExists, setSubjectExists] = useState(true);
    const [teacherInputDisabled, setTeacherInputDisabled] = useState(false);
    const [subjectInputDisabled, setSubjectInputDisabled] = useState(false);
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [showSubjectForm, setShowSubjectForm] = useState(false);
    const [newTeacherDepartment, setNewTeacherDepartment] = useState(formData.newTeacherDepartment || '');

    // Update form data when inputs change
    useEffect(() => {
        updateFormData({
            title,
            description,
            type,
            teacher,
            subject,
            semester,
            newTeacherDepartment,
            teacherExists,
            subjectExists,
            showTeacherForm,
            showSubjectForm
        });

        // Check if form is valid
        const isValid = title.trim() !== '' &&
            type !== '' &&
            teacher.trim() !== '' &&
            subject.trim() !== '' &&
            semester !== '' &&
            teacherExists &&
            subjectExists;

        setIsFormValid(isValid);
    }, [
        title, description, type, teacher, subject, semester,
        teacherExists, subjectExists, newTeacherDepartment,
        showTeacherForm, showSubjectForm,
        updateFormData, setIsFormValid
    ]);

    // Mock function to check if teacher exists (replace with actual API call)
    const checkTeacherExists = (teacherName: string) => {
        // Simulate API call to check if teacher exists
        // For demo purposes, let's say a teacher doesn't exist if the name contains "new"
        if (teacherName.toLowerCase().includes('new')) {
            setTeacherExists(false);
        } else {
            setTeacherExists(true);
        }
    };

    // Mock function to check if subject exists (replace with actual API call)
    const checkSubjectExists = (subjectName: string) => {
        // Simulate API call to check if subject exists
        // For demo purposes, let's say a subject doesn't exist if the name contains "new"
        if (subjectName.toLowerCase().includes('new')) {
            setSubjectExists(false);
        } else {
            setSubjectExists(true);
        }
    };

    // Handle teacher input change
    const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTeacher(value);
        if (value.trim()) {
            checkTeacherExists(value);
        } else {
            setTeacherExists(true); // Reset state if input is empty
        }
    };

    // Handle subject input change
    const handleSubjectChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                            <option value="">Укажите кафедру</option>
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
                        <div>
                            <button
                                className="button button--s button--bezeled"
                                onClick={handleConfirmTeacher}
                            >
                                Добавить
                            </button>
                        </div>
                        <div>
                            <button
                                className="button button--s button--plain"
                                onClick={handleCancelTeacher}
                            >
                                Отмена
                            </button>
                        </div>
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
                        <div>
                            <button
                                className="button button--s button--bezeled"
                                onClick={handleConfirmSubject}
                            >
                                Добавить
                            </button>
                        </div>
                        <div>
                            <button
                                className="button button--s button--plain"
                                onClick={handleCancelSubject}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default AddingPage;
