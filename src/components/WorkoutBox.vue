<template>
    <div
        class="box"
    >
        <p class="title is-4 is-flex is-flex-direction-row">
            <span class="is-flex is-flex-grow-1">
                {{ workout.name }}
            </span>
            <span>
                <Icon
                    :icon="state.expanded ? 'fa-chevron-up' : 'fa-chevron-down'"
                    :action="true"
                    @click="toggleExpanded"
                />
            </span>
        </p>
        <p>
            {{ workout.date.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS) }}
        </p>
        <p>
            {{ workout.duration.toHuman() }}
        </p>

        <div
            v-if="!state.expanded"
            class="pt-3"
        >
            <p
                class="is-flex is-flex-direction-row"
            >
                <span class="is-flex is-flex-grow-1 has-text-weight-bold">Exercises</span>
                <span class="is-flex has-text-weight-bold">Best Set</span>
            </p>

            <p
                v-for="exercise in workout.exercises"
                :key="exercise.name"
                class="is-flex is-flex-direction-row"
            >
                <span class="is-flex is-flex-grow-1">{{ exercise.sets.length }} x {{ exercise.name }}</span>
                <span class="is-flex">{{ bestSetDescription(exercise) }}</span>
            </p>
        </div>
        <div
            v-else
            class="pt-3"
        >
            <p v-if="workout.notes && workout.notes.length > 0">
                {{ workout.notes }}
            </p>

            <div
                v-for="exercise in workout.exercises"
                :key="exercise.name"
                class="box"
            >
                <WorkoutSets
                    :exercise="exercise"
                >
                    <a @click="showExerciseHistory(exercise)">{{ exercise.name }}</a>
                </WorkoutSets>
            </div>
        </div>

        <ExerciseHistoryModal ref="exerciseHistoryModalRef" />
    </div>
</template>

<script setup lang="ts">

    import type {Workout, WorkoutExercise} from "@/models/Workout";
    import {reactive, ref} from "vue";
    import Icon from "@/components/Common/Icon.vue";
    import {DateTime} from "luxon";
    import WorkoutSets from "@/components/WorkoutSets.vue";
    import ExerciseHistoryModal from "@/components/ExerciseHistoryModal.vue";
    import {useWorkoutsStore} from "@/stores/workout";

    interface Props {
        workout: Workout
    }

    const props = defineProps<Props>();

    interface ElementState {
        expanded: boolean
    }
    const state : ElementState = reactive({
        expanded: false
    });

    const workoutStore = useWorkoutsStore();

    const exerciseHistoryModalRef = ref();

    function toggleExpanded() {
        state.expanded = !state.expanded;
    }

    function showExerciseHistory(workoutExercise: WorkoutExercise) {
        console.log("showExerciseHistory: ExerciseID: " + workoutExercise.id);
        const exercise = workoutStore.getExerciseById(workoutExercise.id);
        console.dir(exercise)
        exerciseHistoryModalRef.value.open(exercise);
    }

    function bestSetDescription(exercise: WorkoutExercise) : string {
        if (exercise.sets.length < 1) {
            return "";
        }

        let bestSet = exercise.sets[0];
        let bestSetVolume = bestSet.weight * bestSet.reps;

        for (let i = 1; i < exercise.sets.length; i++) {
            const set = exercise.sets[i];
            let volume = set.weight * set.reps;

            if (volume > bestSetVolume) {
                bestSet = set;
                bestSetVolume = volume;
            }
        }

        return `${bestSet.weight} ${bestSet.weightUnit} x ${bestSet.reps}`;
    }

</script>
