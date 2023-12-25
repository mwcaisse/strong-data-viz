import type {DateTime, Duration} from "luxon";

export interface WorkoutExerciseSet {
    weight: number;
    weightUnit: string;
    reps: number;
}

export interface WorkoutExercise {
    id: number;
    name: string;
    note: string;
    sets: WorkoutExerciseSet[];
}
export interface Workout {
    id: number;
    date: DateTime;
    name: string;
    notes: string;
    duration: Duration;
    exercises: WorkoutExercise[];
}

export interface ExercisePerformance {
    exercise: WorkoutExercise;
    workout: Workout;
}

