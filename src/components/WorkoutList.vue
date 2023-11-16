
<template>
    <div class="container">
        <WorkoutBox
            v-for="workout in workouts"
            :key="workout.date"
            :workout="workout"
            class="box"
        />
    </div>
</template>

<script setup lang="ts">

    import type {Workout} from "@/models/Workout";
    import WorkoutBox from "@/components/WorkoutBox.vue";

    interface Props {
        workouts: Workout[]
    }

    const props = defineProps<Props>();


</script>

