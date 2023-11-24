
<template>
    <div>
        <p v-if="!Utils.isStringNullOrBlank(exercise.note)">
            {{ exercise.note }}
        </p>
        <p class="is-flex is-flex-direction-row">
            <span class="is-flex is-flex-grow-1  has-text-weight-bold">
                <slot>
                    {{ title }}
                </slot>
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
</template>

<script setup lang="ts">

    import type {WorkoutExercise, WorkoutExerciseSet} from "@/models/Workout";
    import Utils from "@/services/Utils";

    interface Props {
        exercise: WorkoutExercise;
        title?: string;
    }

    const props = defineProps<Props>();

    function calculateOneRepMax(set: WorkoutExerciseSet) : number {
        return Math.round(set.weight / (1.0278 - (0.0278 * set.reps)));
    }

</script>

<style scoped>

</style>
