import React from 'react'
import { useMusicPlayer } from '../context/MusicPlayerContext'

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffled,
    repeatMode,
    playlist,
    currentIndex,
    showPlaylist,
    isLoading,
    error,
    playSong,
    togglePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleVolumeChange,
    toggleShuffle,
    toggleRepeat,
    setShowPlaylist,
    formatTime,
    audioRef
  } = useMusicPlayer()

  const handleSeekClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    handleSeek(newTime)
  }

  const handleVolumeSliderChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    handleVolumeChange(newVolume)
  }

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
        )
      case 'all':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg>
        )
    }
  }

  if (!currentSong && playlist.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {/* Hidden audio element */}
      <audio ref={audioRef} />
      
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center overflow-hidden">
              {currentSong?.cover ? (
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xl">🎵</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {currentSong?.title || 'No song playing'}
              </h3>
              <p className="text-xs text-gray-600 truncate">
                {currentSong?.artist || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center space-x-4">
            {/* Shuffle Button */}
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                isShuffled ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Shuffle"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Previous"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Next"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>

            {/* Repeat Button */}
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== 'none' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {getRepeatIcon()}
            </button>
          </div>

          {/* Volume and Playlist Controls */}
          <div className="flex items-center space-x-4">
            {/* Error Display */}
            {error && (
              <div className="text-red-500 text-xs max-w-32 truncate" title={error}>
                {error}
              </div>
            )}

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeSliderChange}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Playlist Button */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Playlist"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div
            className="w-full h-1 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleSeekClick}
          >
            <div
              className="h-1 bg-purple-600 rounded-full transition-all duration-100"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Playlist Panel */}
      {showPlaylist && (
        <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-h-64 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Playlist</h3>
              <span className="text-sm text-gray-500">{playlist.length} songs</span>
            </div>
            <div className="space-y-2">
              {playlist.map((song, index) => (
                <div
                  key={song.id}
                  onClick={() => {
                    playSong(song, index)
                    setShowPlaylist(false)
                  }}
                  className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    index === currentIndex
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    {index === currentIndex && isPlaying ? (
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <span className="text-xs text-gray-600">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <p className="text-xs text-gray-600 truncate">{song.artist}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(song.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MusicPlayer
