
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
    date: string;
    name: string;
    notes: string;
    duration: string;
    exercises: WorkoutExercise[];
}


