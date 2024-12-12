<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-900 text-white w-full">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div class="p-4 sm:p-8 bg-white/5 border-b border-white/10">
        <h2 class="text-3xl font-extrabold text-white tracking-tight flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </h2>
      </div>
      
      <div class="p-4 sm:p-8 space-y-6">
        <div v-if="user" class="space-y-4 sm:space-y-6">
          <div class="flex flex-col items-center">
            <img 
              :src="user.photoURL" 
              :alt="user.displayName" 
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-cyan-500"
            />
            <h2 class="text-2xl font-bold mt-4">{{ user.displayName }}</h2>
            <p class="text-gray-400">{{ user.email }}</p>
          </div>

          <div class="bg-white/5 rounded-xl p-6 space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Total Songs Played</span>
              <span class="font-bold">{{ totalSongsPlayed }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Favorite Genre</span>
              <span class="font-bold">{{ favoriteGenre }}</span>
            </div>
          </div>

          <button 
            @click="signOut"
            class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
        <div v-else class="flex flex-col items-center justify-center h-full">
          <h2 class="text-2xl mb-6">Login to NiseAmen</h2>
          <button 
            @click="signInWithGoogle"
            class="flex items-center bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google-standard.svg" 
              alt="Google logo" 
              class="w-6 h-6 mr-3"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'  // Make sure this path is correct
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const user = ref(null)
    const totalSongsPlayed = ref(0)
    const favoriteGenre = ref('Gospel')

    const signInWithGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
      } catch (error) {
        console.error('Sign in error:', error)
        alert('Failed to sign in. Please try again.')
      }
    }

    const signOut = async () => {
      try {
        await firebaseSignOut(auth)
        router.push('/')
      } catch (error) {
        console.error('Sign out error:', error)
      }
    }

    onMounted(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
      })

      return () => unsubscribe()
    })

    return {
      user,
      signInWithGoogle,
      signOut,
      totalSongsPlayed,
      favoriteGenre
    }
  }
}
</script>