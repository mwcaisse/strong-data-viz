
<template>
    <div class="container">
        <div
            v-for="workout in props.workouts"
            :key="workout.date"
            class="box"
        >
            <p class="title is-4">
                {{ workout.name }}
            </p>
            <p>
                {{ workout.date }}
            </p>

            <div class="pt-3">
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
        </div>
    </div>
</template>

<script setup lang="ts">

    import type {Workout, WorkoutExercise, WorkoutExerciseSet} from "@/models/Workout";

    interface Props {
        workouts: Workout[]
    }

    const props = defineProps<Props>();

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

