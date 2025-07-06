import React, { createContext, useContext, useState } from 'react'

const SongContext = createContext()

export const useSongs = () => {
  const context = useContext(SongContext)
  if (!context) {
    throw new Error('useSongs must be used within a SongProvider')
  }
  return context
}

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Luna Echo",
      genre: "Electronic",
      duration: 245,
      uploadedAt: "2024-01-15T10:30:00Z",
      plays: 1250,
      likes: 89,
      coverImage: null
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "The Coastal Band",
      genre: "Indie",
      duration: 198,
      uploadedAt: "2024-01-10T14:20:00Z",
      plays: 890,
      likes: 67,
      coverImage: null
    },
    {
      id: 3,
      title: "City Lights",
      artist: "Urban Pulse",
      genre: "Pop",
      duration: 223,
      uploadedAt: "2024-01-20T16:45:00Z",
      plays: 2100,
      likes: 156,
      coverImage: null
    },
    {
      id: 4,
      title: "Mountain High",
      artist: "Peak Climbers",
      genre: "Rock",
      duration: 312,
      uploadedAt: "2024-01-05T09:15:00Z",
      plays: 750,
      likes: 45,
      coverImage: null
    },
    {
      id: 5,
      title: "Jazz Night",
      artist: "Smooth Collective",
      genre: "Jazz",
      duration: 267,
      uploadedAt: "2024-01-12T11:30:00Z",
      plays: 680,
      likes: 52,
      coverImage: null
    },
    {
      id: 6,
      title: "Digital Love",
      artist: "Synthwave",
      genre: "Electronic",
      duration: 189,
      uploadedAt: "2024-01-18T13:25:00Z",
      plays: 920,
      likes: 78,
      coverImage: null
    }
  ])

  const addSong = (newSong) => {
    setSongs(prev => [newSong, ...prev])
  }

  const updateSong = (id, updatedSong) => {
    setSongs(prev => prev.map(song => 
      song.id === id ? { ...song, ...updatedSong } : song
    ))
  }

  const deleteSong = (id) => {
    setSongs(prev => prev.filter(song => song.id !== id))
  }

  const getRecentSongs = (count = 3) => {
    return songs
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, count)
  }

  const getFeaturedSongs = (count = 6) => {
    return songs
      .sort((a, b) => b.plays - a.plays)
      .slice(0, count)
  }

  const value = {
    songs,
    addSong,
    updateSong,
    deleteSong,
    getRecentSongs,
    getFeaturedSongs
  }

  return (
    <SongContext.Provider value={value}>
      {children}
    </SongContext.Provider>
  )
} 