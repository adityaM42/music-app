import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSongs } from '../context/SongContext'

const UploadSong = () => {
  const navigate = useNavigate()
  const { addSong } = useSongs()
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    album: '',
    releaseYear: '',
    description: ''
  })
  const [audioFile, setAudioFile] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState({})

  const genres = [
    'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip Hop', 
    'Country', 'R&B', 'Indie', 'Alternative', 'Folk', 'Blues', 'Other'
  ]

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Song title is required'
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist name is required'
    }

    if (!formData.genre) {
      newErrors.genre = 'Please select a genre'
    }

    if (!audioFile) {
      newErrors.audioFile = 'Please select an audio file'
    } else {
      // Check both MIME type and file extension for better compatibility
      const allowedMimeTypes = ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/m4a', 'audio/aac', 'audio/mpeg']
      const allowedExtensions = ['.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg']
      
      const fileExtension = '.' + audioFile.name.split('.').pop().toLowerCase()
      const isValidMimeType = allowedMimeTypes.includes(audioFile.type)
      const isValidExtension = allowedExtensions.includes(fileExtension)
      
      if (!isValidMimeType && !isValidExtension) {
        newErrors.audioFile = 'Please select a valid audio file (MP3, WAV, FLAC, M4A, AAC, OGG)'
      }
      
      if (audioFile.size > 50 * 1024 * 1024) { // 50MB limit
        newErrors.audioFile = 'File size must be less than 50MB'
      }
    }

    if (coverImage && coverImage.size > 5 * 1024 * 1024) { // 5MB limit
      newErrors.coverImage = 'Cover image must be less than 5MB'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0]
    setAudioFile(file)
    
    if (errors.audioFile) {
      setErrors(prev => ({
        ...prev,
        audioFile: ''
      }))
    }
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0]
    setCoverImage(file)
    
    if (errors.coverImage) {
      setErrors(prev => ({
        ...prev,
        coverImage: ''
      }))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }
    
    setIsUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    await simulateUpload()

    const newSong = {
      id: Date.now(),
      title: formData.title,
      artist: formData.artist,
      genre: formData.genre,
      album: formData.album || null,
      releaseYear: formData.releaseYear || null,
      description: formData.description || null,
      audioFile: audioFile.name,
      coverImage: coverImage?.name || null,
      uploadedAt: new Date().toISOString(),
      fileSize: audioFile.size,
      duration: Math.floor(Math.random() * 300) + 120, // Random duration between 2-7 minutes
      plays: 0,
      likes: 0
    }

    // Add the new song to the shared state
    addSong(newSong)
    
    console.log('Uploaded song:', newSong)
    
    // Show success message and redirect to home
    alert('Song uploaded successfully!')
    navigate('/')
  }

  const handleCancel = () => {
    if (audioFile || coverImage || Object.values(formData).some(value => value)) {
      if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Upload Song</h1>
          <p className="text-gray-600">Share your music with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Song Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Song Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Song Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter song title..."
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
                  Artist *
                </label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.artist ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter artist name..."
                />
                {errors.artist && <p className="text-red-500 text-sm mt-1">{errors.artist}</p>}
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.genre ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
              </div>

              <div>
                <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-2">
                  Album (Optional)
                </label>
                <input
                  type="text"
                  id="album"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter album name..."
                />
              </div>

              <div>
                <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Release Year (Optional)
                </label>
                <select
                  id="releaseYear"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us about your song..."
                />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            
            {/* Audio File Upload */}
            <div className="mb-6">
              <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700 mb-2">
                Audio File *
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.audioFile ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-400'
              }`}>
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  onChange={handleAudioFileChange}
                  className="hidden"
                />
                <label htmlFor="audioFile" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {audioFile ? audioFile.name : 'Click to upload audio file'}
                  </p>
                  <p className="text-sm text-gray-500">
                    MP3, WAV, FLAC, M4A, AAC, OGG up to 50MB
                  </p>
                </label>
              </div>
              {audioFile && (
                <div className="mt-2 text-sm text-gray-600">
                  File size: {formatFileSize(audioFile.size)}
                </div>
              )}
              {errors.audioFile && <p className="text-red-500 text-sm mt-1">{errors.audioFile}</p>}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image (Optional)
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.coverImage ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-purple-400'
              }`}>
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
                <label htmlFor="coverImage" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {coverImage ? coverImage.name : 'Click to upload cover image'}
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </label>
              </div>
              {coverImage && (
                <div className="mt-2 text-sm text-gray-600">
                  File size: {formatFileSize(coverImage.size)}
                </div>
              )}
              {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Uploading...</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload Song'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadSong
