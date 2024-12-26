// src/main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/progressier.js', { scope: '/' })
      .then(registration => {
        console.log('ServiceWorker registration successful')
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error)
      })
  })
}