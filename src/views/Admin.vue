<template>
  <div class="container animate__animated animate__fadeIn bg-gradient-to-br from-purple-800 to-purple-600 text-white p-6 rounded-xl shadow-xl">
    <h1 class="text-2xl font-bold mb-4">NiseAmen Image2Text</h1>
    <button @click="toggleApiKey" class="btn-primary mb-4">Enter API Key</button>
    <input
      type="password"
      v-model="apiKey"
      :style="{ display: showApiKey ? 'block' : 'none' }"
      placeholder="Enter your OpenAI API Key"
      class="w-full p-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
    >
    
    <div
      ref="dropZone"
      class="drop-zone animate__animated animate__pulse bg-white/10 p-6 rounded-lg shadow-lg mb-4"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="icon text-4xl mb-2">📁</div>
      <p class="mb-4">Drag and drop an image here, or click to select a file</p>
      <button class="camera-btn btn-primary">
        <span class="camera-icon">📸</span>
        Take Photo
      </button>
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleFileInput"
      >
    </div>

    <div v-show="loading" class="loader"></div>

    <div v-show="!loading" id="result">
      <div ref="editor"></div>
    </div>

    <div v-show="!loading" class="edit-buttons">
      <button class="btn-primary mb-4" @click="editText">Edit Text</button>
      <button 
        v-show="isEditing"
        class="btn-primary mb-4"
        @click="saveChanges"
      >
        Save Changes
      </button>
      <button class="btn-primary mb-4" @click="copyText">Copy Text</button>
      <button class="btn-primary mb-4" @click="populateLyricsForm">
        Populate Lyrics Form
      </button>
    </div>

    <form @submit.prevent="saveLyrics" class="lyrics-form bg-white/10 p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4">Add or Update Lyrics</h2>
      <label for="songId" class="block mb-2">Song ID:</label>
      <input
        type="text"
        v-model="songId"
        placeholder="Enter song ID"
        required
        class="w-full p-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
      >
      <label for="lyrics" class="block mb-2">Lyrics:</label>
      <textarea
        v-model="lyrics"
        rows="6"
        placeholder="Enter lyrics here..."
        required
        class="w-full p-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
      ></textarea>
      <button type="submit" class="btn-primary w-full">Save Lyrics</button>
      <div v-if="successMessage" class="success-message mt-4 text-green-500">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message mt-4 text-red-500">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3zU2TFyASwkVHKlNFf57CJhp_9wnwRVU",
  authDomain: "niseamen.firebaseapp.com",
  databaseURL: "https://niseamen.firebaseio.com",
  projectId: "niseamen",
  storageBucket: "niseamen.appspot.com",
  messagingSenderId: "578866985713",
  appId: "1:578866985713:web:05df1380459293b50bc750"
}

export default {
  name: 'AdminView', // Add a clear component name
  setup() {
    const quill = ref(null)
    const dropZone = ref(null)
    const imageInput = ref(null)
    const loading = ref(false)
    const isEditing = ref(false)
    const showApiKey = ref(false)
    const apiKey = ref(localStorage.getItem('openai_api_key') || '')
    const songId = ref('')
    const lyrics = ref('')
    const successMessage = ref('')
    const errorMessage = ref('')

    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    onMounted(() => {
      // Initialize Quill editor
      quill.value = new Quill('#editor', {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      })
    })

    // Your existing methods converted to Vue composition API...
    // (I'll provide the most important ones below)

    const processImage = async (file) => {
      if (!apiKey.value) {
        alert('Please enter your OpenAI API Key')
        return
      }

      loading.value = true
      quill.value.setText('')

      try {
        const base64Image = await fileToBase64(file)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.value}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [{
              role: "user",
              content: [
                { type: "text", text: "Transcribe the text in this image..." },
                { 
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64Image}` }
                }
              ]
            }]
          })
        })

        const data = await response.json()
        quill.value.setText(data.choices[0].message.content)
      } catch (error) {
        console.error('Error:', error)
        quill.value.setText(`Error: ${error.message}`)
      } finally {
        loading.value = false
      }
    }

    const saveLyrics = async () => {
      successMessage.value = ''
      errorMessage.value = ''
      
      try {
        await setDoc(doc(db, 'lyrics', songId.value), {
          text: lyrics.value
        })
        successMessage.value = 'Lyrics saved successfully!'
      } catch (error) {
        console.error('Error saving lyrics:', error)
        errorMessage.value = 'Error saving lyrics. Please try again.'
      }
    }

    // Return the composition API refs and methods
    return {
      dropZone,
      imageInput,
      loading,
      isEditing,
      showApiKey,
      apiKey,
      songId,
      lyrics,
      successMessage,
      errorMessage,
      processImage,
      saveLyrics,
      // ... other methods
    }
  }
}
</script>

<style>
@import '../assets/admin.css';
</style>