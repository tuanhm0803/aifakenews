import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { newsApi } from '../api/newsApi'

const AboutPage = () => {
  const { hasRole } = useAuth()
  const [content, setContent] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [updatedBy, setUpdatedBy] = useState(null)

  const isAdmin = hasRole(['admin'])

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      setLoading(true)
      const data = await newsApi.getAbout()
      setContent(data.content || '')
      setUpdatedAt(data.updated_at)
      setUpdatedBy(data.updated_by)
    } catch (error) {
      console.error('Error fetching about content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditContent(content)
    setEditMode(true)
  }

  const handleCancel = () => {
    setEditMode(false)
    setEditContent('')
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const data = await newsApi.updateAbout(editContent)
      setContent(data.content)
      setUpdatedAt(data.updated_at)
      setUpdatedBy(data.updated_by)
      setEditMode(false)
      alert('About page updated successfully! ✅')
    } catch (error) {
      console.error('Error updating about content:', error)
      alert('Failed to update about page. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📖</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">📖</span>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
                  <p className="text-gray-600 mt-1">Learn more about this project</p>
                </div>
              </div>
              {isAdmin && !editMode && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
              )}
            </div>

            {/* Update Info */}
            {updatedAt && (
              <div className="text-sm text-gray-500 border-t pt-3 mt-3">
                Last updated: {new Date(updatedAt).toLocaleString()}
                {updatedBy && ` by ${updatedBy}`}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            {editMode ? (
              <div>
                <div className="mb-4">
                  <label htmlFor="about-content" className="block text-sm font-medium text-gray-700 mb-2">
                    Edit About Content
                  </label>
                  <textarea
                    id="about-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Write your story here..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    You can use plain text. Line breaks will be preserved.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {saving ? '💾 Saving...' : '💾 Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {content ? (
                  <div className="prose prose-lg max-w-none">
                    {content.split('\n').map((paragraph, index) => (
                      paragraph && <p key={`para-${index}`} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-xl text-gray-600 mb-2">No content yet</p>
                    <p className="text-gray-500">
                      {isAdmin
                        ? 'Click the Edit button above to add your story.'
                        : 'The website owner hasn\'t added their story yet.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">About This Project</h3>
                <p className="text-sm text-gray-700">
                  This is an AI-powered fake news generator created for entertainment and educational purposes.
                  All news articles are completely fictitious and should not be shared as real news.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
