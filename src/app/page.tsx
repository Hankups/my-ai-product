'use client';

import { useState } from 'react';
import ImageGenerator from '@/components/ImageGenerator';
import VideoGenerator from '@/components/VideoGenerator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            🎨 AI 创作工坊
          </h1>
          <p className="text-gray-600 text-center mt-2">
            AI驱动的图像和视频生成平台
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'image'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📸 文生图
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ml-2 ${
                activeTab === 'video'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎬 文生视频
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="mb-8">
          {activeTab === 'image' && <ImageGenerator />}
          {activeTab === 'video' && <VideoGenerator />}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">快速生成</h3>
            <p className="text-gray-600 text-sm">
              基于最新的AI模型，快速生成高质量的图像和视频内容
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">多种风格</h3>
            <p className="text-gray-600 text-sm">
              支持写实、艺术、卡通等多种风格，满足不同创作需求
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-2xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">简单易用</h3>
            <p className="text-gray-600 text-sm">
              无需复杂操作，输入描述即可生成，支持移动端使用
            </p>
          </div>
        </div>

        {/* API Info Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-yellow-800 mb-2">🔑 API配置说明</h3>
          <p className="text-yellow-700 text-sm mb-3">
            使用本应用需要配置以下API密钥：
          </p>
          <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
            <li><strong>OPENAI_API_KEY:</strong> 用于DALL-E 3图像生成</li>
            <li><strong>REPLICATE_API_TOKEN:</strong> 用于视频生成模型</li>
          </ul>
          <p className="text-yellow-700 text-sm mt-3">
            请在 <code className="bg-yellow-200 px-1 rounded">.env.local</code> 文件中配置这些密钥。
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 text-sm">
            基于 <a href="https://github.com/vercel/ai" className="text-blue-600 hover:underline">Vercel AI SDK</a> 构建
          </p>
        </div>
      </footer>
    </div>
  );
}
