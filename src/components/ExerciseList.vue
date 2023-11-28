<template>
    <div class="container">
        <div class="field has-addons">
            <div class="control is-expanded has-icons-left">
                <input
                    v-model="state.searchText"
                    class="input"
                    type="text"
                    placeholder="Search for exercise"
                >
                <span class="icon is-left">
                    <Icon icon="search" />
                </span>
            </div>
            <div
                v-if="hasSearchText"
                class="control"
            >
                <a
                    class="button"
                    @click="clearSearch"
                >
                    <Icon
                        icon="times"
                        class="fa-lg"
                    />
                </a>
            </div>
        </div>
        <div class="is-flex is-flex-direction-row pb-3">
            <div class="is-flex is-flex-grow-1" />
            <div
                class="dropdown"
                :class="{ 'is-active': state.showSortByDropdown }"
            >
                <div
                    v-click-outside="hideSortByDropdown"
                    class="dropdown-trigger"
                    @click="toggleSortByDropdown"
                >
                    <button class="button">
                        <span>Sort by {{ state.sortByOption.name }}</span>
                        <span class="icon is-small">
                            <Icon
                                icon="angle-down"
                                :action="true"
                            />
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu">
                    <div class="dropdown-content">
                        <a
                            v-for="sortOption in sortByOptions"
                            :key="sortOption.type"
                            href="#"
                            class="dropdown-item"
                            @click.prevent="selectSortBy(sortOption)"
                        >
                            {{ sortOption.name }}
                        </a>
                    </div>
                </div>
            </div>
            <div class="control">
                <a
                    class="button"
                    @click.prevent="toggleSortDirection"
                >
                    <Icon
                        class="fa-lg"
                        :icon="state.sortAscending ? 'arrow-up-1-9' : 'arrow-down-9-1'"
                        :action="true"
                    />
                </a>
            </div>
        </div>

        <a
            v-for="exercise in exercisesSorted"
            :key="exercise.id"
            class="box"
            @click="showExerciseHistory(exercise)"
        >
            <p class="title is-5">
                {{ exercise.name }}
            </p>
            <p
                v-if="exercise.workouts.length > 0"
                class="is-flex is-flex-direction-row"
            >
                <span class="is-flex is-flex-grow-1">
                    Last Performed {{ Utils.formatDateTime(exercise.lastPerformed) }}
                </span>
                <span class="is-flex">
                    Performed {{ exercise.workouts.length }} time(s)
                </span>
            </p>
        </a>
        <ExerciseHistoryModal ref="exerciseHistoryModalRef" />
    </div>
</template>

<script setup lang="ts">

    import type {Exercise} from "@/models/Exercise";
    import Icon from "@/components/Common/Icon.vue";
    import ExerciseHistoryModal from "@/components/ExerciseHistoryModal.vue";
    import {computed, reactive, ref} from "vue";
    import Utils from "@/services/Utils";

    enum SortByType {
        Name = 1,
        TimesPerformed,
        LastPerformed
    }

    interface SortByOption {
        name: string;
        type: SortByType;
    }

    const sortByOptions : SortByOption[] = [
        {
            name: "Name",
            type: SortByType.Name
        },
        {
            name: "Times Performed",
            type: SortByType.TimesPerformed
        },
        {
            name: "Last Performed",
            type: SortByType.LastPerformed
        }
    ]

    interface Props {
        exercises: Exercise[]
    }

    const props = defineProps<Props>();

    interface ElementState {
        sortByOption: SortByOption,
        showSortByDropdown: boolean,
        sortAscending: boolean,
        searchText: string,
    }

    const state : ElementState = reactive({
        sortByOption: sortByOptions[2],
        showSortByDropdown: false,
        sortAscending: false,
        searchText: ""
    });

    const exerciseHistoryModalRef = ref();

    const hasSearchText = computed(() => !Utils.isStringNullOrBlank(state.searchText))

    function clearSearch() {
        state.searchText = "";
    }

    function getSortFunction(type: SortByType, ascending: boolean): (a: Exercise, b: Exercise) => number {
        const modifier = ascending ? 1 : -1;

        if (type === SortByType.LastPerformed) {
            return (a, b) => ((a.lastPerformed?.toMillis() ?? 0) - (b.lastPerformed?.toMillis() ?? 0)) * modifier;
        }
        else if (type === SortByType.TimesPerformed) {
            return (a, b) => (a.workouts.length - b.workouts.length) * modifier;
        }

        // We default to sorting by name
        return (a, b) => a.name.localeCompare(b.name) * modifier;
    }

    const searchedExercises = computed(() => {
        if (hasSearchText.value) {
            return props.exercises.filter(e => e.name.toLowerCase().includes(state.searchText.toLowerCase()));
        }
        return props.exercises;
    });

    const exercisesSorted = computed(() => {
        let sortFun = getSortFunction(state.sortByOption.type, state.sortAscending);
        return [...searchedExercises.value].sort(sortFun);
    });

    function hideSortByDropdown() {
        state.showSortByDropdown = false;
    }

    function toggleSortByDropdown() {
        state.showSortByDropdown = !state.showSortByDropdown;
    }

    function toggleSortDirection() {
        state.sortAscending = !state.sortAscending;
    }

    function selectSortBy(sortByOption: SortByOption) {
        state.sortByOption = sortByOption;
        hideSortByDropdown();
    }

    function showExerciseHistory(exercise: Exercise) {
        console.dir(exerciseHistoryModalRef.value);
        console.dir(exerciseHistoryModalRef);
        exerciseHistoryModalRef.value.open(exercise);
    }

</script>

