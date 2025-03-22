import { Department } from '@/types/department';
import { DEPARTMENT_RATING_CATEGORIES } from '@/constants/ratingConstants';

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

    const contactLocations = [
        "А-512",
        "Б-317",
        "В-205",
        "Г-418",
        "Д-115"
    ];



    // Generate random ratings between 3.0 and 5.0
    const generateRating = () => Math.round((3 + Math.random() * 2) * 10) / 10;

    return Array.from({ length: count }, (_, index) => {
        const id = index + 1;
        const number = departmentNumbers[index % departmentNumbers.length];
        const name = departmentNames[index % departmentNames.length];

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

        // Generate placeholder staff (simplified for this example)
        const staff = [
            { id: id * 100 + 1, name: "Иванов И.И.", position: "Заведующий кафедрой" },
            { id: id * 100 + 2, name: "Петров П.П.", position: "Профессор" },
            { id: id * 100 + 3, name: "Сидоров С.С.", position: "Доцент" },
            { id: id * 100 + 4, name: "Кузнецова К.К.", position: "Старший преподаватель" }
        ];

        return {
            id,
            number,
            name,
            headOfDepartment: staff[0].name,
            imageFileName: `department${id % 5 + 1}.jpg`,
            contactInfo: {
                location: contactLocations[index % contactLocations.length],
                email: `secretary@theor.mephi.ru`,
                phone: `+7 (495) ${100 + Math.floor(Math.random() * 900)}-${10 + Math.floor(Math.random() * 90)}-${10 + Math.floor(Math.random() * 90)}`
            },
            ratings: {
                overallRating,
                totalRaters: totalRatings,
                categoryRatings
            },
            staff
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
            "Ресурсное обеспечение": 3.8,
            "Поддержка студентов": 4.3,
            "Профессиональная релевантность": 4.2,
            "«Халявность»": 4.0
        }
    },
    staff: [
        { id: 1, name: "Иванов Иван Иванович", position: "Заведующий кафедрой" },
        { id: 2, name: "Петров Петр Петрович", position: "Профессор" },
        { id: 3, name: "Сидоров Сергей Сергеевич", position: "Доцент" },
        { id: 4, name: "Кузнецова Ксения Константиновна", position: "Старший преподаватель" },
        { id: 5, name: "Николаев Николай Николаевич", position: "Доцент" },
        { id: 6, name: "Александрова Анна Александровна", position: "Ассистент" }
    ]
};

// Replace or add the specific department in the mock data
const existingIndex = mockDepartments.findIndex(d => d.id === 97);
if (existingIndex >= 0) {
    mockDepartments[existingIndex] = mockDepartment97;
} else {
    mockDepartments.push(mockDepartment97);
}
