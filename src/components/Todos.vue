<template>
    <div>
        <div class="flex items-center justify-between">
            <div>What do you want todo today?</div>
            <div>
                <input
                    v-model="todoNew"
                    type="text"
                    class="mr-1 input input-bordered"
                />
                <button class="btn btn-primary" @click="handleAdd">Add</button>
            </div>
        </div>
        <div class="mt-5" v-if="todosData.length">
            <h2 class="text-xl font-semibold">Your Todos</h2>
            <div class="mt-5">
                <ul>
                    <li v-for="todo in todosData" :key="todo.id">
                        <div
                            class="px-5 py-2 mb-3 duration-200 border rounded-lg shadow hover:shadow-lg"
                        >
                            <button
                                @click="handleDelete(todo.id)"
                                class="btn btn-ghost"
                            >
                                ✖
                            </button>
                            {{ todo.name }}
                        </div>
                    </li>
                </ul>
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

import { ref } from '@vue/reactivity'
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
    onSnapshot
} from 'firebase/firestore'

import { getAuth, onAuthStateChanged } from 'firebase/auth'

const db = getFirestore()
const auth = getAuth()

let unsubcribe
let todosData = ref([])
let todoNew = ref('')

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

getData()

const handleAdd = async () => {
    try {
        const docRef = await addDoc(collection(db, 'todos'), {
            uid: props.userData.uid,
            name: todoNew.value,
            createdAt: serverTimestamp(),
        })
        // console.log('Document written with ID: ', docRef.id)
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
</script>
