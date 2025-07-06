import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing user on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Simulated API delay
  const simulateApiCall = (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Generate a simple token
  const generateToken = () => {
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }

  // Register new user
  const register = async (userData) => {
    try {
      setError(null)
      setLoading(true)

      // Simulate API delay
      await simulateApiCall()

      // Validation
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Please fill in all fields')
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      // Check if user already exists (using localStorage)
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const existingUser = existingUsers.find(
        u => u.email === userData.email || u.username === userData.username
      )

      if (existingUser) {
        throw new Error('User already exists with this email or username')
      }

      // Create new user
      const newUser = {
        _id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: 'user',
        isVerified: true,
        bio: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }

      // Store user in localStorage (in real app, this would be in database)
      existingUsers.push({
        ...newUser,
        password: userData.password // In real app, this would be hashed
      })
      localStorage.setItem('users', JSON.stringify(existingUsers))

      // Generate token
      const token = generateToken()

      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (credentials) => {
    try {
      setError(null)
      setLoading(true)

      // Simulate API delay
      await simulateApiCall()

      // Validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Please provide email and password')
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Find user
      const user = users.find(u => u.email === credentials.email)
      if (!user) {
        throw new Error('Invalid credentials')
      }

      // Check password (in real app, this would be hashed comparison)
      if (user.password !== credentials.password) {
        throw new Error('Invalid credentials')
      }

      // Update last login
      user.lastLogin = new Date().toISOString()
      
      // Update user in storage
      const updatedUsers = users.map(u => 
        u._id === user._id ? user : u
      )
      localStorage.setItem('users', JSON.stringify(updatedUsers))

      // Generate token
      const token = generateToken()

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user

      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null)
      setLoading(true)

      // Simulate API delay
      await simulateApiCall()

      if (!user) {
        throw new Error('User not authenticated')
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u._id === user._id)
      
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      // Check if username is already taken
      if (profileData.username) {
        const existingUser = users.find(
          u => u.username === profileData.username && u._id !== user._id
        )
        if (existingUser) {
          throw new Error('Username already taken')
        }
      }

      // Update user
      const updatedUser = { ...users[userIndex], ...profileData }
      users[userIndex] = updatedUser
      localStorage.setItem('users', JSON.stringify(users))

      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)

      return { success: true, user: userWithoutPassword }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setError(null)
      setLoading(true)

      // Simulate API delay
      await simulateApiCall()

      if (!user) {
        throw new Error('User not authenticated')
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u._id === user._id)
      
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      // Check current password
      if (users[userIndex].password !== passwordData.currentPassword) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      users[userIndex].password = passwordData.newPassword
      localStorage.setItem('users', JSON.stringify(users))

      return { success: true }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Get current user data
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null

      // Simulate API delay
      await simulateApiCall()

      const storedUser = localStorage.getItem('user')
      if (!storedUser) {
        throw new Error('User data not found')
      }

      const userData = JSON.parse(storedUser)
      setUser(userData)
      
      return userData
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
      return null
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token')
  }

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('token')
  }

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    getCurrentUser,
    isAuthenticated,
    getToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 