import { Club } from '@/types/club';
import { mockClubs } from '@/data/mockClubs';

// Enum for data source
export enum DataSource {
  MOCK = 'mock',
  API = 'api'
}

// Cache for clubs data
const clubsCache: Record<string, Club[]> = {};

class ClubService {
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
    Object.keys(clubsCache).forEach(key => {
      delete clubsCache[key];
    });

    console.log(`Data source set to: ${source}`);
  }

  // Set API URL
  setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }

  // Fetch a club by ID
  async getClubById(id: number): Promise<Club | null> {
    // Check cache first
    const cachedClubs = clubsCache['clubs'] || [];
    const cachedClub = cachedClubs.find(c => c.id === id);

    if (cachedClub) {
      return JSON.parse(JSON.stringify(cachedClub));
    }

    if (this.dataSource === DataSource.MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return mock data
      const club = mockClubs.find(c => c.id === id);
      return club ? JSON.parse(JSON.stringify(club)) : null;
    } else {
      // Fetch from API
      try {
        const response = await fetch(`${this.apiBaseUrl}/clubs/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch club with ID ${id}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching club:', error);
        return null;
      }
    }
  }

  // Fetch all clubs
  async getAllClubs(): Promise<Club[]> {
    // Check cache first
    if (clubsCache['clubs'] && clubsCache['clubs'].length > 0) {
      return JSON.parse(JSON.stringify(clubsCache['clubs']));
    }

    if (this.dataSource === DataSource.MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Return mock data
      const clubs = JSON.parse(JSON.stringify(mockClubs));
      clubsCache['clubs'] = clubs; // Update cache
      return clubs;
    } else {
      // Fetch from API
      try {
        const response = await fetch(`${this.apiBaseUrl}/clubs`);
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const clubs = await response.json();
        clubsCache['clubs'] = clubs; // Update cache
        return clubs;
      } catch (error) {
        console.error('Error fetching clubs:', error);
        return [];
      }
    }
  }

  // Method to get a paged subset of clubs
  async getClubsByPage(page: number, itemsPerPage: number): Promise<Club[]> {
    let allClubs: Club[];

    // Check if we already have the full list cached
    if (clubsCache['clubs'] && clubsCache['clubs'].length > 0) {
      allClubs = JSON.parse(JSON.stringify(clubsCache['clubs']));
    } else {
      // Otherwise fetch all clubs
      allClubs = await this.getAllClubs();
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allClubs.slice(startIndex, endIndex);
  }
}

// Create and export a singleton instance
export const clubService = new ClubService();
