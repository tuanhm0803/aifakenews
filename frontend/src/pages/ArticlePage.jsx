import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { newsApi } from '../api/newsApi'

const ArticlePage = () => {
  const { id } = useParams()
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
    return date.toLocaleDateString('en-US', {
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
          <div className="text-6xl mb-4">📰</div>
          <p className="text-xl text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-gray-600 mb-6">Article not found</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-manteiv-blue hover:text-blue-700 mb-6">
          ← Back to News
        </Link>

        <article className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="relative h-96 bg-gradient-to-r from-manteiv-blue to-blue-600 flex items-center justify-center">
            <div className="text-white text-9xl">📰</div>
            {article.is_featured && (
              <div className="absolute top-6 left-6 bg-manteiv-gold text-white px-4 py-2 rounded-full font-bold">
                ⭐ FEATURED
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <span className="bg-manteiv-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                {article.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">📝</span>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">📍</span>
                <span>{article.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">📅</span>
                <span>{formatDate(article.published_date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">👁️</span>
                <span>{article.views} views</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-12 p-6 bg-yellow-50 border-l-4 border-manteiv-gold rounded">
              <p className="text-sm text-gray-700">
                <strong>⚠️ Disclaimer:</strong> This article is completely fictional and AI-generated 
                for entertainment purposes only. Any resemblance to real persons, living or dead, 
                or actual events is purely coincidental.
              </p>
            </div>
          </div>
        </article>

        {/* Share Section */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <p className="text-gray-600 mb-4">Enjoyed this fake news? Generate more!</p>
          <Link to="/" className="btn-primary">
            Generate More Fake News
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ArticlePage
