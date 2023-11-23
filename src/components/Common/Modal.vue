<template>
    <div
        class="modal"
        :class="{'is-active': state.show}"
    >
        <div
            class="modal-background"
            @click="close"
        />
        <div
            v-if="state.show"
            class="modal-card"
        >
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ title }}
                </p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="close"
                />
            </header>
            <section class="modal-card-body">
                <slot>
                    <p>Empty Modal. Feel free to fill this in!</p>
                </slot>
            </section>
            <footer
                class="modal-card-foot"
                style="justify-content: flex-end;"
            >
                <slot name="footer-buttons-pre-cancel" />
                <button
                    class="button"
                    @click="close"
                >
                    {{ cancelText }}
                </button>
                <slot name="footer-buttons-post-cancel" />
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">

    import {reactive} from "vue";

    interface Props {
        title: string;
        cancelText?: string;
        showCancelButton?: boolean
    }

    interface ElementState {
        show: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        cancelText: "Close",
        showCancelButton: true
    });

    const state : ElementState = reactive({
        show: false
    });

    function close() {
        state.show = false;
    }

    function open() {
        state.show = true;
    }

    defineExpose({
        open
    });

</script>
