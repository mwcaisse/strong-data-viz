<template>
    <Bar
        :data="data"
        :options="options"
    />
</template>

<script setup lang="ts">

    import {Chart as ChartJS, Colors, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement} from "chart.js";
    import {Bar} from "vue-chartjs";
    import annotationPlugin from "chartjs-plugin-annotation";
    import {useWorkoutsStore} from "@/stores/workout";
    import {computed} from "vue";
    import {DateTime} from "luxon";
    import Utils from "@/services/Utils";

    ChartJS.register(Colors, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, annotationPlugin);

    const workoutStore = useWorkoutsStore();

    const workoutsPerWeekTarget = 6;

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

        return [...workoutsMap.entries()].map(e => ({
            x: e[0],
            y: e[1]
        })).sort((l, r) => l.x.localeCompare(r.x));
    });

    const data = computed(() => ({
        datasets: [
            {
                label: "Workouts per week",
                data: dataSetData.value
            }
        ]
    }));

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
                grace: 1
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    target: {
                        type: "line",
                        yMin: workoutsPerWeekTarget,
                        yMax: workoutsPerWeekTarget,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        label: {
                            content: "Target",
                            display: true,
                            position: "end"
                        }
                    }
                }
            }
        }
    };

</script>

<style scoped>

</style>