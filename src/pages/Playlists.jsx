import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlaylists } from '../context/PlaylistContext'

const Playlists = () => {
  const { playlists } = usePlaylists()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGenre, setFilterGenre] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const filteredPlaylists = playlists
    .filter(playlist => {
      const matchesSearch = playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = filterGenre === 'all' || playlist.genre === filterGenre
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'songs':
          return b.songCount - a.songCount
        case 'duration':
          return b.totalDuration - a.totalDuration
        default:
          return 0
      }
    })

  const genres = ['all', ...new Set(playlists.map(p => p.genre))]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Playlists</h1>
              <p className="text-gray-600">Manage and organize your music collections</p>
            </div>
            <Link
              to="/create-playlist"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>Create New</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{playlists.length}</div>
              <div className="text-sm text-gray-600">Total Playlists</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {playlists.reduce((total, p) => total + p.songCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Songs</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(playlists.reduce((total, p) => total + p.totalDuration, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {playlists.filter(p => p.isPublic).length}
              </div>
              <div className="text-sm text-gray-600">Public Playlists</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search playlists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <div className="md:w-48">
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="recent">Recently Created</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="songs">Most Songs</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Playlists Grid */}
        {filteredPlaylists.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No playlists found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Link
              to="/create-playlist"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Your First Playlist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map(playlist => (
              <div key={playlist.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative">
                  <span className="text-4xl text-white">🎵</span>
                  {!playlist.isPublic && (
                    <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                      Private
                    </div>
                  )}
                </div>

                {/* Playlist Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {playlist.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                      {playlist.genre}
                    </span>
                    <span>{formatDate(playlist.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{playlist.songCount} songs</span>
                    <span>{formatDuration(playlist.totalDuration)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                      Play All
                    </button>
                    <button className="px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Playlists 