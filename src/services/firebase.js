// src/services/firebase.js
import { db, auth } from '../firebase'
import { 
  doc, 
  collection, 
  getDocs, 
  getDoc, 
  setDoc,
  query,
  orderBy 
} from 'firebase/firestore'
import { algoliaService } from './algolia'

export const songService = {
  // Fetch all songs
  async fetchSongs() {
    try {
      const songsRef = collection(db, 'songs')
      const snapshot = await getDocs(songsRef)
      const songs = []
      
      // Fetch all songs and their lyrics in parallel
      const songPromises = snapshot.docs.map(async (doc) => {
        const song = doc.data()
        const lyrics = await this.fetchLyrics(song.id)
        return {
          id: song.id,
          title: song.title,
          artist: song.artist,
          url: song.url,
          albumArt: song.albumArt,
          lyrics: lyrics || '' // Include lyrics in the song object
        }
      })
      
      const songsWithLyrics = await Promise.all(songPromises)
      
      // Initialize Algolia index with the songs
      await algoliaService.initializeIndex(songsWithLyrics)
      
      // Sort songs by ID numerically
      return songsWithLyrics.sort((a, b) => {
        const numA = parseInt(a.id)
        const numB = parseInt(b.id)
        return numA - numB
      })
    } catch (error) {
      console.error('Error fetching songs:', error)
      throw error
    }
  },

  // Fetch lyrics for a specific song
  async fetchLyrics(songId) {
    try {
      const lyricRef = doc(db, 'lyrics', songId)
      const lyricDoc = await getDoc(lyricRef)
      
      if (lyricDoc.exists()) {
        return lyricDoc.data().text
      }
      return null
    } catch (error) {
      console.error('Error fetching lyrics:', error)
      throw error
    }
  },

  async saveLastPlayed(userId, songId, progress, timestamp) {
    try {
      const lastPlayedRef = doc(db, 'users', userId, 'lastPlayed', songId)
      await setDoc(lastPlayedRef, {
        songId,
        progress,
        timestamp
      })
    } catch (error) {
      console.error('Error saving last played:', error)
      throw error
    }
  },

  async getLastPlayed(userId) {
    try {
      const lastPlayedRef = collection(db, 'users', userId, 'lastPlayed')
      const q = query(lastPlayedRef, orderBy('timestamp', 'desc'))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        return {
          songId: doc.data().songId,
          progress: doc.data().progress,
          timestamp: doc.data().timestamp
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting last played:', error)
      throw error
    }
  }
}