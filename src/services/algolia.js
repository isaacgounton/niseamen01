import * as algoliasearch from 'algoliasearch'

const client = algoliasearch.default(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
)

const songIndex = client.initIndex('niseamen_songs')  // Changed index name to be specific to your app

export const algoliaService = {
  async initializeIndex(songs) {
    try {
      // Transform songs into Algolia records with numeric handling
      const records = songs.map(song => ({
        objectID: song.id,
        title: song.title,
        // Add numeric fields for better number searching
        songNumber: parseInt(song.title.match(/\d+/)?.[0] || '0', 10),
        artist: song.artist,
        lyrics: song.lyrics,
        // Include number in searchable content
        searchableContent: `${song.title} ${song.artist || ''} ${song.lyrics || ''} ${song.title.match(/\d+/)?.[0] || ''}`
      }))
      
      // Save objects to Algolia
      const { objectIDs } = await songIndex.saveObjects(records)
      if (import.meta.env.DEV) {
        console.log(`Algolia indexing completed: ${objectIDs.length} songs processed`)
      }
      
      // Update index settings for numeric search
      await songIndex.setSettings({
        searchableAttributes: [
          'songNumber',  // Add numeric field first for priority
          'title',
          'artist',
          'lyrics',
          'searchableContent'
        ],
        attributesToHighlight: ['title', 'lyrics'],
        ranking: [
          'typo',
          'geo',
          'words',
          'filters',
          'proximity',
          'attribute',
          'exact',
          'custom'
        ],
        // Optimize for number searches
        numericAttributesForFiltering: ['songNumber'],
        typoTolerance: false,  // Disable typo tolerance for exact number matching
        queryType: 'prefixAll',
        distinct: true
      })
    } catch (error) {
      console.error('Error initializing Algolia index:', error)
    }
  },

  async reindexAll(songs) {
    try {
      // Clear the existing index
      await songIndex.clearObjects()
      console.log('Cleared existing index')

      // Reindex all songs
      return await this.initializeIndex(songs)
    } catch (error) {
      console.error('Error reindexing:', error)
      throw error
    }
  },

  async search(query) {
    try {
      // Check if query is a number
      const isNumber = /^\d+$/.test(query)
      
      const searchParams = {
        attributesToRetrieve: ['objectID', 'title', 'artist', 'lyrics', 'songNumber'],
        attributesToHighlight: ['title', 'lyrics'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
        snippetEllipsisText: '...',
        hitsPerPage: 50
      }

      // Add numeric filtering if it's a number
      if (isNumber) {
        searchParams.numericFilters = [`songNumber = ${parseInt(query, 10)}`]
      }

      const { hits } = await songIndex.search(query, searchParams)
      return hits
    } catch (error) {
      console.error('Error searching:', error)
      return []
    }
  }
}
