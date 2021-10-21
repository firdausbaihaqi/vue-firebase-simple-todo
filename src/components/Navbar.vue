<template>
    <div class="mb-2 shadow-lg navbar bg-neutral text-neutral-content">
        <div class="flex-1 px-2 mx-2">
            <span class="text-lg font-bold"> Todo-App </span>
        </div>
        <div class="flex-none">
            <router-link :to="{ name: 'Home' }">
                <button class="btn btn-ghost btn-sm rounded-btn">Home</button>
            </router-link>
            <router-link :to="{ name: 'About' }">
                <button class="btn btn-ghost btn-sm rounded-btn">About</button>
            </router-link>

            <!-- TODO : get signout from vuex store so you can signout from this component -->

            <!-- <div v-if="userLocal" class="p-0 dropdown dropdown-hover dropdown-end">
                <div tabindex="0" class="btn">
                    <img :src="userLocal.photoURL" class="h-8 rounded-lg" />
                </div>
                <ul
                    tabindex="0"
                    class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 text-neutral"
                >
                    <li>
                        <a>Sign Out</a>
                    </li>
                </ul>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from '@vue/runtime-core'
import { getUserLogin } from '../composables/localStorage.js'

//   TODO : use vuex store
const { data: userDataFromStorage, statusLogin } = getUserLogin()

const userLocal = ref(null)

onMounted(() => {
    userLocal.value = userDataFromStorage
    if (userLocal.value != null) {
    }
})
</script>
