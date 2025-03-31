import { mockTutors } from '@/data/mockTutors';
import { mockDepartments } from '@/data/mockDepartments';

// API base URL - can be configured from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Enum for data source
export enum DataSource {
  MOCK = 'mock',
  API = 'api'
}

// Global data source configuration
let currentDataSource = DataSource.MOCK;

/**
 * Set the data source for all API calls
 */
export const setDataSource = (source: DataSource): void => {
  currentDataSource = source;
  console.log(`Data source set to: ${source}`);
};

/**
 * Get the current data source
 */
export const getDataSource = (): DataSource => {
  return currentDataSource;
};

// ====== TYPES ======

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  total: number;
}

export interface DropdownOption {
  id: string;
  name: string;
}

// ====== MOCK DATA ======

// Mock circles data
const mockCircles = Array.from({ length: 30 }, (_, index) => {
  const subjects = [
    'Математика', 'IT', 'Английский',
    'Астрономия', 'Физика', 'Химия'
  ];

  const organizers = [
    'Студ. совет', 'СНО', 'Мат. лиига',
    'Старостат', 'Реактор', 'Авторсикий'
  ];

  const subject = subjects[index % subjects.length];
  const organizer = organizers[Math.floor(index / 5) % organizers.length];

  return {
    id: index + 1,
    name: `Кружок ${subject}`,
    description: `Описание кружка lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    image: `/assets/circles/circle${(index % 5) + 1}.jpg`,
    tags: [subject, organizer],
    memberCount: Math.floor(Math.random() * 80) + 20,
    department: `Кафедра №${Math.floor(Math.random() * 50) + 1}`,
    subject,
    organizer
  };
});

// Mock study materials data
const mockMaterials = Array.from({ length: 50 }, (_, index) => {
  const types = ['Теория', 'КР', 'Лаба', 'БДЗ', 'Зачет', 'Экзамен'];
  const semesters = ['1 сем', '2 сем', '3 сем', '4 сем', '5 сем', '6 сем'];
  const teachers = ['Иванов И.И.', 'Петров П.П.', 'Сидоров С.С.', 'Кузнецова К.К.'];
  const subjects = ['Математика', 'Физика', 'Информатика', 'Программирование'];
  const institutes = ['ИЯФИТ', 'ЛаПлаз', 'ИФИБ', 'ИИКС', 'ИФТИС'];

  const type = types[index % types.length];
  const semester = semesters[Math.floor(index / 8) % semesters.length];
  const teacher = teachers[Math.floor(index / 6) % teachers.length];
  const subject = subjects[Math.floor(index / 4) % subjects.length];
  const institute = institutes[Math.floor(index / 10) % institutes.length];

  return {
    id: index + 1,
    title: `${subject} - ${type}`,
    description: `${type} по предмету "${subject}" для студентов ${institute}`,
    tags: [type, teacher, subject, semester],
    telegramLink: `https://t.me/c/1234567890/${index + 1}`,
    type,
    semester,
    teacher,
    institute,
    subject
  };
});

/**
 * Filter array with search text
 * Improved implementation that works with any nested object structure
 */
function applyTextSearch<T>(data: T[], search: string): T[] {
  if (!search || search.trim() === '') return data;

  const searchLower = search.toLowerCase().trim();

  // Function to check if an object contains the search term
  const containsSearchTerm = (obj: any): boolean => {
    if (!obj) return false;

    // Check if it's a string and contains the search term
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(searchLower);
    }

    // If it's an array, check each element
    if (Array.isArray(obj)) {
      return obj.some(item => containsSearchTerm(item));
    }

    // If it's an object, check each property
    if (typeof obj === 'object') {
      return Object.values(obj).some(value => containsSearchTerm(value));
    }

    return false;
  };

  return data.filter(item => containsSearchTerm(item));
}

/**
 * Generate mock paginated response from array
 */
function createMockPaginatedResponse<T>(
  data: T[],
  filter: Record<string, any>,
  itemsPerPage: number = 20
): PaginatedResponse<T> {
  const { search, cursor } = filter;
  let filteredData = [...data];

  // Apply text search across all properties
  if (search && typeof search === 'string' && search.trim() !== '') {
    filteredData = applyTextSearch(filteredData, search);
  }

  // Apply specific filters for each entity type
  if ('department' in filter && filter.department) {
    filteredData = filteredData.filter(item =>
      // @ts-ignore - We know tutors have department
      item.department && item.department.includes(filter.department)
    );
  }

  // Circle filters
  if ('organizer' in filter && filter.organizer) {
    filteredData = filteredData.filter((item: any) =>
      item.organizer === filter.organizer
    );
  }

  if ('subject' in filter && filter.subject) {
    filteredData = filteredData.filter((item: any) =>
      item.subject === filter.subject
    );
  }

  // Material filters
  if ('type' in filter && filter.type) {
    filteredData = filteredData.filter((item: any) =>
      item.type === filter.type
    );
  }

  if ('teacher' in filter && filter.teacher) {
    filteredData = filteredData.filter((item: any) =>
      item.teacher === filter.teacher
    );
  }

  if ('semester' in filter && filter.semester) {
    filteredData = filteredData.filter((item: any) =>
      item.semester === filter.semester
    );
  }

  if ('institute' in filter && filter.institute) {
    filteredData = filteredData.filter((item: any) =>
      item.institute === filter.institute
    );
  }

  // Handle cursor-based pagination
  let startIndex = 0;
  if (cursor) {
    startIndex = parseInt(cursor, 10);
    if (isNaN(startIndex)) startIndex = 0;
  }

  const endIndex = startIndex + (filter.limit || itemsPerPage);
  const items = filteredData.slice(startIndex, endIndex);
  const nextCursor = endIndex < filteredData.length ? endIndex.toString() : null;

  console.log(`Filter applied: ${JSON.stringify(filter)}`);
  console.log(`Items found: ${filteredData.length}, returning ${items.length} items`);

  return {
    items,
    nextCursor,
    total: filteredData.length
  };
}

// ====== SEARCH AND FILTER FUNCTIONS ======

/**
 * Get filtered tutors list
 */
export const getTutors = async (filter: Record<string, any> = {}): Promise<PaginatedResponse<any>> => {
  if (currentDataSource === DataSource.MOCK) {
    console.log('Getting tutors with filter:', filter);
    return createMockPaginatedResponse(mockTutors, filter);
  }

  const url = new URL(`${API_BASE_URL}/api/tutors`);

  // Add filter parameters
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch tutors: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get filtered departments list
 */
export const getDepartments = async (filter: Record<string, any> = {}): Promise<PaginatedResponse<any>> => {
  if (currentDataSource === DataSource.MOCK) {
    console.log('Getting departments with filter:', filter);
    return createMockPaginatedResponse(mockDepartments, filter);
  }

  const url = new URL(`${API_BASE_URL}/api/departments`);

  // Add filter parameters
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch departments: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get filtered circles list
 */
export const getCircles = async (filter: Record<string, any> = {}): Promise<PaginatedResponse<any>> => {
  if (currentDataSource === DataSource.MOCK) {
    console.log('Getting circles with filter:', filter);
    return createMockPaginatedResponse(mockCircles, filter);
  }

  const url = new URL(`${API_BASE_URL}/api/circles`);

  // Add filter parameters
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch circles: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get filtered materials list
 */
export const getMaterials = async (filter: Record<string, any> = {}): Promise<PaginatedResponse<any>> => {
  if (currentDataSource === DataSource.MOCK) {
    console.log('Getting materials with filter:', filter);
    return createMockPaginatedResponse(mockMaterials, filter);
  }

  const url = new URL(`${API_BASE_URL}/api/materials`);

  // Add filter parameters
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch materials: ${response.status}`);
  }

  return await response.json();
};

// ====== DROPDOWN OPTIONS ======

/**
 * Get department options for dropdown
 */
export const getDepartmentOptions = async (): Promise<{ items: DropdownOption[] }> => {
  if (currentDataSource === DataSource.MOCK) {
    // Create options from mock departments
    const options = mockDepartments.map(dept => ({
      id: dept.number,
      name: `${dept.number} ${dept.name}`
    }));

    return { items: options };
  }

  const response = await fetch(`${API_BASE_URL}/api/departments/options`);
  if (!response.ok) {
    throw new Error(`Failed to fetch department options: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get circle organizers for dropdown
 */
export const getCircleOrganizers = async (): Promise<{ items: DropdownOption[] }> => {
  if (currentDataSource === DataSource.MOCK) {
    const uniqueOrganizers = Array.from(new Set(
      mockCircles.map(circle => circle.organizer)
    )).sort();

    const options = uniqueOrganizers.map(org => ({
      id: org,
      name: org
    }));

    return { items: options };
  }

  const response = await fetch(`${API_BASE_URL}/api/circles/organizers`);
  if (!response.ok) {
    throw new Error(`Failed to fetch circle organizers: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get circle subjects for dropdown
 */
export const getCircleSubjects = async (): Promise<{ items: DropdownOption[] }> => {
  if (currentDataSource === DataSource.MOCK) {
    const uniqueSubjects = Array.from(new Set(
      mockCircles.map(circle => circle.subject)
    )).sort();

    const options = uniqueSubjects.map(subject => ({
      id: subject,
      name: subject
    }));

    return { items: options };
  }

  const response = await fetch(`${API_BASE_URL}/api/circles/subjects`);
  if (!response.ok) {
    throw new Error(`Failed to fetch circle subjects: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get material types for dropdown
 */
export const getMaterialTypes = async (): Promise<{ items: DropdownOption[] }> => {
  if (currentDataSource === DataSource.MOCK) {
    const uniqueTypes = Array.from(new Set(
      mockMaterials.map(mat => mat.type)
    )).sort();

    const options = uniqueTypes.map(type => ({
      id: type,
      name: type
    }));

    return { items: options };
  }

  const response = await fetch(`${API_BASE_URL}/api/materials/types`);
  if (!response.ok) {
    throw new Error(`Failed to fetch material types: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get teachers for dropdown
 */
export const getMaterialTeachers = async (): Promise<{ items: DropdownOption[] }> => {
  if (currentDataSource === DataSource.MOCK) {
    const uniqueTeachers = Array.from(new Set(
      mockMaterials.map(mat => mat.teacher)
    )).sort();

    const options = uniqueTeachers.map(teacher => ({
      id: teacher,
      name: teacher
    }));

    return { items: options };
  }

  const response = await fetch(`${API_BASE_URL}/api/materials/teachers`);
  if (!response.ok) {
    throw new Error(`Failed to fetch material teachers: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get subjects for dropdown
 */
export const getMaterialSubjects = async (): Promise<{ items: DropdownOption[] }> => {
  if (currentDataSource === DataSource.MOCK) {
    const uniqueSubjects = Array.from(new Set(
      mockMaterials.map(mat => mat.subject)
    )).sort();

    const options = uniqueSubjects.map(subject => ({
      id: subject,
      name: subject
    }));

    return { items: options };
  }

  const response = await fetch(`${API_BASE_URL}/api/materials/subjects`);
  if (!response.ok) {
    throw new Error(`Failed to fetch material subjects: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get semesters for dropdown
 */
export const getMaterialSemesters = async (): Promise<{ items: DropdownOption[] }> => {
  if (currentDataSource === DataSource.MOCK) {
    const uniqueSemesters = Array.from(new Set(
      mockMaterials.map(mat => mat.semester)
    )).sort();

    const options = uniqueSemesters.map(semester => ({
      id: semester,
      name: semester
    }));

    return { items: options };
  }

  const response = await fetch(`${API_BASE_URL}/api/materials/semesters`);
  if (!response.ok) {
    throw new Error(`Failed to fetch material semesters: ${response.status}`);
  }

  return await response.json();
};
