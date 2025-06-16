'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GeneratedImage {
  imageUrl: string;
  prompt: string;
  metadata: {
    size: string;
    style: string;
    model: string;
    timestamp: string;
  };
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入图像描述');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          size,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      setGeneratedImage(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '生成过程中出现错误';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI 文生图</h2>
      
      {/* 输入区域 */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            图像描述 *
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要生成的图像，例如：一只可爱的橙色小猫坐在花园里"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
              风格
            </label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isGenerating}
            >
              <option value="realistic">写实风格</option>
              <option value="artistic">艺术风格</option>
              <option value="cartoon">卡通风格</option>
              <option value="abstract">抽象风格</option>
            </select>
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              尺寸
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isGenerating}
            >
              <option value="1024x1024">正方形 (1024x1024)</option>
              <option value="1792x1024">横向 (1792x1024)</option>
              <option value="1024x1792">纵向 (1024x1792)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              生成中...
            </div>
          ) : (
            '生成图像'
          )}
        </button>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* 结果显示 */}
      {generatedImage && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">生成结果</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative">
              <Image
                src={generatedImage.imageUrl}
                alt={generatedImage.prompt}
                width={1024}
                height={1024}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                <strong>提示词:</strong> {generatedImage.prompt}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                <span><strong>尺寸:</strong> {generatedImage.metadata.size}</span>
                <span><strong>风格:</strong> {generatedImage.metadata.style}</span>
                <span><strong>模型:</strong> {generatedImage.metadata.model}</span>
                <span><strong>时间:</strong> {new Date(generatedImage.metadata.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}