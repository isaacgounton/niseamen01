import * as algoliasearch from 'algoliasearch'

const client = algoliasearch.default(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY
)

const songIndex = client.initIndex('niseamen_songs')  // Changed index name to be specific to your app

export const algoliaService = {
  async initializeIndex(songs) {
    try {
      // Transform songs into Algolia records
      const records = songs.map(song => ({
        objectID: song.id,
        title: song.title,
        artist: song.artist,
        lyrics: song.lyrics,
        // Only include necessary fields for search
        searchableContent: `${song.title} ${song.artist || ''} ${song.lyrics || ''}`
      }))
      
      // Save objects to Algolia
      const { objectIDs } = await songIndex.saveObjects(records)
      console.log('Successfully indexed songs:', objectIDs.length)
      
      // Configure searchable attributes and ranking
      await songIndex.setSettings({
        searchableAttributes: [
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
        ]
      })
    } catch (error) {
      console.error('Error initializing Algolia index:', error)
    }
  },

  async search(query) {
    try {
      const { hits } = await songIndex.search(query, {
        attributesToRetrieve: ['objectID', 'title', 'artist', 'lyrics'],
        attributesToHighlight: ['title', 'lyrics'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
        snippetEllipsisText: '...',
        // Add advanced search options
        typoTolerance: true,
        minWordSizefor1Typo: 3,
        minWordSizefor2Typos: 7,
        hitsPerPage: 50
      })
      return hits
    } catch (error) {
      console.error('Error searching:', error)
      return []
    }
  }
}
