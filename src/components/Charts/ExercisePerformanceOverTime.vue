<template>
    <Line
        :data="data"
        :options="options"
    />
</template>

<script setup lang="ts">
    import {Chart as ChartJS, Colors, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement} from "chart.js";
    import {Line} from "vue-chartjs";
    import annotationPlugin from "chartjs-plugin-annotation";
    import {computed} from "vue";
    import Utils from "@/services/Utils";
    import type {Exercise} from "@/models/Exercise";
    import WorkoutUtils, {convertExerciseToPerformanceList} from "@/services/WorkoutUtils";
    import type {WorkoutExerciseSet} from "@/models/Workout";

    ChartJS.register(Colors, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, annotationPlugin);

    interface Props {
        exercise: Exercise
    }

    const props = defineProps<Props>();

    const exercisePerformances = computed(() => {
        return convertExerciseToPerformanceList(props.exercise, false);
    });

    const labels = computed(() => {
       return exercisePerformances.value.map(ep => Utils.formatDate(ep.workout.date));
    });

    const bestSetData = computed(() => {
        return exercisePerformances.value.map(ep => {
            // calculate the set with the most volume, and return its weight
            //TOOD: Handle the case where the workouts have different weight units
            let maxVolume = 0;
            let maxVolumeSet : WorkoutExerciseSet;
            ep.exercise.sets.forEach(s => {
               let volume = s.reps * s.weight;
               if (volume > maxVolume) {
                   maxVolume = volume;
                   maxVolumeSet = s;
               }
            });
            return maxVolumeSet.weight;
        });
    });

    const estimatedOneRepMaxData = computed(() => {
        return exercisePerformances.value.map(ep => {
            let maxOneRepMax = 0;
            ep.exercise.sets.forEach(s => {
                let oneRepMax = WorkoutUtils.calculateOneRepMax(s);
                if (oneRepMax > maxOneRepMax) {
                    maxOneRepMax = oneRepMax;
                }
            });
            return maxOneRepMax;
        });
    });

    const maxWeightData = computed(() => {
        return exercisePerformances.value.map(ep => {
            let maxWeight = 0;
            ep.exercise.sets.forEach(s => {
                if (s.weight > maxWeight) {
                    maxWeight = s.weight;
                }
            })
            return maxWeight;
        })
    })

    const data = computed(() => ({
        labels: labels.value,
        datasets: [
            {
                label: "Best Set",
                data: bestSetData.value
            },
            {
                label: "Best Estimated 1RM",
                data: estimatedOneRepMaxData.value
            },
            {
                label: "Max weight",
                data: maxWeightData.value
            }
        ]
    }));

    const options = {
        responsive: true
    }


</script>


<style scoped>

</style>