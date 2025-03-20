import { Tutor } from '@/types/tutor';

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

    return Array.from({ length: count }, (_, index) => {
        const id = index + 1;
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const initial = fullNames[Math.floor(Math.random() * fullNames.length)];
        const name = `${lastName} ${initial}`;
        const department = departments[Math.floor(Math.random() * departments.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const lessonDescription = lessonDescriptions[Math.floor(Math.random() * lessonDescriptions.length)];

        // Generate random ratings between 3.0 and 5.0
        const generateRating = () => Math.round((3 + Math.random() * 2) * 10) / 10;

        const overallRating = generateRating();

        // Generate random number of total ratings
        const totalRatings = Math.floor(Math.random() * 40) + 5; // Between 5 and 44

        // Randomly decide if this tutor has a user rating
        const hasUserRating = Math.random() < 0.3; // 30% chance
        const userRating = hasUserRating ? {
            "Подача материала": generateRating(),
            "Отношение к студентам": generateRating(),
            "Требовательность": generateRating(),
            "Доступность": generateRating()
        } : undefined;

        return {
            id,
            name,
            department,
            position,
            imageFileName: `tutor${id % 5 + 1}.jpg`, // Cycle through 5 images
            ratings: {
                overallRating,
                categoryRatings: {
                    "Подача материала": generateRating(),
                    "Отношение к студентам": generateRating(),
                    "Требовательность": generateRating(),
                    "Доступность": generateRating()
                },
                totalRatings,
                userRating,
                educationalProcess: {
                    lessonStructure: lessonDescription,
                    intermediateAssessment: "Промежуточная аттестация включает выполнение лабораторных работ, рубежный контроль и контрольные работы. Преподаватель оценивает работу студентов на семинарах.",
                    finalAssessment: "Итоговая аттестация проводится в форме экзамена. Экзамен включает в себя теоретические вопросы и практические задания по всему курсу."
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
            "Отношение к студентам": 4.2,
            "Требовательность": 4.0,
            "Доступность": 4.5
        },
        totalRatings: 17, // Add total number of ratings
        // Example user rating for testing
        userRating: {
            "Подача материала": 4.0,
            "Отношение к студентам": 5.0,
            "Требовательность": 3.5,
            "Доступность": 4.0
        },
        educationalProcess: {
            lessonStructure: "Занятия проходят в формате лекций и практических семинаров. Преподаватель использует современные методики обучения и интерактивные материалы для лучшего понимания предмета. Студенты активно вовлекаются в образовательный процесс через дискуссии и групповую работу.",
            intermediateAssessment: "Промежуточная аттестация включает выполнение лабораторных работ, рубежный контроль и контрольные работы. Преподаватель оценивает работу студентов на семинарах.",
            finalAssessment: "Итоговая аттестация проводится в форме экзамена. Экзамен включает в себя теоретические вопросы и практические задания по всему курсу."
        }
    }
};

// Replace the first item with our consistent Goryachev
mockTutors[0] = mockGoryachev;
