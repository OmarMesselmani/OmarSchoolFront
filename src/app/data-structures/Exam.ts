// types/exam.ts

// Nested resource interfaces
export interface Semester {
  id: number;
  name: string;
  start_day: string;
  end_day: string;
  start_month: number; // 1-12
  end_month: number; // 1-12
}

export interface Grade {
  id: number;
  name: string;
  order: number; // 1-12
  description: string | null;
}

export interface Subject {
  id: number;
  name: string;
  description: string | null;
  code: string; // e.g. "MATH101"
}

export interface ExerciseType {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  order: number;
  title: string;
  instructions: string;
  exercise_type: ExerciseType;
  active: boolean;
  created_at: string; // ISO datetime string
}

// types/period.ts

export interface Period {
  id: number;
  name: string;
  order: number;
  active: boolean;
  start_month: number; // 1–12
  start_day: number; // 1–31
  end_month: number; // 1–12
  end_day: number; // 1–31
}
// Root interface for the exam + exercises payload
export interface ExamWithExercises {
  id: number;
  unique_id: string; // Public identifier for the exam
  title: string;
  description: string | null;
  semester: Semester;
  period: Period | null; // Nullable if not applicable
  grade: Grade;
  subject: Subject;
  active: boolean;
  created_at: string; // ISO datetime string
  exercises: Exercise[];
  status: string; // e.g. "draft", "published", "archived"
  progress: number; // Percentage of exercises completed
  exercises_count: number; // Total number of exercises in the exam
}

export interface Pack {
  title: string;
  unique_code: string; // Unique identifier for the pack
  exams: ExamWithExercises[];
  subject: Subject | null; // Nullable if not applicable
  period: Period | null; // Nullable if not applicable
  semester: Semester | null; // Nullable if not applicable
}

export interface ExerciseStatus {
    success: boolean;
    finished: boolean;
    score: number | null;
    attempted_at: string;
}


// Shared item interface for left/right items
export interface MatchItemDto {
  id: string,
  order: number;
  text: string;
  image: string; 
}

// The full two-columns-matching response
export interface TwoColumnsMatchingResponse {
  title: string;
  exercise_order: number;
  instruction: string;
  left_items: MatchItemDto[];
  right_items: MatchItemDto[];
}