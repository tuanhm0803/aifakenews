import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { newsApi } from '../api/newsApi'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const [categories, setCategories] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const { language, toggleLanguage, t } = useLanguage()
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await newsApi.getCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Alert Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 text-center text-sm font-medium shadow-md">
        <span className="inline-flex items-center gap-2">
          🚨 <span className="font-bold">{t('disclaimer')}</span>
        </span>
      </div>
      
      {/* Main Header */}
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}>
        <div className="container mx-auto px-4">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-4xl group-hover:scale-110 transition-transform">📰</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {t('siteName')}
                </h1>
                <p className="text-xs text-gray-500 font-medium">{t('siteSubtitle')}</p>
              </div>
            </Link>
            
            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <span>🔍</span>
                <span>{t('search')}</span>
              </button>
              
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                title={language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
              >
                <span className="text-lg">{language === 'en' ? '🇻🇳' : '🇺🇸'}</span>
                <span>{language === 'en' ? 'VI' : 'EN'}</span>
              </button>

              {/* User Authentication */}
              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span>👤</span>
                    <span>{user?.username}</span>
                    {user?.role === 'admin' && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">Admin</span>}
                    {user?.role === 'author' && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">Author</span>}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        <div className="font-semibold text-gray-900">{user?.full_name || user?.username}</div>
                        <div className="text-xs">{user?.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    🔐 Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📝 Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="py-3">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === '/'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🏠 {t('home')}
              </Link>
              {categories.slice(0, 6).map(category => (
                <Link
                  key={category}
                  to={`/category/${category}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    location.pathname === `/category/${category}`
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
