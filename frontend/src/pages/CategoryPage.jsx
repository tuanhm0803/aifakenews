import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { newsApi } from '../api/newsApi'
import NewsCard from '../components/NewsCard'
import { useLanguage } from '../contexts/LanguageContext'

const CategoryPage = () => {
  const { category } = useParams()
  const { t } = useLanguage()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategoryNews()
  }, [category])

  const fetchCategoryNews = async () => {
    try {
      setLoading(true)
      const data = await newsApi.getAllNews(0, 20, category)
      setNews(data)
    } catch (error) {
      console.error('Error fetching category news:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📰</div>
          <p className="text-xl text-gray-600">{t('loading')} {category}...</p>
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

        {/* Category Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">📂</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                {category}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('allNews')} {category.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <span className="font-medium">{news.length} {t('articles')}</span>
            <span>•</span>
            <span>{t('updatedContinuously')}</span>
          </div>
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 mb-2">{t('noArticlesInCategory')} {category}</p>
            <p className="text-gray-500 mb-6">{t('noArticlesCategoryDescription')}</p>
            <Link to="/" className="btn-primary">
              {t('backToHome')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {news.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
