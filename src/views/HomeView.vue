
<template>
    <div class="section">
        <div
            v-if="workouts.length < 1"
            class="file is-normal is-boxed"
        >
            <label class="file-label">
                <input
                    class="file-input"
                    type="file"
                    style="cursor: pointer;"
                    accept=".csv"
                    @change="fileUploaded"
                >
                <span class="file-cta">
                    <span class="file-label">
                        Strong Data Export
                    </span>
                </span>
            </label>
        </div>
        <div
            v-else
            class="container"
        >
            <div class="tabs is-medium is-boxed">
                <ul>
                    <li :class="{'is-active': state.currentTab === TabType.Overview}">
                        <a @click="setTab(TabType.Overview)">Overview</a>
                    </li>
                    <li :class="{'is-active': state.currentTab === TabType.Workouts}">
                        <a @click="setTab(TabType.Workouts)">Workouts</a>
                    </li>
                    <li :class="{'is-active': state.currentTab === TabType.Exercises}">
                        <a @click="setTab(TabType.Exercises)">Exercises</a>
                    </li>
                </ul>
            </div>
            <WorkoutList
                v-if="state.currentTab === TabType.Workouts"
                :workouts="workouts"
            />
            <ExerciseList
                v-if="state.currentTab === TabType.Exercises"
                :exercises="exercises"
            />
            <WorkoutsOverview v-if="state.currentTab === TabType.Overview" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import {reactive} from "vue";
    import {readWorkoutFile} from "@/services/WorkoutImporter";
    import type {Workout} from "@/models/Workout";
    import WorkoutList from "@/components/WorkoutList.vue";
    import {Exercise} from "@/models/Exercise";
    import ExerciseList from "@/components/ExerciseList.vue";
    import {useWorkoutsStore} from "@/stores/workout";
    import {storeToRefs} from "pinia";
    import WorkoutsOverview from "@/components/WorkoutsOverview.vue";

    enum TabType {
        Workouts = 1,
        Exercises = 2,
        Overview = 3,
    }

    interface ElementState {
        currentTab: TabType;

    }
    const state : ElementState = reactive({
        currentTab: TabType.Workouts
    });

    const workoutStore = useWorkoutsStore();

    const {workouts, exercises} = storeToRefs(workoutStore);

    function setTab(newTab: TabType) {
        state.currentTab = newTab;
    }

    function createExercisesFromWorkouts(workouts: Workout[]): Exercise[] {
        let exercises = {} as { [exerciseName: string]: Exercise };

        for (const workout of workouts) {

            for (const exercise of workout.exercises) {

                if (Object.prototype.hasOwnProperty.call(exercises, exercise.name)) {
                    exercises[exercise.name].addWorkout(workout);
                }
                else {
                    exercises[exercise.name] = new Exercise(exercise.id, exercise.name);
                }
            }
        }
        return Object.values(exercises);
    }

    async function fileUploaded(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length < 1) {
            return;
        }

        const file = input.files[0];
        const workouts = await readWorkoutFile(file);
        const exercises = createExercisesFromWorkouts(workouts);

        workouts.sort((l, r) => r.date.toMillis() - l.date.toMillis())

        workoutStore.setWorkouts(workouts);
        workoutStore.setExercises(exercises);
    }

</script>

