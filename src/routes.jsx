import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreatePlaylist from './pages/CreatePlaylist'
import UploadSong from './pages/UploadSong'
import Playlists from './pages/Playlists'
import ProtectedRoute from './components/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/create-playlist" element={
        <ProtectedRoute>
          <CreatePlaylist />
        </ProtectedRoute>
      } />
      <Route path="/upload-song" element={
        <ProtectedRoute>
          <UploadSong />
        </ProtectedRoute>
      } />
      <Route path="/playlists" element={
        <ProtectedRoute>
          <Playlists />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default AppRoutes 