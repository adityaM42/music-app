import React, { createContext, useContext, useState } from 'react'

const PlaylistContext = createContext()

export const usePlaylists = () => {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistProvider')
  }
  return context
}

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      name: "Chill Vibes",
      description: "Perfect for relaxing evenings and study sessions",
      coverImage: null,
      isPublic: true,
      songCount: 12,
      totalDuration: 2847,
      genre: "Electronic",
      createdAt: "2024-01-15T10:30:00Z",
      songs: [
        { id: 1, title: "Midnight Dreams", artist: "Luna Echo", duration: 245 },
        { id: 2, title: "Ocean Waves", artist: "The Coastal Band", duration: 198 }
      ]
    },
    {
      id: 2,
      name: "Workout Mix",
      description: "High energy tracks to keep you motivated during workouts",
      coverImage: null,
      isPublic: true,
      songCount: 8,
      totalDuration: 2156,
      genre: "Rock",
      createdAt: "2024-01-10T14:20:00Z",
      songs: [
        { id: 4, title: "Mountain High", artist: "Peak Climbers", duration: 312 },
        { id: 8, title: "Electric Storm", artist: "Thunder", duration: 298 }
      ]
    },
    {
      id: 3,
      name: "Jazz Collection",
      description: "Classic and modern jazz favorites",
      coverImage: null,
      isPublic: false,
      songCount: 15,
      totalDuration: 3890,
      genre: "Jazz",
      createdAt: "2024-01-05T09:15:00Z",
      songs: [
        { id: 5, title: "Jazz Night", artist: "Smooth Collective", duration: 267 }
      ]
    },
    {
      id: 4,
      name: "Pop Hits 2024",
      description: "Latest pop songs that are trending this year",
      coverImage: null,
      isPublic: true,
      songCount: 20,
      totalDuration: 4567,
      genre: "Pop",
      createdAt: "2024-01-20T16:45:00Z",
      songs: [
        { id: 3, title: "City Lights", artist: "Urban Pulse", duration: 223 }
      ]
    },
    {
      id: 5,
      name: "Indie Discoveries",
      description: "Hidden gems from independent artists",
      coverImage: null,
      isPublic: true,
      songCount: 6,
      totalDuration: 1456,
      genre: "Indie",
      createdAt: "2024-01-12T11:30:00Z",
      songs: [
        { id: 2, title: "Ocean Waves", artist: "The Coastal Band", duration: 198 }
      ]
    }
  ])

  const addPlaylist = (newPlaylist) => {
    setPlaylists(prev => [newPlaylist, ...prev])
  }

  const updatePlaylist = (id, updatedPlaylist) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === id ? { ...playlist, ...updatedPlaylist } : playlist
    ))
  }

  const deletePlaylist = (id) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== id))
  }

  const value = {
    playlists,
    addPlaylist,
    updatePlaylist,
    deletePlaylist
  }

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  )
} 