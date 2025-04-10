import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getCircleOrganizers,
  getCircleSubjects,
  getMaterialTypes,
  getMaterialTeachers,
  getMaterialSubjects,
  getMaterialSemesters,
  getDepartmentOptions,
  DropdownOption
} from '@/services/apiService';

// Define filter state types
interface InfoFilters {
  entityType: 'tutors' | 'departments';
  search: string;
  department: string | null;
}

interface CirclesFilters {
  search: string;
  organizer: string | null;
  subject: string | null;
}

interface StuffFilters {
  search: string;
  type: string | null;
  teacher: string | null;
  subject: string | null;
  semester: string | null;
  institute: string | null;
}

interface FilterOptions {
  infoSections: DropdownOption[];
  circleOrganizers: DropdownOption[];
  circleSubjects: DropdownOption[];
  departments: DropdownOption[];
  materialTypes: DropdownOption[];
  materialTeachers: DropdownOption[];
  materialSubjects: DropdownOption[];
  materialSemesters: DropdownOption[];
}

interface FilterContextType {
  // Current filter values for each section
  infoFilters: InfoFilters;
  circlesFilters: CirclesFilters;
  stuffFilters: StuffFilters;

  // Filter option lists
  filterOptions: FilterOptions;

  // Loading states for options
  optionsLoading: {
    infoSections: boolean;
    circleOrganizers: boolean;
    circleSubjects: boolean;
    departments: boolean;
    materialTypes: boolean;
    materialTeachers: boolean;
    materialSubjects: boolean;
    materialSemesters: boolean;
  };

  // Methods to update filter values
  setInfoEntityType: (type: 'tutors' | 'departments') => void;
  setInfoDepartment: (department: string | null) => void;
  setCircleOrganizer: (organizer: string | null) => void;
  setCircleSubject: (subject: string | null) => void;
  setStuffType: (type: string | null) => void;
  setStuffTeacher: (teacher: string | null) => void;
  setStuffSubject: (subject: string | null) => void;
  setStuffSemester: (semester: string | null) => void;
  setStuffInstitute: (institute: string | null) => void;

  // Search methods
  setSearchQuery: (query: string) => void;
  clearAllFilters: (section: 'info' | 'circles' | 'stuff') => void;
}

// Static options for info entity type
const INFO_SECTION_OPTIONS: DropdownOption[] = [
  { id: 'tutors', name: 'Преподаватели' },
  { id: 'departments', name: 'Кафедры' }
];

// Default filter states
const DEFAULT_INFO_FILTERS: InfoFilters = {
  entityType: 'tutors',
  search: '',
  department: null
};

const DEFAULT_CIRCLES_FILTERS: CirclesFilters = {
  search: '',
  organizer: null,
  subject: null
};

const DEFAULT_STUFF_FILTERS: StuffFilters = {
  search: '',
  type: null,
  teacher: null,
  subject: null,
  semester: null,
  institute: null
};

