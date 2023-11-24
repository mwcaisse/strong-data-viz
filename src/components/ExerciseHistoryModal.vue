<template>
    <Modal
        ref="modal"
        :title="modalTitle"
    >
        <div
            v-for="performance in state.performances"
            class="box"
        >
            <p class="has-text-weight-bold">
                {{ performance.workout.name }}
            </p>
            <p>{{ Utils.formatDateTime(performance.workout.date) }}</p>

            <WorkoutSets
                :exercise="performance.exercise"
                title="Sets Performed"
                class="pt-3"
            />
        </div>
    </Modal>
</template>

<script setup lang="ts">
    import {computed, reactive, ref} from "vue";

    import type {Exercise} from "@/models/Exercise";
    import type {Workout, WorkoutExercise} from "@/models/Workout";
    import WorkoutSets from "@/components/WorkoutSets.vue";
    import Modal from "@/components/Common/Modal.vue";
    import Utils from "@/services/Utils";

    interface ExercisePerformance {
        exercise: WorkoutExercise;
        workout: Workout;
    }

    interface ElementState {
        performances?: ExercisePerformance[];
        exercise?: Exercise;
    }

    const state = reactive<ElementState>({
        performances: []
    });

    const modalTitle = computed(() => {
        if (state.exercise) {
            return state.exercise.name + " History";
        }
        return "Exercise History";
    })

    const modal = ref(null);

    function convertExerciseToPerformance(exercise: Exercise) : ExercisePerformance[] {

        let performances = exercise.workouts.map((workout: Workout) => {

            let workoutExercise = workout.exercises.filter((e: WorkoutExercise) => e.name === exercise.name)[0];

            return {
                exercise: workoutExercise,
                workout: workout
            };
        });

        performances.sort((l, r) => r.workout.date.toMillis() - l.workout.date.toMillis());

        return performances;
    }

    const open = (exercise: Exercise) => {
        state.performances = convertExerciseToPerformance(exercise);
        state.exercise = exercise;
        modal.value.open();
    };

    defineExpose({
        open
    });

</script>

<style scoped>

</style>
