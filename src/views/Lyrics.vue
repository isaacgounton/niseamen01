<template>
  <div class="h-full flex flex-col overflow-hidden">  <!-- Added 'overflow-hidden' -->
    <div class="flex-1 flex flex-col">
      <div class="p-4 bg-white/5 border-b border-white/10 flex-shrink-0">
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
      
      <div class="flex-1 overflow-y-auto p-4 pb-24">  <!-- Changed pb-20 to pb-24 -->
        <div 
          v-if="currentLyrics" 
          class="bg-white/5 rounded-xl p-4 max-h-[calc(120vh-24rem)] overflow-y-auto playlist-scrollbar"> <!-- Reverted back to max-h -->
          <div class="whitespace-pre-line leading-relaxed text-lg font-light tracking-wide">
            {{ currentLyrics }}
          </div>
        </div>
        
        <div 
          v-else 
          class="h-full text-white/70 text-center bg-white/5 rounded-xl flex flex-col items-center justify-center"
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