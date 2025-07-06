import React from 'react'
import { useMusicPlayer } from '../context/MusicPlayerContext'

const SongCard = ({ song }) => {
  const { currentSong, isPlaying, playSong, addToPlaylist } = useMusicPlayer()

  const isCurrentSong = currentSong?.id === song?.id
  const isCurrentlyPlaying = isCurrentSong && isPlaying

  const handlePlayPause = () => {
    if (isCurrentSong) {
      // If it's the current song, toggle play/pause
      // This will be handled by the music player's toggle function
    } else {
      // Play this song
      playSong(song)
    }
  }

  const handleAddToPlaylist = () => {
    addToPlaylist(song)
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Song Image */}
      <div className="relative group">
        <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
          {song?.cover ? (
            <img 
              src={song.cover} 
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl text-white">🎵</span>
          )}
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-opacity-100"
          >
            {isCurrentlyPlaying ? (
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Currently Playing Indicator */}
        {isCurrentSong && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {isCurrentlyPlaying ? '▶️ Playing' : '⏸️ Paused'}
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {song?.title || 'Unknown Song'}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {song?.artist || 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Song Details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
            {song?.genre || 'Pop'}
          </span>
          <span>{formatDuration(song?.duration || 180)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={handleAddToPlaylist}
            className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
          >
            Add to Playlist
          </button>
          <button 
            onClick={handlePlayPause}
            className="px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
            title={isCurrentSong ? (isCurrentlyPlaying ? 'Pause' : 'Play') : 'Play'}
          >
            {isCurrentSong && isCurrentlyPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SongCard
