<template>
    <div class="mb-2 shadow-lg navbar bg-neutral text-neutral-content">
        <div class="flex-1 px-2 mx-2">
            <span class="text-lg font-bold"> Firebase learning </span>
        </div>
        <div class="flex-none">
            <router-link :to="{ name: 'Home' }">
                <button class="btn btn-ghost btn-sm rounded-btn">Home</button>
            </router-link>
            <router-link :to="{ name: 'About' }">
                <button class="btn btn-ghost btn-sm rounded-btn">About</button>
            </router-link>
        </div>
    </div>
</template>
