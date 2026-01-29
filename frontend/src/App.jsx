import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import CategoryPage from './pages/CategoryPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GenerateNewsPage from './pages/GenerateNewsPage'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-grow">
              <Sidebar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/article/:id" element={<ArticlePage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/generate-news" element={<GenerateNewsPage />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
