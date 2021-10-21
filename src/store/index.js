import { createStore } from 'vuex'
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'

export const store = createStore({
    state: {
        user: null,
        error: null
    },
    getters: {
        getUser: (state) => state.user,
        getIsUserLoggedIn: (state) => !!state.user,
        getError: (state) => state.error
    },
    mutations: {
        setUser: (state, userData) => {
            state.user = userData;
        },
        setError: (state, errorMessage) => {
            state.error = userData;
        }
    },
    actions: {
        signInAction: ({ commit }) => {
            const provider = new GoogleAuthProvider()
            const auth = getAuth()

            signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result)
                    const token = credential.accessToken

                    // we don't need to commit mutation here anymore because auth listener already 
                    // catching all sign in/out event and commit the mutation there
                    // commit("setUser", result.user);
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message

                    alert(errorMessage)

                    // The email of the user's account used.
                    const email = error.email
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error)

                    commit("setError", error.message);
                })
        },
        signOutAction: ({ commit }) => {
            const auth = getAuth()
            signOut(auth)
                .then(() => {
                    alert('see ya!!')
                })
                .catch((error) => {
                    commit("setError", error.message)
                    alert(error.message)
                })
        },
        authListenerAction: ({ commit }) => {
            const auth = getAuth()
            auth.onAuthStateChanged((user) => {
                if (user) {
                    console.log('user login')
                    commit("setUser", user)
                } else {
                    console.log('user logout / belum login')
                    commit("setUser", null)
                }
            })
        }
    }
})