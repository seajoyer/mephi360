import { Department } from '@/types/department';
import { DEPARTMENT_RATING_CATEGORIES } from '@/constants/departmentConstants';

// Generate mock departments
export const generateMockDepartments = (count: number = 10): Department[] => {
    const departmentNumbers = [
        "№97",
        "№30",
        "№42",
        "№7",
        "№15",
        "№22",
        "№36",
        "№51",
        "№64",
        "№83"
    ];

    const departmentNames = [
        "Теоретической ядерной физики",
        "Прикладной математики",
        "Квантовой электроники",
        "Микро- и наноэлектроники",
        "Компьютерных технологий",
        "Физики плазмы",
        "Теоретической физики",
        "Электрофизики",
        "Инженерной кибернетики",
        "Информационной безопасности"
    ];

    const descriptions = [
        "Кафедра занимается исследованиями в области ядерной физики, физики элементарных частиц и квантовой теории поля. Преподаватели кафедры проводят лекции и семинары по профильным дисциплинам для студентов бакалавриата и магистратуры.",
        "Кафедра специализируется на подготовке специалистов в области прикладной математики и информатики. Научные исследования кафедры сосредоточены на разработке и применении математических методов и алгоритмов для решения прикладных задач в различных областях науки и техники.",
        "Кафедра ведет обучение и научные исследования в области современной квантовой электроники, лазерной физики и фотоники. Студенты получают фундаментальную подготовку по физике и математике, а также осваивают современные экспериментальные методы исследований.",
        "Кафедра готовит специалистов в области микро- и наноэлектроники, физики твердого тела и полупроводниковых приборов. Научная работа кафедры сосредоточена на исследовании и разработке новых материалов и устройств для микроэлектроники и нанотехнологий.",
        "Кафедра занимается подготовкой специалистов в области компьютерных технологий, программирования и информационных систем. Преподаватели кафедры ведут научные исследования в области искусственного интеллекта, машинного обучения и анализа данных."
    ];

    const courses = [
        [
            { id: 1, name: "Квантовая механика", description: "Изучение основ квантовой механики и её приложений в современной физике." },
            { id: 2, name: "Ядерная физика", description: "Курс по структуре и свойствам атомных ядер, ядерным реакциям и распадам." },
            { id: 3, name: "Теория поля", description: "Изучение квантовой теории поля как основы современной физики элементарных частиц." }
        ],
        [
            { id: 4, name: "Математический анализ", description: "Углубленное изучение дифференциального и интегрального исчисления." },
            { id: 5, name: "Дискретная математика", description: "Курс по основам дискретной математики, включая теорию графов и комбинаторику." },
            { id: 6, name: "Численные методы", description: "Изучение численных методов решения математических задач с использованием компьютера." }
        ],
        [
            { id: 7, name: "Лазерная физика", description: "Изучение физических основ работы лазеров и их применений." },
            { id: 8, name: "Оптоэлектроника", description: "Курс по оптоэлектронным приборам и системам." },
            { id: 9, name: "Нелинейная оптика", description: "Изучение нелинейных оптических явлений и их использования в современных технологиях." }
        ]
    ];

    const staffMembers = [
        [
            { id: 1, name: "Иванов И.И.", position: "Заведующий кафедрой" },
            { id: 2, name: "Петров П.П.", position: "Профессор" },
            { id: 3, name: "Сидоров С.С.", position: "Доцент" },
            { id: 4, name: "Кузнецова К.К.", position: "Старший преподаватель" }
        ],
        [
            { id: 5, name: "Смирнов А.А.", position: "Заведующий кафедрой" },
            { id: 6, name: "Козлов В.В.", position: "Профессор" },
            { id: 7, name: "Новикова Е.И.", position: "Доцент" },
            { id: 8, name: "Морозов Д.С.", position: "Ассистент" }
        ],
        [
            { id: 9, name: "Соколов М.М.", position: "Заведующий кафедрой" },
            { id: 10, name: "Волков А.Н.", position: "Профессор" },
            { id: 11, name: "Лебедева О.П.", position: "Доцент" },
            { id: 12, name: "Орлов К.В.", position: "Старший преподаватель" }
        ]
    ];

    const researchAreas = [
        [
            "Теоретическая ядерная физика и физика элементарных частиц",
            "Квантовая теория поля и теория струн",
            "Физика ядерных реакторов"
        ],
        [
            "Математическое моделирование и вычислительная математика",
            "Алгоритмы машинного обучения и анализа данных",
            "Криптография и защита информации"
        ],
        [
            "Лазерные технологии и оптоэлектроника",
            "Квантовая информатика и квантовые вычисления",
            "Нанофотоника и метаматериалы"
        ],
        [
            "Микроэлектроника и полупроводниковые технологии",
            "Нанотехнологии и новые материалы",
            "Сенсорные системы и измерительная техника"
        ]
    ];

    const contactLocations = [
        "Корпус А, ауд. 512",
        "Корпус Б, ауд. 317",
        "Корпус В, ауд. 205",
        "Корпус Г, ауд. 418",
        "Корпус Д, ауд. 115"
    ];

    // Generate random ratings between 3.0 and 5.0
    const generateRating = () => Math.round((3 + Math.random() * 2) * 10) / 10;

    return Array.from({ length: count }, (_, index) => {
        const id = index + 1;
        const number = departmentNumbers[index % departmentNumbers.length];
        const name = departmentNames[index % departmentNames.length];
        const description = descriptions[index % descriptions.length];
        const courseList = courses[index % courses.length];
        const staff = staffMembers[index % staffMembers.length];
        const research = researchAreas[index % researchAreas.length];

        // Generate random number of total ratings
        const totalRatings = Math.floor(Math.random() * 50) + 10; // Between 10 and 59

        // Create category ratings
        const categoryRatings: { [key: string]: number } = {};
        DEPARTMENT_RATING_CATEGORIES.forEach(category => {
            categoryRatings[category] = generateRating();
        });

        // Calculate overall rating as the mean of category ratings
        const overallRating = Object.values(categoryRatings).reduce((sum, val) => sum + val, 0) /
                             Object.values(categoryRatings).length;

        return {
            id,
            number,
            name,
            description,
            headOfDepartment: staff[0].name,
            imageFileName: `department${id % 5 + 1}.jpg`,
            contactInfo: {
                location: contactLocations[index % contactLocations.length],
                email: `${name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
                phone: `+7 (495) ${100 + Math.floor(Math.random() * 900)}-${10 + Math.floor(Math.random() * 90)}-${10 + Math.floor(Math.random() * 90)}`
            },
            ratings: {
                overallRating,
                totalRaters: totalRatings,
                categoryRatings
            },
            courses: courseList,
            staff,
            researchAreas: research
        };
    });
};

// Export mock departments
export const mockDepartments: Department[] = generateMockDepartments();

// Create a specific department with ID 97 that will always have the requested number
export const mockDepartment97: Department = {
    id: 97,
    number: "№97",
    name: "Теоретической ядерной физики",
    description: "Кафедра теоретической ядерной физики является одним из ведущих научно-образовательных центров в области ядерной физики и физики элементарных частиц. Основана в 1946 году выдающимися учёными-физиками. Сегодня кафедра продолжает традиции фундаментальных исследований и подготовки высококвалифицированных специалистов в области теоретической ядерной физики.",
    headOfDepartment: "Иванов Иван Иванович",
    imageFileName: "department1.jpg",
    contactInfo: {
        location: "Корпус A, ауд. 512",
        email: "nuclear.physics@university.edu",
        phone: "+7 (495) 123-45-67"
    },
    ratings: {
        overallRating: 4.2,
        totalRaters: 48,
        categoryRatings: {
            "Качество преподавания": 4.5,
            "Ресурсное обеспеение": 3.8,
            "Поддержка студентов": 4.3,
            "Профессиональная релевантность": 4.2
        }
    },
    courses: [
        { id: 1, name: "Квантовая механика", description: "Изучение основ квантовой механики и её приложений в современной физике." },
        { id: 2, name: "Ядерная физика", description: "Курс по структуре и свойствам атомных ядер, ядерным реакциям и распадам." },
        { id: 3, name: "Теория поля", description: "Изучение квантовой теории поля как основы современной физики элементарных частиц." },
        { id: 4, name: "Физика элементарных частиц", description: "Изучение свойств и взаимодействий элементарных частиц." },
        { id: 5, name: "Атомная физика", description: "Курс по структуре атомов и атомным спектрам." }
    ],
    staff: [
        { id: 1, name: "Иванов Иван Иванович", position: "Заведующий кафедрой" },
        { id: 2, name: "Петров Петр Петрович", position: "Профессор" },
        { id: 3, name: "Сидоров Сергей Сергеевич", position: "Доцент" },
        { id: 4, name: "Кузнецова Ксения Константиновна", position: "Старший преподаватель" },
        { id: 5, name: "Николаев Николай Николаевич", position: "Доцент" },
        { id: 6, name: "Александрова Анна Александровна", position: "Ассистент" }
    ],
    researchAreas: [
        "Теоретическая ядерная физика и физика элементарных частиц",
        "Квантовая теория поля и теория струн",
        "Физика ядерных реакторов",
        "Моделирование ядерных процессов",
        "Физика высоких энергий"
    ]
};

// Replace or add the specific department in the mock data
const existingIndex = mockDepartments.findIndex(d => d.id === 97);
if (existingIndex >= 0) {
    mockDepartments[existingIndex] = mockDepartment97;
} else {
    mockDepartments.push(mockDepartment97);
}
