import type {DateTime, Duration} from "luxon";

export interface WorkoutExerciseSet {
    weight: number;
    weightUnit: string;
    reps: number;
}

export interface WorkoutExercise {
    name: string;
    note: string;
    sets: WorkoutExerciseSet[];
}
export interface Workout {
    date: DateTime;
    name: string;
    notes: string;
    duration: Duration;
    exercises: WorkoutExercise[];
}


