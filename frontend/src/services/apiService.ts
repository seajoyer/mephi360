// Generic paginated response type
export interface PaginatedResponse<T> {
  content: T[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

// Base service for handling API requests
export class ApiService {
  private baseUrl: string;

  constructor() {
    // Get API URL from environment or use default
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  // Helper method to build URL with query parameters
  protected buildUrl(endpoint: string, params: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);

    // Add all non-undefined parameters to the URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          // Handle array parameters (e.g., tags)
          value.forEach((item) => {
            url.searchParams.append(`${key}`, item);
          });
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    return url.toString();
  }

  // Generic method to fetch paginated data with filters
  protected async fetchPaginated<T, F>(
    endpoint: string,
    page: number,
    size: number,
    filters?: F,
    sort?: string,
    search?: string
  ): Promise<PaginatedResponse<T>> {
    try {
      // Combine pagination params with filters
      const params: Record<string, any> = {
        page,
        size,
        sort,
        search,
        ...filters
      };

      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json() as PaginatedResponse<T>;
    } catch (error) {
      console.error('Error fetching paginated data:', error);
      throw error;
    }
  }
}

// src/services/tutorService.ts (enhanced)
import { Tutor } from '@/types/tutor';
import { mockTutors, mockGoryachev } from '@/data/mockTutors';
import { ApiService, PaginatedResponse } from './apiService';

// Filter params for tutors
export interface TutorFilterParams {
  name?: string;
  department?: string;
  position?: string;
  minRating?: number;
}

// Enum for data source
export enum DataSource {
  MOCK = 'mock',
  API = 'api'
}

// Cache for tutors (with filter keys)
interface TutorCache {
  [filterKey: string]: PaginatedResponse<Tutor>;
}

export class TutorService extends ApiService {
  private dataSource: DataSource;
  private cache: TutorCache = {};

  constructor() {
    super();
    // Default to mock data until switched to API
    this.dataSource = DataSource.MOCK;
  }

  // Get current data source
  getDataSource(): DataSource {
    return this.dataSource;
  }

  // Set data source (for development testing)
  setDataSource(source: DataSource): void {
    this.dataSource = source;
    // Clear cache when switching data sources
    this.cache = {};
    console.log(`Data source set to: ${source}`);
  }

  // Generate a cache key from filters
  private generateCacheKey(page: number, size: number, filters?: TutorFilterParams, search?: string): string {
    const filterString = filters ? JSON.stringify(filters) : '';
    return `tutors-page${page}-size${size}-search${search || ''}-${filterString}`;
  }

  // Fetch tutors with filtering and pagination
  async getTutors(
    page: number,
    size: number,
    filters?: TutorFilterParams,
    sort?: string,
    search?: string
  ): Promise<PaginatedResponse<Tutor>> {
    const cacheKey = this.generateCacheKey(page, size, filters, search);

    // Check cache first
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    if (this.dataSource === DataSource.MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter mock data
      let filteredTutors = [...mockTutors];

      // Apply filters
      if (filters) {
        if (filters.name) {
          const nameFilter = filters.name.toLowerCase();
          filteredTutors = filteredTutors.filter(t =>
            t.name.toLowerCase().includes(nameFilter)
          );
        }

        if (filters.department) {
          const deptFilter = filters.department.toLowerCase();
          filteredTutors = filteredTutors.filter(t =>
            t.department.toLowerCase().includes(deptFilter)
          );
        }

        if (filters.position) {
          const posFilter = filters.position.toLowerCase();
          filteredTutors = filteredTutors.filter(t =>
            t.position.toLowerCase().includes(posFilter)
          );
        }

        if (filters.minRating) {
          filteredTutors = filteredTutors.filter(t =>
            t.ratings.overallRating >= filters.minRating!
          );
        }
      }

      // Apply search (if provided)
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredTutors = filteredTutors.filter(t =>
          t.name.toLowerCase().includes(searchTerm) ||
          t.department.toLowerCase().includes(searchTerm) ||
          t.position.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (sort) {
        const [field, direction] = sort.split(',');
        const isAsc = direction !== 'desc';

        filteredTutors.sort((a, b) => {
          let valueA, valueB;

          // Handle different sort fields
          if (field === 'name') {
            valueA = a.name;
            valueB = b.name;
          } else if (field === 'rating') {
            valueA = a.ratings.overallRating;
            valueB = b.ratings.overallRating;
          } else {
            // Default sort by name
            valueA = a.name;
            valueB = b.name;
          }

          // String comparison
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return isAsc
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          }

          // Number comparison
          return isAsc
            ? Number(valueA) - Number(valueB)
            : Number(valueB) - Number(valueA);
        });
      }

      // Calculate pagination
      const startIdx = page * size;
      const endIdx = startIdx + size;
      const paginatedTutors = filteredTutors.slice(startIdx, endIdx);

      const response: PaginatedResponse<Tutor> = {
        content: paginatedTutors,
        last: endIdx >= filteredTutors.length,
        totalElements: filteredTutors.length,
        totalPages: Math.ceil(filteredTutors.length / size),
        size: size,
        number: page,
        first: page === 0,
        empty: paginatedTutors.length === 0
      };

      // Cache the result
      this.cache[cacheKey] = response;
      return response;

    } else {
      // Use real API
      const response = await this.fetchPaginated<Tutor, TutorFilterParams>(
        '/tutors',
        page,
        size,
        filters,
        sort,
        search
      );

      // Cache the result
      this.cache[cacheKey] = response;
      return response;
    }
  }

  // Get individual tutor by ID (keep existing implementation)
  async getTutorById(id: number): Promise<Tutor | null> {
    if (this.dataSource === DataSource.MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));

      if (id === 1) {
        return JSON.parse(JSON.stringify(mockGoryachev));
      }

      const tutor = mockTutors.find(t => t.id === id);
      return tutor ? JSON.parse(JSON.stringify(tutor)) : null;
    } else {
      try {
        const response = await fetch(`${this.baseUrl}/tutors/${id}`);
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

  // For backward compatibility with existing code
  async getTutorsByPage(page: number, itemsPerPage: number): Promise<Tutor[]> {
    const response = await this.getTutors(page - 1, itemsPerPage);
    return response.content;
  }
}

// Create singleton instance
export const tutorService = new TutorService();

// Similarly enhanced services can be created for ClubService and StudyMaterialService
// following the same pattern but with their specific filter parameters
