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

// Root interface for the exam + exercises payload
export interface ExamWithExercises {
  id: number;
  title: string;
  description: string | null;
  semester: Semester;
  grade: Grade;
  subject: Subject;
  active: boolean;
  created_at: string; // ISO datetime string
  exercises: Exercise[];
  exercises_count: number; // Total number of exercises in the exam
}
