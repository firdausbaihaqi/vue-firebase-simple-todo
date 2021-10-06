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
                            Hello : {{ userData.displayName }}
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

                <div class="mt-10">
                    <Todos v-if="userData" :userData="userData" />
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
const isLoggedIn = ref(false)
const userData = ref([])
const auth = getAuth()

onMounted(() => {
    const { data: userDataFromStorage, statusLogin } = getUserLogin()

    // console.log('status login yang diambil ketika mount : ' + statusLogin)
    // console.log(
    //     'data yang diambil ketika mount : ' + JSON.stringify(userDataFromStorage)
    // )

    if (statusLogin == true) {
        isLoggedIn.value = true
        userData.value = userDataFromStorage
    }
    auth.onAuthStateChanged((userData) => {
        console.log('state login berubah')
    })
})

const handleSignIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            userData.value = result.user
            setUserLogin(result.user)

            isLoggedIn.value = true
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
    const auth = getAuth()
    signOut(auth)
        .then(() => {
            alert('see ya!!')
            isLoggedIn.value = false
            removeUserLogin()
        })
        .catch((error) => {
            // An error happened.
            alert(error.message)
        })
}
</script>
