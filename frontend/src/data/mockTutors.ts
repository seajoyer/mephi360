import { Tutor } from '@/types/tutor';
import { TUTOR_RATING_CATEGORIES } from '@/constants/ratingConstants';

// Generate a larger set of mock tutors
export const generateMockTutors = (count: number = 30): Tutor[] => {
    const departments = [
        'Кафедра №1',
        'Кафедра №30',
        'Кафедра №42',
        'Кафедра №7',
        'Кафедра №15'
    ];

    const positions = [
        'Доцент',
        'Профессор',
        'Старший препод.',
        'Преподаватель',
        'Ассистент'
    ];

    const lastNames = [
        'Иванов',
        'Петров',
        'Сидоров',
        'Смирнов',
        'Кузнецов',
        'Попов',
        'Васильев',
        'Соколов',
        'Михайлов',
        'Новиков',
        'Горячев'
    ];

    const fullNames = [
        'Александр Петрович',
        'Владимир Сергеевич',
        'Иван Иванович',
        'Михаил Владимирович',
        'Николай Андреевич',
        'Олег Евгеньевич',
        'Павел Константинович',
        'Роман Игоревич',
        'Сергей Леонидович',
        'Тимофей Николаевич'
    ];

    const lessonDescriptions = [
        'Занятия проходят в формате лекций и практических семинаров. Преподаватель использует современные методики обучения и интерактивные материалы для лучшего понимания предмета. Студенты активно вовлекаются в образовательный процесс через дискуссии и групповую работу.',
        'Лекционные занятия включают теоретический материал с примерами из практики. Семинары направлены на закрепление знаний и развитие практических навыков. Используются интерактивные методы обучения и технические средства для визуализации.',
        'Преподаватель сочетает традиционные методы обучения с инновационными подходами. На занятиях используются мультимедийные презентации, учебные видео и интерактивные задания. Большое внимание уделяется самостоятельной работе студентов.',
        'Структура занятий включает теоретическую часть и практические задания. Преподаватель обеспечивает индивидуальный подход к каждому студенту. Используются групповые проекты и дискуссии для развития коммуникативных навыков.',
        'Занятия строятся по принципу "от теории к практике". Преподаватель объясняет материал, демонстрирует примеры решения задач, после чего студенты выполняют самостоятельные задания под руководством преподавателя.'
    ];

    const intermediateAssessments = [
        'Промежуточная аттестация включает выполнение лабораторных работ, рубежный контроль и контрольные работы. Преподаватель оценивает работу студентов на семинарах.',
        'В течение семестра проводятся регулярные тесты и практические задания. Студенты должны выполнить курсовую работу и пройти коллоквиум в середине семестра.',
        'Промежуточная аттестация состоит из двух контрольных работ, серии домашних заданий и защиты проекта. Учитывается активность на занятиях.',
        'Студенты проходят два рубежных контроля, выполняют индивидуальные и групповые проекты. Преподаватель регулярно проводит опросы и тестирования.'
    ];

    const finalAssessments = [
        'Итоговая аттестация проводится в форме экзамена. Экзамен включает в себя теоретические вопросы и практические задания по всему курсу.',
        'Итоговый экзамен состоит из письменной части и устного собеседования. Учитываются результаты работы в течение семестра.',
        'Для успешной сдачи курса необходимо сдать экзамен, который включает как теоретические вопросы, так и практические задачи. Экзамен проводится в письменной форме.',
        'Итоговая аттестация проходит в виде комплексного экзамена, включающего тестирование, решение задач и собеседование по ключевым темам курса.'
    ];

    return Array.from({ length: count }, (_, index) => {
        const id = index + 1;
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const initial = fullNames[Math.floor(Math.random() * fullNames.length)];
        const name = `${lastName} ${initial}`;
        const department = departments[Math.floor(Math.random() * departments.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const lessonDescription = lessonDescriptions[Math.floor(Math.random() * lessonDescriptions.length)];
        const intermediateAssessment = intermediateAssessments[Math.floor(Math.random() * intermediateAssessments.length)];
        const finalAssessment = finalAssessments[Math.floor(Math.random() * finalAssessments.length)];

        // Generate random ratings between 3.0 and 5.0
        const generateRating = () => Math.round((3 + Math.random() * 2) * 10) / 10;

        const overallRating = generateRating();

        // Generate random number of total ratings
        const totalRaters = Math.floor(Math.random() * 40) + 5; // Between 5 and 44

        // Create category ratings using the defined categories
        const categoryRatings: { [key: string]: number } = {};
        TUTOR_RATING_CATEGORIES.forEach(category => {
            categoryRatings[category] = generateRating();
        });

        return {
            id,
            name,
            department,
            position,
            imageFileName: `tutor${id % 5 + 1}.jpg`, // Cycle through 5 images
            ratings: {
                overallRating,
                categoryRatings,
                totalRaters,
                educationalProcess: {
                    lessonStructure: lessonDescription,
                    intermediateAssessment,
                    finalAssessment
                }
            }
        };
    });
};

// Export default mock tutors
export const mockTutors = generateMockTutors();

// Create a specific tutor that will always be Горячев А.П. with ID 1
export const mockGoryachev: Tutor = {
    id: 1,
    name: "Горячев А.П.",
    department: "Кафедра №30",
    position: "Доцент",
    imageFileName: "tutor1.jpg",
    ratings: {
        overallRating: 4.3,
        categoryRatings: {
            "Подача материала": 4.5,
            "«Халявность»": 4.2,
            "Знания": 4.0,
            "В общении": 4.5
        },
        totalRaters: 17,
        educationalProcess: {
            lessonStructure: "Занятия проходят в формате лекций и практических семинаров. Преподаватель использует современные методики обучения и интерактивные материалы для лучшего понимания предмета. Студенты активно вовлекаются в образовательный процесс через дискуссии и групповую работу.",
            intermediateAssessment: "Промежуточная аттестация включает выполнение лабораторных работ, рубежный контроль и контрольные работы. Преподаватель оценивает работу студентов на семинарах.",
            finalAssessment: "Итоговая аттестация проводится в форме экзамена. Экзамен включает в себя теоретические вопросы и практические задания по всему курсу."
        }
    }
};

// Replace the first item with our consistent Goryachev
mockTutors[0] = mockGoryachev;
