<template>
    <div>
        <div class="mb-5">
            <p>is Logged in : {{ isLoggedIn }}</p>
            <br />
            <div v-if="isLoggedIn">
                <div class="shadow-xl card image-full">
                    <figure>
                        <img
                            class="object-cover bg-cover max-h-60"
                            src="https://picsum.photos/800"
                        />
                    </figure>
                    <div class="justify-end card-body">
                        <h2 class="card-title">
                            Hello : {{ userLocal.displayName }}
                        </h2>
                        <p>
                            {{ userLocal.email }}
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

                <div class="mt-10">
                    <Todos v-if="userLocal" :userData="userLocal" />
                </div>
            </div>

            <div v-else-if="!isLoggedIn">
                <button class="btn btn-primary" @click="handleSignIn">
                    Login
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Todos from '../components/Todos.vue'
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'
import {
    getUserLogin,
    setUserLogin,
    removeUserLogin,
} from '../composables/localStorage.js'

const provider = new GoogleAuthProvider()
const auth = getAuth()
const isLoggedIn = ref(false)
const userLocal = ref([])

const { data: userDataFromStorage, statusLogin } = getUserLogin()

onMounted(() => {
    if (statusLogin == true) {
        isLoggedIn.value = true
        userLocal.value = userDataFromStorage
    }

    // auth state listener, anything happens with sign in or sign out will trigger these function
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('user login')
            // console.log(JSON.stringify(user))
            userLocal.value = user
            setUserLogin(user)
            isLoggedIn.value = true
        } else {
            console.log('user logout / belum login')
            removeUserLogin()
            isLoggedIn.value = false
        }
    })
})

const handleSignIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message

            alert(errorMessage)
            // The email of the user's account used.
            const email = error.email
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error)
            // ...
        })
}

const handleSignOut = () => {
    signOut(auth)
        .then(() => {
            alert('see ya!!')
        })
        .catch((error) => {
            alert(error.message)
        })
}
</script>
