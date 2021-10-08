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
            <div class="mt-2">
                <ul>
                    <li v-for="todo in todosData" :key="todo.id">
                        - {{ todo.name }}
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
import { onMounted } from '@vue/runtime-core'
import {
    collection,
    addDoc,
    getFirestore,
    getDocs,
    serverTimestamp,
    query,
    where,
} from 'firebase/firestore'

const db = getFirestore()

let todosData = ref([])
let todoNew = ref('')

const getData = async () => {
    // const docs = await getDocs(collection(db, 'todos')) //without query
    const docs = await getDocs(
        query(collection(db, 'todos'), where('uid', '==', props.userData.uid))
    )

    todosData.value = []
    docs.forEach((doc) => {
        todosData.value.push(doc.data())
    })
}

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
</script>
