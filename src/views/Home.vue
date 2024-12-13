<template>
  <div class="h-full flex flex-col overflow-hidden">  <!-- Added 'overflow-hidden' -->
    <div class="flex-1 flex flex-col">  <!-- Changed to 'flex-1 flex flex-col' -->
      <!-- Player Info Section -->
      <div class="p-4 bg-white/5 border-b border-white/10">
        <div class="flex items-center space-x-4 sm:space-x-6">
          <div class="w-16 h-16 sm:w-24 sm:h-24 relative">
            <img 
              :src="currentSong?.albumArt || './img/CantiqueECC.webp'" 
              :class="[
                'w-full h-full rounded-full object-cover border-4 border-purple-400/50', 
                { 'animate-spin': isPlaying }
              ]"
              alt="Album Art"
            />
            <div 
              v-if="isPlaying" 
              class="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-semibold text-white truncate">
              {{ currentSong?.title || 'Select a song' }}
            </h2>
            <p class="text-white/80 truncate">
              {{ currentSong?.artist || 'Église du christianisme céleste' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Controls Section -->
      <div class="p-4 space-y-4 flex-shrink-0">
        <!-- Progress Bar -->
        <div>
          <div 
            class="bg-white/20 h-2 rounded-full cursor-pointer"
            @click="seek"
            ref="progressBar"
          >
            <div 
              class="bg-purple-400 h-full rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-white/50 mt-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex justify-center items-center space-x-4 sm:space-x-8">
          <button 
            @click="previousTrack"
            class="text-white/80 hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button 
            @click="togglePlay"
            class="w-12 h-12 sm:w-16 sm:h-16 bg-purple-400 rounded-full flex items-center justify-center hover:bg-purple-500 transition-all hover:scale-110 active:scale-95"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6 sm:h-8 sm:w-8 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                v-if="!isPlaying" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path 
                v-if="isPlaying" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </button>
          <button 
            @click="nextTrack"
            class="text-white/80 hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Search input -->
      <div class="px-4 flex-shrink-0">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="search"
            inputmode="text"
            placeholder="Search songs or lyrics..."
            class="w-full p-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none"
          />
          <div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg class="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Playlist with dynamic height -->
      <div class="flex-1 overflow-y-auto p-4 pb-24">
        <div class="bg-white/5 rounded-lg max-h-[calc(120vh-24rem)] overflow-y-auto playlist-scrollbar"> <!-- Added playlist-scrollbar class -->
          <div class="p-2 space-y-1"> <!-- Added padding and spacing -->
            <div 
              v-for="song in filteredSongs"
              :key="song.id"
              :class="[
                'p-3 rounded-lg cursor-pointer transition-all duration-200',
                'hover:bg-white/20 hover:translate-x-1', // Changed scale to translate for smoother effect
                currentSong?.id === song.id ? 'bg-purple-400 text-white' : 'text-white'
              ]"
              @click="playSong(song)"
            >
              <div class="flex flex-col">
                <span class="font-medium" v-html="song.title"></span>
                <template v-if="searchQuery && song.matchedLyrics">
                  <span class="text-sm text-white/60 mt-1 italic" v-html="song.matchedLyrics"></span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { algoliaService } from '../services/algolia'
import debounce from 'lodash/debounce'

export default {
  name: 'Home',
  props: ['songs', 'currentSong', 'isPlaying', 'currentTime', 'duration', 'progress'],
  emits: ['previousTrack', 'nextTrack', 'togglePlay', 'playSong', 'seek'],
  setup(props, { emit }) {
    const user = ref(null)
    const searchQuery = ref('')
    const searchResults = ref([])
    const isSearching = ref(false)

    const signIn = () => {
      // Implement sign-in logic
    }

    const signOut = () => {
      // Implement sign-out logic
    }

    // Debounced search function
    const performSearch = debounce(async (query) => {
      if (!query) {
        searchResults.value = []
        return
      }
      
      isSearching.value = true
      try {
        const results = await algoliaService.search(query)
        searchResults.value = results.map(hit => ({
          ...hit,
          id: hit.objectID,
          title: hit._highlightResult?.title?.value || hit.title,
          matchedLyrics: hit._highlightResult?.lyrics?.value
        }))
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        isSearching.value = false
      }
    }, 300)

    // Watch for search query changes
    watch(searchQuery, (newQuery) => {
      performSearch(newQuery)
    })

    const filteredSongs = computed(() => {
      if (!searchQuery.value) return props.songs
      return searchResults.value
    })

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const previousTrack = () => emit('previousTrack')
    const nextTrack = () => emit('nextTrack')
    const togglePlay = () => emit('togglePlay')
    const playSong = (song) => emit('playSong', song)
    const seek = (event) => emit('seek', event)

    return {
      user,
      signIn,
      signOut,
      searchQuery,
      filteredSongs,
      isSearching,
      formatTime,
      previousTrack,
      nextTrack,
      togglePlay,
      playSong,
      seek
    }
  }
}
</script>

<style>
/* Add styles for Algolia highlights */
mark {
  background-color: rgba(168, 85, 247, 0.3);
  color: white;
  font-weight: 500;
  border-radius: 0.125rem;
  padding-left: 0.125rem;
  padding-right: 0.125rem;
}
</style>
