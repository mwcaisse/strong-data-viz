<template>
    <div>
        <nav
            class="navbar is-link"
            role="navigation"
        >
            <div class="navbar-menu">
                <div class="navbar-start">
                    <RouterLink
                        to="/"
                        class="navbar-item"
                    >
                        Home
                    </RouterLink>
                </div>
            </div>
        </nav>
    </div>
    <RouterView />
</template>

<script setup lang="ts">
    import {RouterLink, RouterView} from "vue-router"
</script>
