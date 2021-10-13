<template>
    <div class="mx-3 mb-5 md:mx-0">
        <div class="flex flex-col justify-between md:items-center md:flex-row">
            <div>What do you want to do today?</div>
            <div class="flex mt-5 space-x-2 md:mt-0">
                <input
                    v-model="todoNew"
                    type="text"
                    class="flex-1 mr-1 input input-bordered"
                />
                <button class="btn btn-primary" @click="handleAdd">Add</button>
            </div>
        </div>
        <div class="mt-5">
            <h2 class="text-xl font-semibold">Your Todos</h2>
            <div class="mt-5">
                <ul v-if="incompleteTodos.length">
                    <li v-for="todo in incompleteTodos" :key="todo.id">
                        <div
                            class="flex items-center justify-between px-5 py-2 mb-3 duration-200 border rounded-lg shadow  hover:shadow-lg"
                        >
                            <div>
                                {{ todo.name }}
                            </div>
                            <div class="self-start">
                                <button
                                    @click="handleDelete(todo.id)"
                                    class="mr-2 btn btn-ghost"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <button
                                    @click="handleToggleCompleted(todo.id)"
                                    class="mr-2  btn btn-ghost hover:bg-primary hover:text-white"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
                <p v-else>You have nothing to do today..</p>
            </div>
        </div>

        <!-- only show completed list when there is at least one data -->
        <div
            class="mt-10"
            v-if="incompleteTodos.length || completedTodos.length"
        >
            <h2 class="text-xl font-semibold">Completed</h2>
            <div class="mt-5">
                <ul v-if="completedTodos.length">
                    <li v-for="todo in completedTodos" :key="todo.id">
                        <div
                            class="flex items-center justify-between px-5 py-2 mb-3 duration-200 border rounded-lg shadow  hover:shadow-lg"
                        >
                            <div>
                                {{ todo.name }}
                            </div>
                            <div class="self-start">
                                <button
                                    @click="handleDelete(todo.id)"
                                    class="mr-2 btn btn-ghost"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <button
                                    @click="handleToggleIncomplete(todo.id)"
                                    class="mr-2  btn btn-ghost hover:bg-primary hover:text-white"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
                <p v-else>
                    You haven't complete anything today, keep fighting!
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
//
// TODO : try to use onSnapshot to get realtime data so you don't have to get manually everytime a new data added
//
const props = defineProps({
    userData: Object,
})

import { computed, ref } from '@vue/reactivity'
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    where,
    orderBy,
    deleteDoc,
    updateDoc,
    onSnapshot,
} from 'firebase/firestore'

import { getAuth, onAuthStateChanged } from 'firebase/auth'

const db = getFirestore()
const auth = getAuth()

let unsubcribe
let todosData = ref([])
let todoNew = ref('')

let incompleteTodos = computed(() => {
    return todosData.value.filter((todo) => !todo.completed)
})

let completedTodos = computed(() => {
    return todosData.value.filter((todo) => todo.completed)
})

const getData = async () => {
    // const docs = await getDocs(collection(db, 'todos')) //without query
    const docs = await getDocs(
        query(
            collection(db, 'todos'),
            where('uid', '==', props.userData.uid),
            orderBy('createdAt', 'asc')
        )
    )

    todosData.value = []
    docs.forEach((doc) => {
        // merge with document object with id
        todosData.value.push({ ...doc.data(), id: doc.id })
    })

    // console.log(todosData.value)
}

getData()

const handleAdd = async () => {
    try {
        const docRef = await addDoc(collection(db, 'todos'), {
            uid: props.userData.uid,
            name: todoNew.value,
            createdAt: serverTimestamp(),
            completed: false,
        })
        todoNew.value = ''
        getData()
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}

const handleDelete = async (docId) => {
    try {
        const docRef = await deleteDoc(doc(db, 'todos', docId))
        console.log('Document terhapus')
        getData()
    } catch (error) {
        console.error('Error deleting document: ', error)
    }
}

const handleToggleCompleted = async (id) => {
    await updateDoc(doc(db, 'todos', id), {
        completed: true,
    })
    console.log('Document terupdate, completed = ' + status)
    getData()
}

const handleToggleIncomplete = async (id) => {
    await updateDoc(doc(db, 'todos', id), {
        completed: false,
    })
    console.log('Document terupdate, completed = ' + status)
    getData()
}

// auth.onAuthStateChanged(() => {
//     unsubcribe = onSnapshot(
//         collection(db, 'todos'),
//         where('uid', '==', props.userData.uid),
//         orderBy('createdAt', 'asc'),
//         (doc) => {
//             console.log('Current data: ', doc.data())
//         }
//     )
// })
</script>
