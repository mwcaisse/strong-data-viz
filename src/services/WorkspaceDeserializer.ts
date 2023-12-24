import type {Workout} from "@/models/Workout";
import {DateTime, Duration} from "luxon";

/**
 *  Re-hydrate a list of workouts into the Workout Interface from its JSON representation
 *
 * @param workouts The workouts to rehydrate
 * @return The rehydrated workouts
 */
export function hydrateWorkouts(workouts: any[]) : Workout[] {
    return workouts.map(w => hydrateWorkout(w));
}

export function hydrateWorkout(workout: any) : Workout {
    // in workout itself, we have to adjust date and duration,
    //  everything else should be fine
    workout.date = DateTime.fromISO(workout.date);
    workout.duration = Duration.fromISO(workout.duration);

    return workout;
}