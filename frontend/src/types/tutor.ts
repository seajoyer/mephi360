// Define the tutor data structure
export interface TutorRating {
  overallRating: number;
  totalRaters?: number; // Number of users who have rated this tutor
  categoryRatings: {
    [key: string]: number;
  };
  educationalProcess: {
    lessonStructure: string;
    intermediateAssessment: string;
    finalAssessment: string;
  };
}

export interface Tutor {
  id: number;
  name: string;
  department: string;
  position: string;
  imageFileName: string;
  ratings: TutorRating;
}
