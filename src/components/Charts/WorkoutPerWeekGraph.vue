<template>
    <Bar :data="data" :options="options" />
</template>

<script setup lang="ts">

    import { Chart as ChartJS, Colors, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
    import { Bar } from "vue-chartjs";
    import {useWorkoutsStore} from "@/stores/workout";
    import {computed} from "vue";
    import {DateTime} from "luxon";
    import Utils from "@/services/Utils";

    ChartJS.register(Colors, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

    const workoutStore = useWorkoutsStore();

    const dataSetData = computed(() => {
        const currentWeek = Utils.startOfWeek(DateTime.now());
        const startingWeek = currentWeek.minus({weeks: 12});
        const workoutsInRange = workoutStore.workouts.filter(w => w.date >= startingWeek);

        const workoutsMap = new Map<string, number>();

        let weekToAdd = startingWeek;
        while (weekToAdd <= currentWeek) {
            workoutsMap.set(weekToAdd.toFormat("yyyy-MM-dd"), 0);
            weekToAdd = weekToAdd.plus({week: 1});
        }

        workoutsInRange.forEach(el => {
            const workoutWeek = Utils.startOfWeek(el.date).toFormat("yyyy-MM-dd");

            const current = workoutsMap.get(workoutWeek) || 0;
            workoutsMap.set(workoutWeek, current + 1);
        });

        return [...workoutsMap.entries()].map(e => {
            return {
                x: e[0],
                y: e[1]
            }
        }).sort((l, r) => l.x.localeCompare(r.x));
    });

    const data = computed(() => {
        return {
            datasets: [
                {
                    label: "Workouts per week",
                    data: dataSetData.value
                }
            ]
        }
    });

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

</script>

<style scoped>

</style>