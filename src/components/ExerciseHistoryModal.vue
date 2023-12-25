<template>
    <Modal
        ref="modal"
        :title="modalTitle"
    >
        <div class="tabs is-medium is-boxed">
            <ul>
                <li :class="{'is-active': state.currentTab === TabType.History}">
                    <a @click="setTab(TabType.History)">History</a>
                </li>
                <li :class="{'is-active': state.currentTab === TabType.Graphs}">
                    <a @click="setTab(TabType.Graphs)">Graphs</a>
                </li>
            </ul>
        </div>
        <div
            v-if="state.currentTab === TabType.History"
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
        <div v-if="state.currentTab === TabType.Graphs">
            <ExercisePerformanceOverTime v-if="state.exercise" :exercise="state.exercise" />
        </div>
    </Modal>
</template>

<script setup lang="ts">
    import {computed, reactive, ref} from "vue";

    import type {Exercise} from "@/models/Exercise";
    import type {ExercisePerformance} from "@/models/Workout";
    import WorkoutSets from "@/components/WorkoutSets.vue";
    import Modal from "@/components/Common/Modal.vue";
    import Utils from "@/services/Utils";
    import {convertExerciseToPerformanceList} from "@/services/WorkoutUtils";
    import ExercisePerformanceOverTime from "@/components/Charts/ExercisePerformanceOverTime.vue";

    enum TabType {
        History = 1,
        Graphs = 2
    }

    interface ElementState {
        performances?: ExercisePerformance[];
        exercise?: Exercise;
        currentTab: TabType;
    };

    const state = reactive<ElementState>({
        performances: [],
        currentTab: TabType.History
    });

    const modalTitle = computed(() => {
        if (state.exercise) {
            return state.exercise.name + " History";
        }
        return "Exercise History";
    })

    const modal = ref(null);

    const open = (exercise: Exercise) => {
        state.performances = convertExerciseToPerformanceList(exercise);
        state.exercise = exercise;
        modal.value.open();
    };

    defineExpose({
        open
    });

    function setTab(newTab: TabType) {
        state.currentTab = newTab;
    }

</script>

<style scoped>

</style>
