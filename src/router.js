import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Lyrics from './views/Lyrics.vue'
import About from './views/About.vue'
import Admin from './views/Admin.vue'
import Profile from './views/Profile.vue'  // Make sure to import Profile

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lyrics/:songId?',
    name: 'Lyrics',
    component: Lyrics,
    props: true
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: Profile 
  },
  // Add a catch-all route to redirect to Home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router