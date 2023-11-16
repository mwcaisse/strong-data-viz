<template>
    <FaIcon
        :icon="icon"
        :class="{'action-icon': action }"
    />
</template>

<script setup lang="ts">

    interface Props {
        icon: string,
        action?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        action: false
    });

</script>

<style scoped>
    .action-icon:hover {
        transform: scale(1.5);
        cursor: pointer;
    }
</style>
