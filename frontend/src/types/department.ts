// Define the department data structure
export interface DepartmentRating {
  overallRating: number;
  totalRaters: number;
  categoryRatings: {
    [key: string]: number;
  };
}

export interface ContactInfo {
  location?: string;
  email?: string;
  phone?: string;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
}

export interface Department {
  id: number;
  number: string; // e.g., "№97"
  name: string; // e.g., "Теоретической ядерной физики"
  headOfDepartment: string;
  imageFileName: string;
  contactInfo?: ContactInfo;
  ratings: DepartmentRating;
  staff?: StaffMember[];
}
