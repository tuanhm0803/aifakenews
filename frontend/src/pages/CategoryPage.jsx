import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { newsApi } from '../api/newsApi'
import NewsCard from '../components/NewsCard'

const CategoryPage = () => {
  const { category } = useParams()
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
          <div className="text-6xl mb-4">📰</div>
          <p className="text-xl text-gray-600">Loading {category} news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-manteiv-blue hover:text-blue-700 mb-6">
        ← Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category} News</h1>
        <p className="text-gray-600">
          All the latest fake {category.toLowerCase()} news from Manteiv
        </p>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600">No {category} news articles yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
