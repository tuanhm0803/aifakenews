import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Set up axios interceptor to add token to requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get('/api/auth/me')
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching user:', error)
        // Invalid token, clear it
        logout()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [token])

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login/json', {
        username,
        password
      })
      
      const { access_token, user: userData } = response.data
      
      localStorage.setItem('token', access_token)
      setToken(access_token)
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      }
    }
  }

  const register = async (username, email, password, fullName = '', role = 'viewer') => {
    try {
      await axios.post('/api/auth/register', {
        username,
        email,
        password,
        full_name: fullName,
        role
      })
      
      // Auto-login after registration
      return await login(username, password)
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const isAuthenticated = () => {
    return !!user
  }

  const hasRole = (roles) => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const canGenerateNews = () => {
    return hasRole(['admin', 'author'])
  }

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    canGenerateNews
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}
