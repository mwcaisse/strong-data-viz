
import {defineStore} from "pinia";
import type {Exercise} from "@/models/Exercise";
import type {Workout} from "@/models/Workout";

interface WorkspaceStoreState {
    exerciseLookup: Map<number, Exercise>,
    workoutLookup: Map<number, Workout>
}

export const useWorkoutsStore = defineStore("workouts", {

    state: () => ({
        exerciseLookup: new Map<number, Exercise>(),
        workoutLookup: new Map<number, Workout>()
    } as WorkspaceStoreState),
    getters: {
        getWorkoutById: (state: WorkspaceStoreState) => (workoutId: number) => {
            if (state.workoutLookup.has(workoutId)) {
                return state.workoutLookup.get(workoutId);
            }
            return null;
        },
        getExerciseById: (state: WorkspaceStoreState) => (exerciseId: number) => {
            if (state.exerciseLookup.has(exerciseId)) {
                return state.exerciseLookup.get(exerciseId);
            }
            return null;
        },
        workouts: (state): Workout[] => Array.from(state.workoutLookup.values()),
        exercises: (state): Exercise[] => Array.from(state.exerciseLookup.values())
    },
    actions: {
        setWorkouts(workouts: Workout[]) {
            let lookup = new Map<number, Workout>();
            for (let workout of workouts) {
                lookup.set(workout.id, workout);
            }
            this.workoutLookup = lookup;
        },
        setExercises(exercises: Exercise[]) {
            let lookup = new Map<number, Exercise>();
            for (let exercise of exercises) {
                lookup.set(exercise.id, exercise);
            }
            this.exerciseLookup = lookup;
        }
    }
});
