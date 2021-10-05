import { createApp } from 'vue'
import router from './router/'
import App from './App.vue'
import './main.css'

import { initializeApp } from 'firebase/app';
const firebaseConfig = {
    apiKey: '***REMOVED***',
    authDomain: '***REMOVED***',
    projectId: '***REMOVED***',
    storageBucket: '***REMOVED***.appspot.com',
    messagingSenderId: '***REMOVED***',
    appId: '1:***REMOVED***:web:5022d7ed747216846fdc9e',
    measurementId: '***REMOVED***',
}

initializeApp(firebaseConfig);

createApp(App).use(router).mount('#app')
