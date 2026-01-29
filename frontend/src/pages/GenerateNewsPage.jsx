import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { newsApi } from '../api/newsApi'

const GenerateNewsPage = () => {
  const { canGenerateNews, user } = useAuth()
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Redirect if user doesn't have permission
    if (!canGenerateNews()) {
      navigate('/')
      return
    }
    fetchStats()
  }, [canGenerateNews, navigate])

  const fetchStats = async () => {
    try {
      const statsData = await newsApi.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleGenerateNews = async (includeBillionaire = false) => {
    try {
      setGenerating(true)
      await newsApi.generateNews(null, 'general', includeBillionaire)
      await fetchStats()
      alert('New fake news generated successfully! 🎉')
    } catch (error) {
      console.error('Error generating news:', error)
      alert('Failed to generate news. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (!canGenerateNews()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">✨</span>
              Generate AI Fake News
            </h1>
            <p className="text-gray-600">
              Create AI-generated fake news articles. Only accessible by admins and authors.
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👤</span>
              <div>
                <p className="font-semibold text-gray-900">{user?.username}</p>
                <p className="text-sm text-gray-600">Role: <span className="font-medium text-blue-600 uppercase">{user?.role}</span></p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          {stats && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📊</span>
                Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Articles</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total_articles}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Featured Articles</p>
                  <p className="text-3xl font-bold text-green-600">{stats.featured_articles}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Categories</p>
                  <p className="text-3xl font-bold text-purple-600">{Object.keys(stats.by_category || {}).length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generate News Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Random News Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <div className="text-4xl mb-3">🎲</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Random Fake News</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Generate a completely random fake news article about any topic. The AI will create a unique story with random themes and content.
                </p>
              </div>
              <button
                onClick={() => handleGenerateNews(false)}
                disabled={generating}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {generating ? '⏳ Generating...' : '🎲 Generate Random News'}
              </button>
            </div>

            {/* Billionaire News Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <div className="text-4xl mb-3">💎</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Billionaire News</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Generate a fake news article about famous billionaires. The AI will create sensational stories about tech moguls, business tycoons, and celebrities.
                </p>
              </div>
              <button
                onClick={() => handleGenerateNews(true)}
                disabled={generating}
                className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {generating ? '⏳ Generating...' : '💎 Generate Billionaire News'}
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Important Notice</h4>
                <p className="text-sm text-amber-800">
                  All news articles generated on this platform are <strong>completely fake and satirical</strong>. 
                  They are created for entertainment purposes only and should not be shared as real news. 
                  Please use this tool responsibly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateNewsPage
