import React, { useState, useEffect } from 'react'
import { newsApi } from '../api/newsApi'
import NewsCard from '../components/NewsCard'
import { useLanguage } from '../contexts/LanguageContext'

const HomePage = () => {
  const { t } = useLanguage()
  const [featuredNews, setFeaturedNews] = useState([])
  const [allNews, setAllNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const [featured, all] = await Promise.all([
        newsApi.getFeaturedNews(4),
        newsApi.getAllNews(0, 16)
      ])
      setFeaturedNews(featured)
      setAllNews(all)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📰</div>
          <p className="text-xl text-gray-600">{t('loading')}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Featured Story */}
        {featuredNews.length > 0 && (
          <section className="mb-8">
            <NewsCard article={featuredNews[0]} featured={true} layout="hero" />
          </section>
        )}

        {/* Top Stories Grid */}
        {featuredNews.length > 1 && (
          <section className="mb-8">
            <h2 className="section-title">
              <span className="flex items-center gap-2">
                <span>🔥</span>
                <span>{t('hotStories')}</span>
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredNews.slice(1).map(article => (
                <NewsCard key={article.id} article={article} featured={true} />
              ))}
            </div>
          </section>
        )}

        {/* Latest News */}
        <section className="mb-8">
          <h2 className="section-title">
            <span className="flex items-center gap-2">
              <span>📰</span>
              <span>{t('latestNews')}</span>
            </span>
          </h2>
          {allNews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600 mb-2 font-semibold">{t('noArticles')}</p>
              <p className="text-gray-500 mb-6">{t('noArticlesDescription')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {allNews.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Additional Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-100">
          <p className="text-gray-700">
            <span className="font-bold text-blue-600">{t('infoNote')}:</span> {t('infoText')} 🎭
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
