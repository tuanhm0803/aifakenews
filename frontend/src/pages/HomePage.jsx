import React, { useState, useEffect } from 'react'
import { newsApi } from '../api/newsApi'
import NewsCard from '../components/NewsCard'

const HomePage = () => {
  const [featuredNews, setFeaturedNews] = useState([])
  const [allNews, setAllNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchNews()
    fetchStats()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const [featured, all] = await Promise.all([
        newsApi.getFeaturedNews(3),
        newsApi.getAllNews(0, 12)
      ])
      setFeaturedNews(featured)
      setAllNews(all)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

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
      await fetchNews()
      await fetchStats()
      alert('New fake news generated successfully! 🎉')
    } catch (error) {
      console.error('Error generating news:', error)
      alert('Failed to generate news. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-xl text-gray-600">Loading the latest fake news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-manteiv-blue to-blue-600 text-white rounded-2xl p-8 mb-12 shadow-xl">
        <h2 className="text-4xl font-bold mb-4">Welcome to Manteiv Daily News</h2>
        <p className="text-xl mb-6">
          Your #1 source for completely fabricated news stories powered by AI! 
          Featuring stories about famous billionaires and more!
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleGenerateNews(false)}
            disabled={generating}
            className="btn-secondary"
          >
            {generating ? '⏳ Generating...' : '✨ Generate Random News'}
          </button>
          <button
            onClick={() => handleGenerateNews(true)}
            disabled={generating}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          >
            {generating ? '⏳ Generating...' : '💎 Generate Billionaire Story'}
          </button>
        </div>
        {stats && (
          <div className="mt-6 text-sm">
            📊 Total Fake Articles Published: <span className="font-bold text-manteiv-gold">{stats.total_articles}</span>
          </div>
        )}
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="text-manteiv-gold mr-2">⭐</span>
            Featured Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNews.map(article => (
              <NewsCard key={article.id} article={article} featured={true} />
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-2">📰</span>
          Latest News
        </h2>
        {allNews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600 mb-4">No news articles yet!</p>
            <p className="text-gray-500 mb-6">Click the buttons above to generate some fake news.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allNews.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