// Create context with default values
const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Info filters
  const [infoFilters, setInfoFilters] = useState<InfoFilters>(DEFAULT_INFO_FILTERS);

  // Circles filters
  const [circlesFilters, setCirclesFilters] = useState<CirclesFilters>(DEFAULT_CIRCLES_FILTERS);

  // Stuff filters
  const [stuffFilters, setStuffFilters] = useState<StuffFilters>(DEFAULT_STUFF_FILTERS);

  // Filter options state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    infoSections: INFO_SECTION_OPTIONS,
    circleOrganizers: [],
    circleSubjects: [],
    departments: [],
    materialTypes: [],
    materialTeachers: [],
    materialSubjects: [],
    materialSemesters: []
  });

  // Loading states for options
  const [optionsLoading, setOptionsLoading] = useState({
    infoSections: false,
    circleOrganizers: true,
    circleSubjects: true,
    departments: true,
    materialTypes: true,
    materialTeachers: true,
    materialSubjects: true,
    materialSemesters: true
  });

  // Current active section (for knowing which search to update)
  const [activeSection, setActiveSection] = useState<'info' | 'circles' | 'stuff'>('info');

  // When the search input changes, update the appropriate section's search filter
  const setSearchQuery = (query: string) => {
    if (activeSection === 'info') {
      setInfoFilters(prev => ({ ...prev, search: query }));
    } else if (activeSection === 'circles') {
      setCirclesFilters(prev => ({ ...prev, search: query }));
    } else if (activeSection === 'stuff') {
      setStuffFilters(prev => ({ ...prev, search: query }));
    }
  };

  // Clear all filters for a specific section
  const clearAllFilters = (section: 'info' | 'circles' | 'stuff') => {
    if (section === 'info') {
      setInfoFilters(prev => ({ ...prev, department: null, search: '' }));
    } else if (section === 'circles') {
      setCirclesFilters(DEFAULT_CIRCLES_FILTERS);
    } else if (section === 'stuff') {
      setStuffFilters(DEFAULT_STUFF_FILTERS);
    }
  };

  // Clear all filters when component unmounts (app exit)
  useEffect(() => {
    return () => {
      // Reset all filters when component unmounts
      setInfoFilters(DEFAULT_INFO_FILTERS);
      setCirclesFilters(DEFAULT_CIRCLES_FILTERS);
      setStuffFilters(DEFAULT_STUFF_FILTERS);
    };
  }, []);

  // Listen for the app visibility change events to clear filters
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // User is navigating away from the page
        setInfoFilters(DEFAULT_INFO_FILTERS);
        setCirclesFilters(DEFAULT_CIRCLES_FILTERS);
        setStuffFilters(DEFAULT_STUFF_FILTERS);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Update active section when any filter changes
  useEffect(() => {
    setActiveSection('info');
  }, [infoFilters]);

  useEffect(() => {
    setActiveSection('circles');
  }, [circlesFilters]);

  useEffect(() => {
    setActiveSection('stuff');
  }, [stuffFilters]);

  // Load filter options when component mounts
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        // Load circle organizers
        setOptionsLoading(prev => ({ ...prev, circleOrganizers: true }));
        const organizersResponse = await getCircleOrganizers();
        setFilterOptions(prev => ({ ...prev, circleOrganizers: organizersResponse.items }));
        setOptionsLoading(prev => ({ ...prev, circleOrganizers: false }));

        // Load circle subjects
        setOptionsLoading(prev => ({ ...prev, circleSubjects: true }));
        const subjectsResponse = await getCircleSubjects();
        setFilterOptions(prev => ({ ...prev, circleSubjects: subjectsResponse.items }));
        setOptionsLoading(prev => ({ ...prev, circleSubjects: false }));

        // Load departments
        setOptionsLoading(prev => ({ ...prev, departments: true }));
        const departmentsResponse = await getDepartmentOptions();
        setFilterOptions(prev => ({ ...prev, departments: departmentsResponse.items }));
        setOptionsLoading(prev => ({ ...prev, departments: false }));

        // Load material types
        setOptionsLoading(prev => ({ ...prev, materialTypes: true }));
        const typesResponse = await getMaterialTypes();
        setFilterOptions(prev => ({ ...prev, materialTypes: typesResponse.items }));
        setOptionsLoading(prev => ({ ...prev, materialTypes: false }));

        // Load material teachers
        setOptionsLoading(prev => ({ ...prev, materialTeachers: true }));
        const teachersResponse = await getMaterialTeachers();
        setFilterOptions(prev => ({ ...prev, materialTeachers: teachersResponse.items }));
        setOptionsLoading(prev => ({ ...prev, materialTeachers: false }));

        // Load material subjects
        setOptionsLoading(prev => ({ ...prev, materialSubjects: true }));
        const materialSubjectsResponse = await getMaterialSubjects();
        setFilterOptions(prev => ({ ...prev, materialSubjects: materialSubjectsResponse.items }));
        setOptionsLoading(prev => ({ ...prev, materialSubjects: false }));

        // Load material semesters
        setOptionsLoading(prev => ({ ...prev, materialSemesters: true }));
        const semestersResponse = await getMaterialSemesters();
        setFilterOptions(prev => ({ ...prev, materialSemesters: semestersResponse.items }));
        setOptionsLoading(prev => ({ ...prev, materialSemesters: false }));
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Define filter updater methods
  const setInfoEntityType = (type: 'tutors' | 'departments') => {
    setInfoFilters(prev => ({ ...prev, entityType: type }));
  };

  const setInfoDepartment = (department: string | null) => {
    setInfoFilters(prev => ({ ...prev, department }));
  };

  const setCircleOrganizer = (organizer: string | null) => {
    setCirclesFilters(prev => ({ ...prev, organizer }));
  };

  const setCircleSubject = (subject: string | null) => {
    setCirclesFilters(prev => ({ ...prev, subject }));
  };

  const setStuffType = (type: string | null) => {
    setStuffFilters(prev => ({ ...prev, type }));
  };

  const setStuffTeacher = (teacher: string | null) => {
    setStuffFilters(prev => ({ ...prev, teacher }));
  };

  const setStuffSubject = (subject: string | null) => {
    setStuffFilters(prev => ({ ...prev, subject }));
  };

  const setStuffSemester = (semester: string | null) => {
    setStuffFilters(prev => ({ ...prev, semester }));
  };

  const setStuffInstitute = (institute: string | null) => {
    setStuffFilters(prev => ({ ...prev, institute }));
  };

  const contextValue: FilterContextType = {
    infoFilters,
    circlesFilters,
    stuffFilters,
    filterOptions,
    optionsLoading,
    setInfoEntityType,
    setInfoDepartment,
    setCircleOrganizer,
    setCircleSubject,
    setStuffType,
    setStuffTeacher,
    setStuffSubject,
    setStuffSemester,
    setStuffInstitute,
    setSearchQuery,
    clearAllFilters
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
