import { Tutor } from '@/types/tutor';
import { mockTutors, mockGoryachev } from '@/data/mockTutors';

// Enum for data source
export enum DataSource {
  MOCK = 'mock',
  API = 'api'
}

// Compatible with the existing cache in TutorsList
const sectionsCache: Record<string, Tutor[]> = {};

class TutorService {
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
    Object.keys(sectionsCache).forEach(key => {
      delete sectionsCache[key];
    });

    console.log(`Data source set to: ${source}`);
  }

  // Set API URL
  setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }

  // Fetch a tutor by ID
  async getTutorById(id: number): Promise<Tutor | null> {
    // Check cache first
    const cachedTutors = sectionsCache['tutors'] || [];
    const cachedTutor = cachedTutors.find(t => t.id === id);

    if (cachedTutor) {
      return JSON.parse(JSON.stringify(cachedTutor));
    }

    if (this.dataSource === DataSource.MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // If it's the specific ID we want to ensure always exists
      if (id === 1) {
        return JSON.parse(JSON.stringify(mockGoryachev));
      }

      // Return mock data
      const tutor = mockTutors.find(t => t.id === id);
      return tutor ? JSON.parse(JSON.stringify(tutor)) : null;
    } else {
      // Fetch from API
      try {
        const response = await fetch(`${this.apiBaseUrl}/tutors/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tutor with ID ${id}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching tutor:', error);
        return null;
      }
    }
  }

  // Fetch all tutors
  async getAllTutors(): Promise<Tutor[]> {
    // Check cache first
    if (sectionsCache['tutors'] && sectionsCache['tutors'].length > 0) {
      return JSON.parse(JSON.stringify(sectionsCache['tutors']));
    }

    if (this.dataSource === DataSource.MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Return mock data
      const tutors = JSON.parse(JSON.stringify(mockTutors));
      sectionsCache['tutors'] = tutors; // Update cache
      return tutors;
    } else {
      // Fetch from API
      try {
        const response = await fetch(`${this.apiBaseUrl}/tutors`);
        if (!response.ok) {
          throw new Error('Failed to fetch tutors');
        }
        const tutors = await response.json();
        sectionsCache['tutors'] = tutors; // Update cache
        return tutors;
      } catch (error) {
        console.error('Error fetching tutors:', error);
        return [];
      }
    }
  }

  // Method to get a paged subset of tutors (compatible with TutorsList)
  async getTutorsByPage(page: number, itemsPerPage: number): Promise<Tutor[]> {
    let allTutors: Tutor[];

    // Check if we already have the full list cached
    if (sectionsCache['tutors'] && sectionsCache['tutors'].length > 0) {
      allTutors = JSON.parse(JSON.stringify(sectionsCache['tutors']));
    } else {
      // Otherwise fetch all tutors
      allTutors = await this.getAllTutors();
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allTutors.slice(startIndex, endIndex);
  }
}

// Create and export a singleton instance
export const tutorService = new TutorService();

/*
  To toggle between mock and API data sources in code/development:

  // Switch to API
  tutorService.setDataSource(DataSource.API);

  // Set custom API URL (optional)
  tutorService.setApiBaseUrl('https://your-api-url.com/api');

  // Switch back to mock data
  tutorService.setDataSource(DataSource.MOCK);
*/
