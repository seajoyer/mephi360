// Define the tutor data structure
export interface TutorRating {
  overallRating: number;
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
