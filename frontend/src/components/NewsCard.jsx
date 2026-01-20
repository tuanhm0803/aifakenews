import React from 'react'
import { Link } from 'react-router-dom'

const NewsCard = ({ article, featured = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (featured) {
    return (
      <Link to={`/article/${article.id}`} className="block">
        <div className="news-card h-full">
          <div className="relative h-64 bg-gradient-to-r from-manteiv-blue to-blue-600">
            <div className="absolute top-4 left-4 bg-manteiv-gold text-white px-3 py-1 rounded-full text-sm font-bold">
              ⭐ FEATURED
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
              📰
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span className="bg-manteiv-blue text-white px-2 py-1 rounded text-xs">
                {article.category}
              </span>
              <span>•</span>
              <span>{article.location}</span>
              <span>•</span>
              <span>{formatDate(article.published_date)}</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 hover:text-manteiv-blue transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {truncateContent(article.content, 200)}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                👁️ {article.views} views
              </span>
              <span className="text-manteiv-blue font-semibold">
                Read More →
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/article/${article.id}`} className="block">
      <div className="news-card h-full">
        <div className="relative h-48 bg-gradient-to-r from-gray-400 to-gray-500">
          <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">
            📄
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
              {article.category}
            </span>
            <span>•</span>
            <span>{formatDate(article.published_date)}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-manteiv-blue transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {truncateContent(article.content)}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              👁️ {article.views} views
            </span>
            <span className="text-manteiv-blue font-semibold">
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NewsCard
