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
                <p class="is-flex is-flex-direction-row">
                    <span class="is-flex is-flex-grow-1  has-text-weight-bold">
                        {{ exercise.name }}
                    </span>
                    <span class="is-flex has-text-weight-bold">
                        Estimated 1RM
                    </span>
                </p>


                <p
                    v-for="(set, index) in exercise.sets"
                    :key="index"
                    class="is-flex is-flex-direction-row"
                >
                    <span class="is-flex has-text-weight-bold">
                        {{ index + 1 }}
                    </span>
                    <span class="is-flex is-flex-grow-1 pl-2">
                        {{ set.weight }} {{ set.weightUnit }} x {{ set.reps }}
                    </span>
                    <span class="is-flex">
                        {{ calculateOneRepMax(set) }} {{ set.weightUnit }}
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

    import type {Workout, WorkoutExercise, WorkoutExerciseSet} from "@/models/Workout";
    import {reactive} from "vue";
    import Icon from "@/components/Common/Icon.vue";
    import {DateTime} from "luxon";

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

    function toggleExpanded() {
        state.expanded = !state.expanded;
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

    function calculateOneRepMax(set: WorkoutExerciseSet) : number {
        return Math.round(set.weight / (1.0278 - (0.0278 * set.reps)));
    }


</script>
