import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { newsApi } from '../api/newsApi'

const FeaturesPage = () => {
  const { canGenerateNews } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('characters')
  const [characters, setCharacters] = useState([])
  const [places, setPlaces] = useState([])
  const [weather, setWeather] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')

  useEffect(() => {
    if (!canGenerateNews()) {
      navigate('/')
      return
    }
    fetchAllFeatures()
  }, [canGenerateNews, navigate])

  const fetchAllFeatures = async () => {
    try {
      setLoading(true)
      const [chars, plcs, wthr, evts] = await Promise.all([
        newsApi.getCharacters(),
        newsApi.getPlaces(),
        newsApi.getWeather(),
        newsApi.getEvents()
      ])
      setCharacters(chars)
      setPlaces(plcs)
      setWeather(wthr)
      setEvents(evts)
    } catch (error) {
      console.error('Error fetching features:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormName('')
    setFormDescription('')
    setShowAddModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormName(item.name)
    setFormDescription(item.description || '')
    setShowAddModal(true)
  }

  const handleSave = async () => {
    try {
      if (editingItem) {
        // Update
        if (activeTab === 'characters') {
          await newsApi.updateCharacter(editingItem.id, formName, formDescription)
        } else if (activeTab === 'places') {
          await newsApi.updatePlace(editingItem.id, formName, formDescription)
        } else if (activeTab === 'weather') {
          await newsApi.updateWeather(editingItem.id, formName, formDescription)
        } else if (activeTab === 'events') {
          await newsApi.updateEvent(editingItem.id, formName, formDescription)
        }
      } else {
        // Create
        if (activeTab === 'characters') {
          await newsApi.createCharacter(formName, formDescription)
        } else if (activeTab === 'places') {
          await newsApi.createPlace(formName, formDescription)
        } else if (activeTab === 'weather') {
          await newsApi.createWeather(formName, formDescription)
        } else if (activeTab === 'events') {
          await newsApi.createEvent(formName, formDescription)
        }
      }
      setShowAddModal(false)
      fetchAllFeatures()
    } catch (error) {
      console.error('Error saving feature:', error)
      alert('Failed to save. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      if (activeTab === 'characters') {
        await newsApi.deleteCharacter(id)
      } else if (activeTab === 'places') {
        await newsApi.deletePlace(id)
      } else if (activeTab === 'weather') {
        await newsApi.deleteWeather(id)
      } else if (activeTab === 'events') {
        await newsApi.deleteEvent(id)
      }
      fetchAllFeatures()
    } catch (error) {
      console.error('Error deleting feature:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'characters': return characters
      case 'places': return places
      case 'weather': return weather
      case 'events': return events
      default: return []
    }
  }

  const getTabConfig = () => {
    const configs = {
      characters: { icon: '👤', label: 'Characters', description: 'People and entities in your stories' },
      places: { icon: '📍', label: 'Places', description: 'Locations where events occur' },
      weather: { icon: '🌤️', label: 'Weather', description: 'Weather conditions for atmosphere' },
      events: { icon: '📅', label: 'Events', description: 'Activities and happenings' }
    }
    return configs[activeTab]
  }

  if (!canGenerateNews()) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">🎭</span>
              News Features Management
            </h1>
            <p className="text-gray-600">
              Manage characters, places, weather, and events that AI will use to generate fake news
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {['characters', 'places', 'weather', 'events'].map((tab) => {
                  const config = {
                    characters: { icon: '👤', label: 'Characters' },
                    places: { icon: '📍', label: 'Places' },
                    weather: { icon: '🌤️', label: 'Weather' },
                    events: { icon: '📅', label: 'Events' }
                  }[tab]
                  
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                        activeTab === tab
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-xl">{config.icon}</span>
                      <span>{config.label}</span>
                      <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                        {getCurrentData().length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span>{getTabConfig().icon}</span>
                    <span>{getTabConfig().label}</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{getTabConfig().description}</p>
                </div>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>Add New</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4 animate-pulse">⏳</div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              ) : getCurrentData().length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-xl text-gray-600 mb-2">No items yet</p>
                  <p className="text-gray-500 mb-4">Add your first {activeTab} to get started</p>
                  <button
                    onClick={handleAdd}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add {getTabConfig().label}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCurrentData().map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                      <div className="mt-2 text-xs text-gray-400">
                        {item.created_by && `Added by ${item.created_by}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">How It Works</h3>
                <p className="text-sm text-gray-700">
                  When generating news, AI will randomly pick one feature from each category and create a story incorporating all of them.
                  For example: "Character: The Mayor, Place: City Hall, Event: Grand Opening, Weather: Sunny"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit' : 'Add New'} {getTabConfig().label}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${activeTab} name`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Add a brief description"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={!formName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {editingItem ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeaturesPage
