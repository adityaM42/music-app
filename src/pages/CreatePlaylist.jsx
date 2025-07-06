import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlaylists } from '../context/PlaylistContext'
import { useMusicPlayer } from '../context/MusicPlayerContext'

const CreatePlaylist = () => {
  const navigate = useNavigate()
  const { addPlaylist } = usePlaylists()
  const { playlist: availableSongs } = useMusicPlayer()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    coverImage: null
  })
  const [selectedSongs, setSelectedSongs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredSongs = availableSongs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }))
  }

  const toggleSongSelection = (song) => {
    setSelectedSongs(prev => {
      const isSelected = prev.find(s => s.id === song.id)
      if (isSelected) {
        return prev.filter(s => s.id !== song.id)
      } else {
        return [...prev, song]
      }
    })
  }

  const removeSongFromPlaylist = (songId) => {
    setSelectedSongs(prev => prev.filter(song => song.id !== songId))
  }

  const moveSong = (songId, direction) => {
    setSelectedSongs(prev => {
      const index = prev.findIndex(song => song.id === songId)
      if (index === -1) return prev

      const newSongs = [...prev]
      if (direction === 'up' && index > 0) {
        [newSongs[index], newSongs[index - 1]] = [newSongs[index - 1], newSongs[index]]
      } else if (direction === 'down' && index < newSongs.length - 1) {
        [newSongs[index], newSongs[index + 1]] = [newSongs[index + 1], newSongs[index]]
      }
      return newSongs
    })
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newPlaylist = {
      id: Date.now(),
      ...formData,
      songs: selectedSongs,
      createdAt: new Date().toISOString(),
      songCount: selectedSongs.length,
      totalDuration: selectedSongs.reduce((total, song) => total + song.duration, 0),
      genre: selectedSongs.length > 0 ? selectedSongs[0].genre : 'Mixed'
    }

    // Add the new playlist to the shared state
    addPlaylist(newPlaylist)
    
    console.log('Created playlist:', newPlaylist)
    
    setIsSubmitting(false)
    
    // Navigate to playlists page to see the new playlist
    navigate('/playlists')
  }

  const isFormValid = formData.name.trim() && selectedSongs.length > 0

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Playlist</h1>
          <p className="text-gray-600">Build your perfect playlist by adding songs and customizing details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Playlist Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Playlist Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter playlist name..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your playlist..."
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                  Make playlist public
                </label>
              </div>
            </div>
          </div>

          {/* Song Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Songs */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Available Songs</h2>
              
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search songs, artists, or genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Song List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSongs.map(song => {
                  const isSelected = selectedSongs.find(s => s.id === song.id)
                  return (
                    <div
                      key={song.id}
                      onClick={() => toggleSongSelection(song)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-100 border border-purple-300'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{song.title}</p>
                          <p className="text-xs text-gray-600">{song.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {song.genre}
                        </span>
                        <span className="text-xs text-gray-500">{formatDuration(song.duration)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Songs */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Selected Songs</h2>
                <span className="text-sm text-gray-600">
                  {selectedSongs.length} song{selectedSongs.length !== 1 ? 's' : ''}
                </span>
              </div>

              {selectedSongs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                  </svg>
                  <p>No songs selected</p>
                  <p className="text-sm">Select songs from the left panel to add to your playlist</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedSongs.map((song, index) => (
                    <div key={song.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-500 w-6">{index + 1}</span>
                        <div>
                          <p className="font-medium text-sm">{song.title}</p>
                          <p className="text-xs text-gray-600">{song.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => moveSong(song.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSong(song.id, 'down')}
                          disabled={index === selectedSongs.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSongFromPlaylist(song.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSongs.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">
                    Total Duration: {formatDuration(selectedSongs.reduce((total, song) => total + song.duration, 0))}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/playlists')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePlaylist
