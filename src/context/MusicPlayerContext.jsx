import { createContext, useContext, useState, useRef, useEffect } from 'react'

const MusicPlayerContext = createContext()

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
}

export const MusicPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none') // 'none', 'one', 'all'
  const [playlist, setPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const audioRef = useRef(null)

  // Sample songs with realistic titles
  const sampleSongs = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Luna Echo",
      genre: "Electronic",
      duration: 245,
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Ocean Waves", 
      artist: "The Coastal Band",
      genre: "Indie",
      duration: 198,
      url: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      title: "City Lights",
      artist: "Urban Pulse", 
      genre: "Pop",
      duration: 223,
      url: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
      cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Mountain High",
      artist: "Peak Climbers",
      genre: "Rock", 
      duration: 312,
      url: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
      cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Jazz Night",
      artist: "Smooth Collective",
      genre: "Jazz",
      duration: 267,
      url: "https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav", 
      cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop"
    }
  ]

  // Initialize with sample songs
  useEffect(() => {
    setPlaylist(sampleSongs)
  }, [])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => handleNext()
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => {
      console.log('Audio can play:', audio.src)
      setIsLoading(false)
    }
    const handleError = (e) => {
      console.error('Audio error:', e)
      console.error('Audio error details:', audio.error)
      setError(`Failed to load audio: ${audio.error?.message || 'Unknown error'}`)
      setIsLoading(false)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  // Update audio source when current song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      console.log('Loading audio:', currentSong.url)
      audioRef.current.src = currentSong.url
      audioRef.current.load()
      setCurrentTime(0)
      setDuration(0)
      setError(null)
    }
  }, [currentSong])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const playSong = (song, index = 0) => {
    console.log('Playing song:', song.title)
    setCurrentSong(song)
    setCurrentIndex(index)
    setIsPlaying(true)
    setError(null)
  }

  const togglePlay = () => {
    if (!currentSong) {
      // If no song is selected, play the first one
      if (playlist.length > 0) {
        playSong(playlist[0], 0)
      }
      return
    }

    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play().catch(error => {
        console.error('Error playing audio:', error)
        setError(`Failed to play audio: ${error.message}`)
      })
      setIsPlaying(true)
    }
  }

  const handleNext = () => {
    if (playlist.length === 0) return

    let nextIndex
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length)
    } else {
      nextIndex = (currentIndex + 1) % playlist.length
    }

    const nextSong = playlist[nextIndex]
    playSong(nextSong, nextIndex)
  }

  const handlePrevious = () => {
    if (playlist.length === 0) return

    let prevIndex
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length)
    } else {
      prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    }

    const prevSong = playlist[prevIndex]
    playSong(prevSong, prevIndex)
  }

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all']
    const currentModeIndex = modes.indexOf(repeatMode)
    const nextModeIndex = (currentModeIndex + 1) % modes.length
    setRepeatMode(modes[nextModeIndex])
  }

  const addToPlaylist = (song) => {
    setPlaylist(prev => [...prev, song])
  }

  const removeFromPlaylist = (songId) => {
    setPlaylist(prev => prev.filter(song => song.id !== songId))
  }

  const clearPlaylist = () => {
    setPlaylist([])
    setCurrentSong(null)
    setIsPlaying(false)
    setCurrentIndex(0)
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const value = {
    // State
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
    
    // Actions
    playSong,
    togglePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleVolumeChange,
    toggleShuffle,
    toggleRepeat,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    setShowPlaylist,
    formatTime,
    
    // Refs
    audioRef
  }

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  )
} 