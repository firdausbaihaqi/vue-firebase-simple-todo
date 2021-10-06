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
        <div class="mt-5" v-if="todosData">
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
const props = defineProps({
    userData: Object,
})
import { ref } from '@vue/reactivity'
import { onBeforeUpdate, onMounted } from '@vue/runtime-core'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import {
    collection,
    addDoc,
    getFirestore,
    getDocs,
    serverTimestamp,
    query,
    where,
} from 'firebase/firestore'

let unsubscribe
let auth = getAuth()
let todosData = ref(null)
let todoNew = ref('')
const db = getFirestore()
const getData = async () => {
    // const docs = await getDocs(collection(db, 'todos'))
    const docs = await getDocs(
        query(collection(db, 'todos'), where('uid', '==', props.userData.uid))
    )

    let temp = []
    console.log(docs)
    docs.forEach((doc) => {
        temp.push(doc.data())
    })
    todosData.value = temp

    // getData()
    // console.log(JSON.stringify(docs.name))
    // auth.onAuthStateChanged((userData) => {
    //     if (props.userData) {
    //         console.log('onmounted data props belum ada isinya')
    //         console.log('isi props : ' + JSON.stringify(props.userData))
    //     }
}

onMounted(async () => {
    getData()
})

const handleAdd = async () => {
    try {
        const docRef = await addDoc(collection(db, 'todos'), {
            uid: props.userData.uid,
            name: todoNew.value,
            createdAt: serverTimestamp(),
        })
        console.log('Document written with ID: ', docRef.id)
        getData()
    } catch (e) {
        console.error('Error adding document: ', e)
    }
}
</script>
