<template>
  <div class="h-full flex flex-col overflow-hidden bg-transparent text-white">  <!-- Added 'overflow-hidden' -->
    <div class="flex-1 flex flex-col">
      <div class="p-4 bg-white/5 border-b border-white/10 flex-shrink-0">
        <h2 class="text-3xl font-extrabold text-white tracking-tight flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About NiseAmen
        </h2>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 pb-24">  <!-- Changed pb-20 to pb-24 -->
        <div class="bg-white/5 rounded-xl p-6 space-y-6">
          <!-- App Info -->
          <div class="space-y-4">
            <div class="flex items-center justify-center mb-6">
              <img src="/img/CantiqueECC.webp" alt="NiseAmen Logo" class="w-24 h-24 rounded-full shadow-lg">
            </div>
            <h3 class="text-xl font-semibold text-cyan-400">About the App</h3>
            <p class="text-white/80 leading-relaxed">
              NiseAmen is a dedicated music player for Église du Christianisme Céleste cantiques.
              It provides an easy way to access and listen to spiritual songs while following along with the lyrics.
            </p>
          </div>

          <!-- Features -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-cyan-400">Features</h3>
            <ul class="space-y-2 text-white/80">
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Offline music playback
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Synchronized lyrics
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Search functionality
              </li>
            </ul>
          </div>

          <!-- Version Info -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-cyan-400">Version Info</h3>
            <div class="bg-white/5 rounded-lg p-4">
              <p class="text-white/80">Version: 1.0.0</p>
              <p class="text-white/60">Released: {{ new Date().getFullYear() }}</p>
            </div>
          </div>

          <!-- Contact -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-cyan-400">Contact</h3>
            <div class="flex items-center space-x-4">
              <a href="mailto:contact@niseamen.com" class="text-white/80 hover:text-white flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>