import React from 'react'
import SongCard from '../components/SongCard'
import { useMusicPlayer } from '../context/MusicPlayerContext'

const Home = () => {
  const { playlist } = useMusicPlayer()

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to MusicApp</h1>
          <p className="text-xl text-gray-600 mb-8">Discover, create, and share your favorite music</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">🎵 Discover Music</h2>
            <p className="text-gray-600">Explore and discover new music from around the world.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">📝 Create Playlists</h2>
            <p className="text-gray-600">Organize your favorite songs into custom playlists.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">🎤 Upload Songs</h2>
            <p className="text-gray-600">Share your own music with the community.</p>
          </div>
        </div>

        {/* Available Songs Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Songs</h2>
          {playlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlist.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No songs available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
