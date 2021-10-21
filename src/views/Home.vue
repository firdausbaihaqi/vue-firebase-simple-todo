<template>
    <div>
        <div class="mx-3 mb-5 md:mx-0">
            <br />
            <div v-if="isUserLoggedIn">
                <div class="shadow-xl card image-full">
                    <figure>
                        <img
                            class="object-cover bg-cover max-h-60"
                            src="https://picsum.photos/800"
                        />
                    </figure>
                    <div v-if="userData" class="justify-end card-body">
                        <h2 class="card-title">
                            Hello, {{ userData.displayName }}!
                        </h2>
                        <p>
                            {{ userData.email }}
                        </p>
                        <div class="card-actions">
                            <button
                                class="btn btn-ghost"
                                @click="handleSignOut"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>

                <div class="my-10">
                    <Todos v-if="userData" :userData="userData" />
                </div>
            </div>

            <div v-else-if="!isUserLoggedIn">
                <button
                    class="btn btn-primary"
                    @click="store.dispatch('signInAction')"
                >
                    Login
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Todos from '../components/Todos.vue'
import { computed, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'

import { useStore } from 'vuex'

const store = useStore()
const isUserLoggedIn = computed(() => store.getters.getIsUserLoggedIn)
const userData = computed(() => store.getters.getUser)

onMounted(() => {
    // auth state listener, anything happens with sign in or sign out will trigger these function
    store.dispatch('authListenerAction')
})

const handleSignIn = () => {
    store.dispatch('signInAction')
}

const handleSignOut = () => {
    store.dispatch('signOutAction')
}
</script>
