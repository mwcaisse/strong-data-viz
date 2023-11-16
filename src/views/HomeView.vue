
<template>
    <div class="section">
        <div
            v-if="state.workouts.length < 1"
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
        <div v-else>
            <WorkoutList :workouts="state.workouts" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import {reactive, computed} from "vue";
    import {readWorkoutFile} from "@/services/WorkoutImporter";
    import type {Workout} from "@/models/Workout";
    import WorkoutList from "@/components/WorkoutList.vue";


    interface ElementState {
        workouts: Workout[]
    }
    const state : ElementState = reactive({
        workouts: []
    });

    async function fileUploaded(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length < 1) {
            return;
        }

        const file = input.files[0];
        const workouts = await readWorkoutFile(file);

        workouts.sort((l, r) => r.date.localeCompare(l.date));

        console.dir(workouts);
        state.workouts = workouts;
    }

</script>

