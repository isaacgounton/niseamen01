<template>
    <header class="bg-gray-800 shadow-lg fixed w-full top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left space to balance the layout -->
          <div class="w-24">
            <!-- Empty div to maintain balance -->
          </div>
  
          <!-- Centered Navigation -->
          <nav class="flex-1 flex items-center justify-center">
            <div class="flex items-center space-x-8">
              <router-link 
                v-for="item in menuItems" 
                :key="item.path"
                :to="item.path"
                class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
                :class="{ 'bg-gray-700': $route.path === item.path }"
              >
                {{ item.text }}
              </router-link>
            </div>
          </nav>
  
          <!-- User Menu -->
          <div class="w-24 flex items-center justify-end">
            <button
              v-if="!user"
              @click="$emit('sign-in')"
              class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </button>
            <button
              v-else
              @click="$emit('sign-out')"
              class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header',
    props: {
      user: {
        type: Object,
        default: null
      },
      menuItems: {
        type: Array,
        required: true
      }
    },
    emits: ['sign-in', 'sign-out']
  }
  </script>