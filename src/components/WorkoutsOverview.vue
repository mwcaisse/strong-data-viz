
<template>
    <div>
        <div class="tile is-ancestor pt-5">
            <div class="tile">
                <div class="tile is-parent is-vertical">
                    <div class="tile is-child box">
                        <div class="has-text-centered">
                            <p class="heading">
                                Workouts this Week
                            </p>
                            <p class="title">
                                {{ workoutsThisWeek.length }}
                            </p>
                        </div>
                    </div>
                    <div class="tile is-child box">
                        <div class="has-text-centered">
                            <p class="heading">
                                Time this Week
                            </p>
                            <p class="title">
                                {{ prettyDuration(timeThisWeek) }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="tile is-parent is-vertical">
                    <div class="tile is-child box">
                        <div class="has-text-centered">
                            <p class="heading">
                                Workouts this Month
                            </p>
                            <p class="title">
                                {{ workoutsThisMonth.length }}
                            </p>
                        </div>
                    </div>
                    <div class="tile is-child box">
                        <div class="has-text-centered">
                            <p class="heading">
                                Time this Month
                            </p>
                            <p class="title">
                                {{ prettyDuration(timeThisMonth) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="tile is-parent is-vertical">
                    <div class="tile is-child box">
                        <div class="has-text-centered">
                            <p class="heading">
                                Workouts this Year
                            </p>
                            <p class="title">
                                {{ workoutsThisYear.length }}
                            </p>
                        </div>
                    </div>
                    <div class="tile is-child box">
                        <div class="has-text-centered">
                            <p class="heading">
                                Time this Year
                            </p>
                            <p class="title">
                                {{ prettyDuration(timeThisYear) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="tile is-parent is-vertical">
                    <div class="tile is-child box">
                        <div class="has-text-centered">
                            <p class="heading">
                                Workouts since epoch
                            </p>
                            <p class="title">
                                {{ workoutStore.workouts.length }}
                            </p>
                        </div>
                    </div>
                    <div class="tile is-child box">
                        <div class="has-text-centered">
                            <p class="heading">
                                All time working out
                            </p>
                            <p class="title">
                                {{ prettyDuration(timeAllTime) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <Calendar
                borderless
                :attributes="calendarAttributes"
                :max-date="new Date()"
            />
        </div>
        <div>
            <WorkoutPerWeekGraph />
        </div>
    </div>
</template>

<script setup lang="ts">

    import {Calendar} from "v-calendar"
    import "v-calendar/style.css"

    import {useWorkoutsStore} from "@/stores/workout";
    import {computed, ref} from "vue";
    import {DateTime, Duration} from "luxon";
    import type {DateTimeUnit} from "luxon/src/datetime";
    import type {Workout} from "@/models/Workout";
    import {prettyDuration} from "@/services/Utils";
    import WorkoutPerWeekGraph from "@/components/Charts/WorkoutPerWeekGraph.vue";

    const workoutStore = useWorkoutsStore();

    const workoutsThisWeek = computed(() => {
        // Luxon hard codes start of week to Monday, I want Sunday, subtract one
        let startOfWeek = DateTime.now().startOf("week")
            .minus(Duration.fromObject({days: 1}));
        return workoutStore.workouts.filter((workout: Workout) => workout.date >= startOfWeek);
    });

    const workoutsThisMonth = computed(() => {
        let startOfMonth = DateTime.now().startOf("month");
        return workoutStore.workouts.filter((workout: Workout) => workout.date >= startOfMonth);
    });

    const workoutsThisYear= computed(() => {
        let startOfYear = DateTime.now().startOf("year");
        return workoutStore.workouts.filter((workout: Workout) => workout.date >= startOfYear);
    });

    const timeThisWeek = computed(() => workoutsThisWeek.value.reduce((a: Duration, cv: Workout) => a.plus(cv.duration), Duration.fromObject({hours: 0})))
    const timeThisMonth = computed(() => workoutsThisMonth.value.reduce((a: Duration, cv: Workout) => a.plus(cv.duration), Duration.fromObject({hours: 0})))
    const timeThisYear= computed(() => workoutsThisYear.value.reduce((a: Duration, cv: Workout) => a.plus(cv.duration), Duration.fromObject({hours: 0})))
    const timeAllTime = computed(() => workoutStore.workouts.reduce((a: Duration, cv: Workout) => a.plus(cv.duration), Duration.fromObject({hours: 0})))

    const calendarAttributes = computed(() => workoutStore.workouts.map(workout => ({
        key: workout.id,
        highlight: true,
        dates: workout.date.toJSDate(),
        order: 0,
        popover: {
            label: workout.name,
            visibility: "click"
        },
        workout: workout
    })));

</script>
