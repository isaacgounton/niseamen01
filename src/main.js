// src/main.js

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show a notification or refresh the page
              if (confirm('New version available! Click OK to update.')) {
                newWorker.postMessage({ action: 'skipWaiting' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });

  // Listen for controlling change events
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Ensure you import the router
import './style.css' // Change from './index.css' to './style.css

const app = createApp(App)

app.use(router) // Ensure you use the router

app.mount('#app')

navigator.serviceWorker.register('/service-worker.js').then(registration => {
  console.log('Service Worker registered with scope:', registration.scope)
}).catch(error => {
  console.error('Service Worker registration failed:', error)
})