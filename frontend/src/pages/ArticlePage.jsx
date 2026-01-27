import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { newsApi } from '../api/newsApi'
import { useLanguage } from '../contexts/LanguageContext'

const ArticlePage = () => {
  const { id } = useParams()
  const { t, language } = useLanguage()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticle()
  }, [id])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const data = await newsApi.getArticle(id)
      setArticle(data)
    } catch (error) {
      console.error('Error fetching article:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const locale = language === 'vi' ? 'vi-VN' : 'en-US'
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📰</div>
          <p className="text-xl text-gray-600">{t('loadingArticle')}</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-gray-600 mb-6">{t('articleNotFound')}</p>
          <Link to="/" className="btn-primary">
            {t('backToHome')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <span className="mr-2">←</span> {t('backToHome')}
          </Link>
        </div>

        <article className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto border border-gray-100">
          {/* Category Badge */}
          <div className="px-6 md:px-12 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="category-badge bg-blue-600 text-white">
                {article.category}
              </span>
              {article.is_featured && (
                <span className="category-badge bg-orange-500 text-white">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>

          {/* Article Title */}
          <div className="px-6 md:px-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 pb-6 mb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">✍️</span>
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span>{article.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span>{formatDate(article.published_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👁️</span>
                <span>{article.views} {t('views')}</span>
              </div>
            </div>
          </div>

          {/* Article Image Placeholder */}
          <div className="relative h-96 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
            <div className="text-9xl opacity-30">📰</div>
          </div>

          {/* Article Content */}
          <div className="px-6 md:px-12 py-8">
            <div className="prose prose-lg max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-1 first-letter:float-left">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">{t('tags')}:</span>
                <span className="category-badge">{article.category}</span>
                <span className="category-badge">{t('aiGenerated')}</span>
                <span className="category-badge">{t('fakeNews')}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-6 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
              <div className="flex gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-gray-900 mb-2">{t('disclaimerTitle')}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {t('disclaimerText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8 text-center bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-600 mb-4 font-medium">{t('enjoyedNews')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">
              🏠 {t('backToHome')}
            </Link>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              ⬆️ {t('scrollToTop')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlePage
