import { Department } from '@/types/department';
import { mockDepartments } from '@/data/mockDepartments';

// Enum for data source
export enum DataSource {
  MOCK = 'mock',
  API = 'api'
}

// Cache for departments data
const departmentsCache: Record<string, Department[]> = {};

class DepartmentService {
  private dataSource: DataSource;
  private apiBaseUrl: string;

  constructor() {
    // Default to mock data
    this.dataSource = DataSource.MOCK;

    // Get API URL from environment or use default
    this.apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  // Get current data source
  getDataSource(): DataSource {
    return this.dataSource;
  }

  // Set data source - to be used only in code/development
  setDataSource(source: DataSource): void {
    this.dataSource = source;

    // Clear cache when data source changes
    Object.keys(departmentsCache).forEach(key => {
      delete departmentsCache[key];
    });

    console.log(`Data source set to: ${source}`);
  }

  // Set API URL
  setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }

  // Fetch a department by ID
  async getDepartmentById(id: number): Promise<Department | null> {
    // Check cache first
    const cachedDepartments = departmentsCache['departments'] || [];
    const cachedDepartment = cachedDepartments.find(d => d.id === id);

    if (cachedDepartment) {
      return JSON.parse(JSON.stringify(cachedDepartment));
    }

    if (this.dataSource === DataSource.MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return mock data
      const department = mockDepartments.find(d => d.id === id);
      return department ? JSON.parse(JSON.stringify(department)) : null;
    } else {
      // Fetch from API
      try {
        const response = await fetch(`${this.apiBaseUrl}/departments/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch department with ID ${id}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching department:', error);
        return null;
      }
    }
  }

  // Fetch all departments
  async getAllDepartments(): Promise<Department[]> {
    // Check cache first
    if (departmentsCache['departments'] && departmentsCache['departments'].length > 0) {
      return JSON.parse(JSON.stringify(departmentsCache['departments']));
    }

    if (this.dataSource === DataSource.MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Return mock data
      const departments = JSON.parse(JSON.stringify(mockDepartments));
      departmentsCache['departments'] = departments; // Update cache
      return departments;
    } else {
      // Fetch from API
      try {
        const response = await fetch(`${this.apiBaseUrl}/departments`);
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const departments = await response.json();
        departmentsCache['departments'] = departments; // Update cache
        return departments;
      } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
      }
    }
  }

  // Method to get a paged subset of departments
  async getDepartmentsByPage(page: number, itemsPerPage: number): Promise<Department[]> {
    let allDepartments: Department[];

    // Check if we already have the full list cached
    if (departmentsCache['departments'] && departmentsCache['departments'].length > 0) {
      allDepartments = JSON.parse(JSON.stringify(departmentsCache['departments']));
    } else {
      // Otherwise fetch all departments
      allDepartments = await this.getAllDepartments();
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allDepartments.slice(startIndex, endIndex);
  }
}

// Create and export a singleton instance
export const departmentService = new DepartmentService();
