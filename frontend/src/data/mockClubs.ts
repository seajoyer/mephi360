import { Club } from '@/types/club';

// Generate mock clubs
export const generateMockClubs = (count: number = 20): Club[] => {
    const clubNames = [
        "Кураторское движение",
        "Эко МИФИ",
        "Клуб дебатов",
        "Студия «Звук»",
        "Сообщество «Explosion»",
        "Клуб программистов",
        "Студенческий совет",
        "Спортивный клуб",
        "Хоровое сообщество",
        "Инженерный клуб",
        "Физический кружок",
        "Интеллектуальный клуб",
        "Фотоклуб МИФИ",
        "Театральная студия",
        "Математический клуб",
        "Электронная музыка",
        "IT-сообщество",
        "Клуб робототехники",
        "Литературное сообщество",
        "KVN команда МИФИ"
    ];

    const clubDescriptions = [
        "Организация, помогающая первокурсникам адаптироваться к студенческой жизни и университетскому образованию.",
        "Экологическое сообщество студентов, занимающееся просветительской деятельностью и экологическими проектами.",
        "Площадка для тренировки ораторского мастерства и критического мышления через структурированные дискуссии.",
        "Творческое объединение музыкантов и звукорежиссеров, развивающих свои навыки в создании музыки.",
        "Коллектив единомышленников, занимающихся экспериментальной физикой и инженерией в развлекательном формате.",
        "Сообщество студентов-программистов, проводящих совместные проекты и хакатоны.",
        "Выборный орган студенческого самоуправления, представляющий интересы студентов.",
        "Объединение студентов, увлекающихся различными видами спорта и организующих соревнования.",
        "Музыкальный коллектив, объединяющий студентов с хорошими вокальными данными.",
        "Сообщество будущих инженеров, занимающихся практическими проектами и прототипированием.",
        "Группа студентов, углубленно изучающих различные разделы физики помимо учебной программы.",
        "Клуб для участия в интеллектуальных играх и викторинах типа Что? Где? Когда?",
        "Творческое объединение фотографов, проводящих выставки и мастер-классы.",
        "Коллектив студентов, увлекающихся актерским мастерством и постановкой спектаклей.",
        "Сообщество студентов, углубленно изучающих математические дисциплины.",
        "Группа энтузиастов электронной музыки, организующих вечеринки и фестивали.",
        "Сообщество IT-специалистов, проводящих образовательные мероприятия и разрабатывающих проекты.",
        "Клуб любителей робототехники, разрабатывающих и собирающих роботов.",
        "Объединение студентов, увлекающихся литературой, поэзией и прозой.",
        "Команда юмористов, участвующих в соревнованиях Клуба Веселых и Находчивых."
    ];

    const organizers = [
        "Студенческий совет",
        "Профком",
        "Администрация",
        "Кафедра",
        "Факультет",
        "Инициативная группа",
        "Студенческое объединение",
        "Отдел по работе со студентами"
    ];

    return Array.from({ length: count }, (_, index) => {
        const id = index + 1;
        const name = clubNames[index % clubNames.length];
        const description = clubDescriptions[index % clubDescriptions.length];
        const organizer = organizers[Math.floor(Math.random() * organizers.length)];

        return {
            id,
            link: 'https://t.me/c/1234567890/1',
            name,
            description,
            organizer,
            memberCount: Math.floor(Math.random() * 100) + 10, // Between 10 and 109
            imageFileName: `club${index % 5 + 1}.jpg`, // Cycle through 5 images
            contactInfo: {
                email: `${name.toLowerCase().replace(/[^а-яa-z0-9]/g, "")}@mephi.ru`,
                telegramLink: `https://t.me/${name.toLowerCase().replace(/[^а-яa-z0-9]/g, "")}`
            },
            meetingSchedule: `${['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'][Math.floor(Math.random() * 5)]}, ${Math.floor(Math.random() * 4) + 14}:00`,
            location: `Корпус ${['А', 'Б', 'В', 'Г', 'К'][Math.floor(Math.random() * 5)]}, ауд. ${Math.floor(Math.random() * 300) + 100}`,
            type: ['Научный', 'Культурный', 'Спортивный', 'Творческий', 'Образовательный'][Math.floor(Math.random() * 5)]
        };
    });
};

// Export mock clubs
export const mockClubs = generateMockClubs();

// Create a specific club that will always have the ID 1
export const mockKuratorskoe: Club = {
    id: 1,
    link: `https://t.me/c/1234567890/1`,
    name: "Кураторское движение",
    description: "Организация, помогающая первокурсникам адаптироваться к студенческой жизни и университетскому образованию. Кураторы проводят мероприятия, помогают с учебой и всячески поддерживают студентов.",
    organizer: "Студенческий совет",
    memberCount: 75,
    imageFileName: "club1.jpg",
    contactInfo: {
        email: "kurators@mephi.ru",
        telegramLink: "https://t.me/kurators_mephi"
    },
    meetingSchedule: "Вторник, 16:00",
    location: "Корпус А, ауд. 245",
    type: "Образовательный"
};

// Replace or add the specific club in the mock data
const existingIndex = mockClubs.findIndex(c => c.id === 1);
if (existingIndex >= 0) {
    mockClubs[existingIndex] = mockKuratorskoe;
} else {
    mockClubs.push(mockKuratorskoe);
}
