import type {Exercise} from "@/models/Exercise";
import type {ExercisePerformance, Workout, WorkoutExercise, WorkoutExerciseSet} from "@/models/Workout";

export function convertExerciseToPerformanceList(exercise: Exercise, sortNewestFirst : boolean = true) : ExercisePerformance[] {

    let performances = exercise.workouts.map((workout: Workout) => {

        let workoutExercise = workout.exercises.filter((e: WorkoutExercise) => e.name === exercise.name)[0];

        return {
            exercise: workoutExercise,
            workout: workout
        };
    });

    const sortMultiplier = sortNewestFirst ? 1 : - 1;
    performances.sort((l, r) => (r.workout.date.toMillis() - l.workout.date.toMillis()) * sortMultiplier);

    return performances;
}

function calculateOneRepMax(set: WorkoutExerciseSet) : number {
    return Math.round(set.weight / (1.0278 - (0.0278 * set.reps)));
}

export default {
    convertExerciseToPerformanceList,
    calculateOneRepMax
}