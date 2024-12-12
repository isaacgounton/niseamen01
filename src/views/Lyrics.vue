<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-900 text-white w-full">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div class="p-4 sm:p-8 bg-white/5 border-b border-white/10">
        <h2 class="text-3xl font-extrabold text-white tracking-tight flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Lyrics
        </h2>
        <h4 class="text-xl font-semibold text-white/80 mt-2 truncate">
          {{ currentSong?.title || 'No Song Selected' }}
        </h4>
      </div>
      
      <div class="p-4 sm:p-8">
        <div 
          v-if="currentLyrics" 
          class="bg-white/5 rounded-xl p-4 sm:p-6 h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar text-white/90"
        >
          <div class="whitespace-pre-line leading-relaxed text-lg font-light tracking-wide">
            {{ currentLyrics }}
          </div>
        </div>
        
        <div 
          v-else 
          class="text-white/70 text-center py-12 bg-white/5 rounded-xl flex flex-col items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <p class="text-2xl font-light">Select a song to view lyrics</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lyrics',
  props: ['currentLyrics', 'currentSong']
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