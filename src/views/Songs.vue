<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4 pt-24">
    <div class="w-full max-w-4xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden">
      <div class="p-8 bg-white/5 border-b border-white/10">
        <h2 class="text-3xl font-extrabold text-white tracking-tight flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Songs
        </h2>
      </div>
      
      <div class="p-8">
        <div class="bg-white/5 rounded-xl p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
          <div class="song-list space-y-4">
            <div 
              v-for="song in songs" 
              :key="song.id" 
              :class="[
                'song-item', 
                'p-4 rounded-lg cursor-pointer text-white transition-all duration-300 ease-in-out',
                { 'bg-purple-700/50': song.id === currentSong?.id },
                'hover:bg-purple-700/70 hover:scale-[1.02] active:scale-[0.98]'
              ]"
              @click="playSong(song)"
            >
              <div class="flex justify-between items-center">
                <span class="text-lg font-medium">{{ song.id }} - {{ song.title }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Songs',
  props: {
    songs: {
      type: Array,
      required: true
    },
    currentSong: {
      type: Object,
      default: null
    }
  },
  emits: ['playSong'],
  methods: {
    playSong(song) {
      this.$emit('playSong', song)
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>