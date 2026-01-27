import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const NewsCard = ({ article, featured = false, layout = 'default' }) => {
  const { t, language } = useLanguage()
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000 / 60) // minutes
    
    if (diff < 60) return `${diff} ${t('minutesAgo')}`
    if (diff < 1440) return `${Math.floor(diff / 60)} ${t('hoursAgo')}`
    const locale = language === 'vi' ? 'vi-VN' : 'en-US'
    return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Large Featured Card
  if (featured && layout === 'hero') {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <div className="news-card h-full overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="news-card-image h-80 md:h-full">
              <div className="absolute top-4 left-4 z-10">
                <span className="category-badge bg-red-600 text-white">
                  🔥 HOT
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-8xl opacity-20">📰</div>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="category-badge">{article.category}</span>
                <span className="text-xs text-gray-500">• {formatDate(article.published_date)}</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-6 line-clamp-3">
                {truncateContent(article.content, 250)}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>👁️</span> {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📍</span> {article.location}
                  </span>
                </div>
                <span className="text-blue-600 font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                  {t('readMore')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Featured Card
  if (featured) {
    return (
      <Link to={`/article/${article.id}`} className="block group">
        <div className="news-card h-full">
          <div className="news-card-image h-56">
            <div className="absolute top-3 left-3">
              <span className="category-badge bg-orange-500 text-white">
                ⭐ Featured
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
              <div className="text-white text-7xl opacity-20">📰</div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="category-badge">{article.category}</span>
              <span className="text-xs text-gray-400">• {formatDate(article.published_date)}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {truncateContent(article.content, 180)}
            </p>
            <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
              <span className="text-gray-500 flex items-center gap-1">
                <span>👁️</span> {article.views}
              </span>
              <span className="text-blue-600 font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                {t('viewMore')} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Default Card
  return (
    <Link to={`/article/${article.id}`} className="block group">
      <div className="news-card h-full">
        <div className="news-card-image h-44">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-5xl">📄</div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="category-badge text-xs">{article.category}</span>
            <span className="text-xs text-gray-400">{formatDate(article.published_date)}</span>
          </div>
          <h3 className="text-base font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {truncateContent(article.content, 120)}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1">
              <span>👁️</span> {article.views}
            </span>
            <span className="text-blue-600 font-medium">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NewsCard
