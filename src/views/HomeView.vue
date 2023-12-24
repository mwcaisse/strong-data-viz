
<template>
    <div class="section">
        <div class="container is-info pb-3">
            <div class="notification" v-if="state.constShowImportNotification">
                <button class="delete" @click="hideImportNotification" type="button"></button>
                <p>
                    Strong data was last imported on {{ state.workoutDataLastImported.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS) }}.
                </p>
                <div
                    class="file is-normal is-boxed pt-3"
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
                        Strong Data Import
                    </span>
                </span>
                    </label>
                </div>
            </div>
        </div>

        <div
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
    import {DateTime} from "luxon";
    import {hydrateWorkouts} from "@/services/WorkspaceDeserializer";

    enum TabType {
        Workouts = 1,
        Exercises = 2,
        Overview = 3,
    }

    interface ElementState {
        currentTab: TabType;
        workoutDataLastImported: DateTime | null;
        constShowImportNotification: boolean;
    }

    const storedWorkoutData = getWorkoutDataFromStorage();

    const state : ElementState = reactive({
        currentTab: TabType.Overview,
        constShowImportNotification: true,
        workoutDataLastImported: null
    });

    const workoutStore = useWorkoutsStore();

    const {workouts, exercises} = storeToRefs(workoutStore);

    if (storedWorkoutData) {
        parseImportedWorkouts(storedWorkoutData.workouts);
        state.workoutDataLastImported = storedWorkoutData.lastImported;
    }

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

        parseImportedWorkouts(workouts);
        state.workoutDataLastImported = DateTime.now();

        // if we successfully parsed the data, then save it to local storage
        saveWorkoutDataToStorage(workouts);
        hideImportNotification();
    }

    function parseImportedWorkouts(workouts: Workout[]) {
        const exercises = createExercisesFromWorkouts(workouts);

        workouts.sort((l, r) => r.date.toMillis() - l.date.toMillis())

        workoutStore.setWorkouts(workouts);
        workoutStore.setExercises(exercises);
    }

    const LOCAL_STORAGE_WORKOUT_DATA = "workoutData";

    interface WorkoutDataStorage {
        workouts: Workout[];
        lastImported: DateTime;
    }

    function getWorkoutDataFromStorage() : WorkoutDataStorage | null {
        const workoutData = localStorage.getItem(LOCAL_STORAGE_WORKOUT_DATA);
        if (workoutData) {
            const parsedData = JSON.parse(workoutData);
            return {
                workouts: hydrateWorkouts(parsedData.workouts),
                lastImported: DateTime.fromISO(parsedData.lastImported)
            }
        }
        return null;
    }

    function saveWorkoutDataToStorage(workouts: Workout[]) {
        const storageData = {
            workouts: workouts,
            lastImported: DateTime.now()
        }

        localStorage.setItem(LOCAL_STORAGE_WORKOUT_DATA, JSON.stringify(storageData));
    }

    function hideImportNotification() {
        state.constShowImportNotification = false;
    }

</script>

