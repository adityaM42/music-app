import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import MusicPlayer from './components/MusicPlayer'
import AppRoutes from './routes'
import { PlaylistProvider } from './context/PlaylistContext'
import { SongProvider } from './context/SongContext'
import { AuthProvider } from './context/AuthContext'
import { MusicPlayerProvider } from './context/MusicPlayerContext'

const App = () => {
  return (
    <AuthProvider>
      <MusicPlayerProvider>
        <SongProvider>
          <PlaylistProvider>
            <Router>
              <div className="min-h-screen bg-gray-100 pb-24">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <AppRoutes />
                </main>
                <MusicPlayer />
              </div>
            </Router>
          </PlaylistProvider>
        </SongProvider>
      </MusicPlayerProvider>
    </AuthProvider>
  )
}

export default App

