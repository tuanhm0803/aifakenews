import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { newsApi } from '../api/newsApi'

const Header = () => {
  const [categories, setCategories] = useState([])

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
  }, [])

  return (
    <header className="bg-gradient-to-r from-manteiv-blue to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-3xl font-bold">📰</div>
            <div>
              <h1 className="text-2xl font-bold">Manteiv Daily News</h1>
              <p className="text-sm text-blue-200">AI-Powered Fake News Network</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-manteiv-gold transition-colors">
              Home
            </Link>
            {categories.slice(0, 5).map(category => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="hover:text-manteiv-gold transition-colors"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="bg-manteiv-gold text-gray-900 py-2 px-4 text-center text-sm font-semibold">
          🚨 BREAKING: All news on this site is 100% FAKE and AI-generated for entertainment! 🚨
        </div>
      </div>
    </header>
  )
}

export default Header
