<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
    <Navbar />
    <div class="max-w-xl mx-auto mt-5">
        <router-view></router-view>
    </div>
</template>

<style>
router-link {
    margin: 0 5px;
}
</style>
