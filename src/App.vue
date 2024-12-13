<template>
  <div class="h-screen flex flex-col">
    <!-- Main Content Area -->
    <main class="flex-1 w-full overflow-auto">
      <div class="h-full w-full">
        <router-view 
          :songs="songs"
          :currentSong="currentSong"
          :isPlaying="isPlaying"
          :currentTime="currentTime"
          :duration="duration"
          :progress="progress"
          :currentLyrics="currentLyrics"
          @playSong="playSong"
          @previousTrack="previousTrack"
          @nextTrack="nextTrack"
          @togglePlay="togglePlay"
          @seek="seek"
          class="h-[calc(100vh-4rem)]"
        ></router-view>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-violet-900/90 backdrop-blur-lg border-t border-white/10 h-20 fixed bottom-0 left-0 right-0 z-50 shadow-lg shadow-black/50">
      <div class="h-full w-full">
        <div class="flex justify-around items-center h-full pb-safe">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="flex flex-col items-center text-white/60 hover:text-white transition-colors pb-2"
            :class="{ 'text-cyan-400': $route.path === item.path }"
          >
            <i :class="item.icon" class="text-2xl mb-1"></i>
            <span class="text-xs">{{ item.text }}</span>
          </router-link>
          
          <!-- Login/Profile Icon -->
          <router-link 
            to="/profile"
            class="flex flex-col items-center text-white/60 hover:text-white transition-colors pb-2"
            :class="{ 'text-cyan-400': $route.path === '/profile' }"
          >
            <i class="fas fa-user-circle text-2xl mb-1"></i>
            <span class="text-xs">
              {{ user ? 'Profile' : 'Login' }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>
  </div>

  <!-- Toast notification with updated colors -->
  <div 
    v-if="errorMessage" 
    class="fixed top-4 right-4 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out"
  >
    {{ errorMessage }}
  </div>
</template>
  
<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, storage } from './firebase'
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { songService } from './services/firebase'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMusic, faBook, faInfo, faUser } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'App',
  components: {
    FontAwesomeIcon
  },
  setup() {
    const router = useRouter()

    // State
    const user = ref(null)
    const songs = ref([])
    const currentSong = ref(null)
    const currentLyrics = ref(null)
    const audio = ref(null)
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const progressBar = ref(null)
    const errorMessage = ref('') // Add error message state
    let errorTimer = null // Add error message timer

    // Modify menuItems to remove Admin
    const menuItems = [
      { 
        text: 'Songs', 
        path: '/', 
        icon: 'fas fa-music'
      },
      { 
        text: 'Lyrics', 
        path: '/lyrics', 
        icon: 'fas fa-book'
      },
      { 
        text: 'About', 
        path: '/about', 
        icon: 'fas fa-info'
      }
    ]
      
    // Computed
    const progress = computed(() => 
      (currentTime.value / duration.value) * 100 || 0
    )

    // Methods
    const signIn = async () => {
      try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
      } catch (error) {
        console.error('Sign in error:', error)
      }
    }

    const signOut = async () => {
      try {
        await saveCurrentState()
        await firebaseSignOut(auth)
        user.value = null
      } catch (error) {
        console.error('Sign out error:', error)
      }
    }

    const initializeAudio = () => {
      if (!audio.value) {
        audio.value = new Audio()
        audio.value.preload = 'metadata'

        audio.value.addEventListener('timeupdate', () => {
          currentTime.value = audio.value.currentTime
        })

        audio.value.addEventListener('loadedmetadata', () => {
          duration.value = audio.value.duration
        })

        audio.value.addEventListener('ended', nextTrack)
      }
    }


    const restoreLastPlayed = async () => {
      if (user.value) {
        try {
          const lastPlayed = await songService.getLastPlayed(user.value.uid)
          if (lastPlayed) {
            const song = songs.value.find(s => s.id === lastPlayed.songId)
            if (song) {
              currentSong.value = song
              // Remove this line: audio.value.src = song.url
              
              // Instead, call playSong with autoplay set to false
              await playSong(song, false)
              
              // Set the currentTime after the audio has loaded
              audio.value.addEventListener('loadedmetadata', () => {
                audio.value.currentTime = lastPlayed.progress
              }, { once: true })

              await loadLyrics(song.id)
            }
          }
        } catch (error) {
          console.error('Error restoring last played song:', error)
        }
      }
    }


    const saveCurrentState = async () => {
      if (user.value && currentSong.value) {
        try {
          await songService.saveLastPlayed(
            user.value.uid,
            currentSong.value.id,
            audio.value.currentTime,
            Date.now()
          )
        } catch (error) {
          console.error('Error saving current state:', error)
        }
      }
    }


    const loadSongs = async () => {
      try {
        songs.value = await songService.fetchSongs()
        
        if (!currentSong.value && songs.value.length > 0) {
          currentSong.value = songs.value[0]
          if (audio.value) {
            const musicRef = storageRef(storage, songs.value[0].url)
            const downloadURL = await getDownloadURL(musicRef)
            audio.value.src = downloadURL
          }
          await loadLyrics(songs.value[0].id)
        }
      } catch (error) {
        console.error("Error loading songs:", error)
        // Handle the error (e.g., show a message to the user)
      }
    }


    const loadLyrics = async (songId) => {
      try {
        currentLyrics.value = await songService.fetchLyrics(songId)
      } catch (error) {
        console.error('Error loading lyrics:', error)
        currentLyrics.value = "Lyrics not available for this song."
      }
    }

    const showError = (message) => {
      errorMessage.value = message
      if (errorTimer) clearTimeout(errorTimer)
      errorTimer = setTimeout(() => {
        errorMessage.value = ''
      }, 3000)
    }

    const playSong = async (song, autoplay = true) => {
      if (!song?.url) {
        showError('This song is not available')
        return
      }

      initializeAudio()
      currentSong.value = song
      
      try {
        // Get the download URL from Firebase Storage
        const musicRef = storageRef(storage, song.url)
        const downloadURL = await getDownloadURL(musicRef)
        
        // Reset audio state
        audio.value.onerror = null
        audio.value.src = ''
        
        // Set up error handling
        audio.value.onerror = (e) => {
          console.error('Audio error:', e)
          isPlaying.value = false
          showError('Unable to play song. Please try again.')
        }

        // Set up mobile audio context
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext
          if (AudioContext && !window.audioContext) {
            window.audioContext = new AudioContext()
          }
          if (window.audioContext?.state === 'suspended') {
            await window.audioContext.resume()
          }
        } catch (audioContextError) {
          console.error('AudioContext error:', audioContextError)
        }

        // Load and play audio
        audio.value.src = downloadURL
        if (autoplay) {
          try {
            await audio.value.load() // Explicitly load before playing
            const playPromise = audio.value.play()
            if (playPromise !== undefined) {
              await playPromise
              isPlaying.value = true
            }
          } catch (playError) {
            console.error('Play error:', playError)
            isPlaying.value = false
            if (playError.name === 'NotAllowedError') {
              showError('Tap to enable audio playback')
            } else {
              showError('Unable to play song. Please try again.')
            }
          }
        }
      } catch (error) {
        console.error('Error playing audio:', error)
        isPlaying.value = false
        if (error.code === 'storage/object-not-found') {
          showError('This song is not available')
        } else if (error.code === 'storage/unauthorized') {
          showError('Please sign in to play songs')
        } else {
          showError('Network error. Please check your connection.')
        }
      }
      
      await loadLyrics(song.id)
    }


    const togglePlay = async () => {
      if (!audio.value) return
      
      try {
        if (audio.value.paused) {
          if (!audio.value.src) {
            // If no song is loaded, play the current song
            await playSong(currentSong.value)
          } else {
            await audio.value.play()
          }
          isPlaying.value = true
        } else {
          audio.value.pause()
          isPlaying.value = false
          await saveCurrentState()
        }
      } catch (error) {
        console.error('Error toggling play:', error)
      }
    }


    // Add a watch for isPlaying to handle state changes
    watch(isPlaying, (newIsPlaying) => {
      if (newIsPlaying && audio.value && audio.value.paused) {
        audio.value.play().catch(error => console.error('Error playing audio:', error))
      } else if (!newIsPlaying && audio.value && !audio.value.paused) {
        audio.value.pause()
      }
    })


    const previousTrack = () => {
      const currentIndex = songs.value.findIndex(s => s.id === currentSong.value?.id)
      if (currentIndex > 0) {
        playSong(songs.value[currentIndex - 1])
      }
    }

    const nextTrack = () => {
      const currentIndex = songs.value.findIndex(s => s.id === currentSong.value?.id)
      if (currentIndex < songs.value.length - 1) {
        playSong(songs.value[currentIndex + 1])
      }
    }

    const seek = (event) => {
      if (!audio.value.duration) return
      
      const rect = progressBar.value.getBoundingClientRect()
      const clickPosition = event.clientX - rect.left
      const percent = clickPosition / rect.width
      const newTime = percent * audio.value.duration
      
      audio.value.currentTime = Math.max(0, Math.min(newTime, audio.value.duration))
    }

    // Lifecycle
    onMounted(() => {
      initializeAudio() // Initialize audio on component mount
      loadSongs()

      onAuthStateChanged(auth, async (userData) => {
        user.value = userData
        if (userData) {
          await restoreLastPlayed()
        }
      })

      // Event listener for saving state before unload
      window.addEventListener('beforeunload', saveCurrentState)

      // Event listener for saving state when page becomes hidden
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          saveCurrentState()
        }
      })

      // Cleanup function
      return () => {
        // Remove event listeners
        window.removeEventListener('beforeunload', saveCurrentState)
        document.removeEventListener('visibilitychange', saveCurrentState)

        // Clean up audio event listeners
        if (audio.value) {
          audio.value.removeEventListener('timeupdate', null)
          audio.value.removeEventListener('loadedmetadata', null)
          audio.value.removeEventListener('ended', nextTrack)
        }

        // If there's an ongoing audio playback, pause it
        if (audio.value && !audio.value.paused) {
          audio.value.pause()
        }

        // Save the current state one last time when component is unmounted
        saveCurrentState()
      }
    })

    // Add cleanup for error timer
    onUnmounted(() => {
      if (errorTimer) clearTimeout(errorTimer)
    })
      
      return {
        user,
        menuItems,
        songs,
        currentSong,
        currentLyrics,
        isPlaying,
        currentTime,
        duration,
        progress,
        progressBar,
        signIn,
        signOut,
        playSong,
        togglePlay,
        previousTrack,
        nextTrack,
        seek,
        audio,
        loadLyrics,
        errorMessage,
      }
    }
  }
</script>

<style lang="postcss">
body {
  @apply overflow-hidden m-0 p-0;
}

#app {
  @apply h-screen w-screen overflow-hidden;
}

@media (max-width: 640px) {
  main {
    padding-bottom: 5rem; /* Increased from 4rem to 5rem to account for taller nav */
  }
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-1rem); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-1rem); }
}

.animate-fade-in-out {
  animation: fadeInOut 3s ease-in-out;
}

/* Add this to your existing styles */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>