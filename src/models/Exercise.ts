import {DateTime} from "luxon";
import type {Workout} from "@/models/Workout";


class Exercise {

    id: number;

    name: string;

    lastPerformed?: DateTime

    workouts: Workout[];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;

        this.workouts = [];
    }

    addWorkout(workout: Workout) {
        this.workouts.push(workout);

        if (this.lastPerformed == null || workout.date > this.lastPerformed) {
            this.lastPerformed = workout.date;
        }
    }

}
