import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16 border-t-4 border-blue-600">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-4xl">📰</div>
              <div>
                <h3 className="text-xl font-bold">AI Fake Daily News</h3>
                <p className="text-sm text-gray-400">Mạng tin giả do AI tạo ra</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Nguồn tin tức giả hàng đầu được tạo hoàn toàn bởi trí tuệ nhân tạo. 
              Tất cả các câu chuyện đều là hư cấu và chỉ nhằm mục đích giải trí!
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span>📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                <span>🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                <span>📸</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-400">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  → Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  → Giới thiệu
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  → Liên hệ
                </a>
              </li>
            </ul>
          </div>
          
          {/* Tech Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-400">Công nghệ</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>⚡</span> FastAPI Backend
              </li>
              <li className="flex items-center gap-2">
                <span>⚛️</span> React Frontend
              </li>
              <li className="flex items-center gap-2">
                <span>🎨</span> Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <span>🤖</span> AI (Gemini/ChatGPT)
              </li>
              <li className="flex items-center gap-2">
                <span>🐳</span> Docker
              </li>
            </ul>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-8 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="text-orange-400 font-bold">⚠️ Tuyên bố từ chối trách nhiệm:</span> 
              {' '}Đây là một trang web mang tính châm biếm. Tất cả các bài viết đều là hư cấu 
              và được tạo bởi AI. Bất kỳ sự giống nhau nào với người thật, sống hay đã chết, 
              hoặc các sự kiện thực tế đều là ngẫu nhiên.
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2026 AI Fake Daily News. Tất cả các quyền giả mạo được bảo lưu. 🎭</p>
          <p className="mt-1">Made with ❤️ and AI</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
