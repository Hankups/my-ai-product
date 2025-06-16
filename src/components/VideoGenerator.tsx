'use client';

import { useState, useEffect } from 'react';

interface GeneratedVideo {
  predictionId: string;
  status: string;
  prompt: string;
  metadata: {
    duration: number;
    fps: number;
    model: string;
    timestamp: string;
  };
}

interface VideoStatus {
  id: string;
  status: string;
  output?: string[];
  error?: string;
  logs?: string;
}

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(3);
  const [fps, setFps] = useState(24);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [videoStatus, setVideoStatus] = useState<VideoStatus | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入视频描述');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedVideo(null);
    setVideoStatus(null);
    setProgress('开始生成视频...');

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration,
          fps,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      setGeneratedVideo(data);
      setProgress('视频生成已启动，正在处理中...');
      
      // 开始轮询检查状态
      pollVideoStatus(data.predictionId);
    } catch (err: any) {
      setError(err.message || '生成过程中出现错误');
      setIsGenerating(false);
    }
  };

  const pollVideoStatus = async (predictionId: string) => {
    try {
      const response = await fetch(`/api/generate-video?id=${predictionId}`);
      const status = await response.json();
      
      setVideoStatus(status);

      if (status.status === 'succeeded') {
        setProgress('视频生成完成！');
        setIsGenerating(false);
      } else if (status.status === 'failed') {
        setError(status.error || '视频生成失败');
        setIsGenerating(false);
      } else if (status.status === 'processing') {
        setProgress('正在生成视频，请稍候...');
        // 继续轮询
        setTimeout(() => pollVideoStatus(predictionId), 3000);
      } else {
        setProgress('视频正在队列中等待处理...');
        // 继续轮询
        setTimeout(() => pollVideoStatus(predictionId), 5000);
      }
    } catch (err: any) {
      setError('检查视频状态时出错');
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI 文生视频</h2>
      
      {/* 输入区域 */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-700 mb-2">
            视频描述 *
          </label>
          <textarea
            id="video-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要生成的视频，例如：海浪轻柔地拍打着沙滩，夕阳西下"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            rows={3}
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              视频时长 (秒)
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isGenerating}
            >
              <option value={2}>2秒</option>
              <option value={3}>3秒</option>
              <option value={4}>4秒</option>
              <option value={5}>5秒</option>
            </select>
          </div>

          <div>
            <label htmlFor="fps" className="block text-sm font-medium text-gray-700 mb-2">
              帧率 (FPS)
            </label>
            <select
              id="fps"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isGenerating}
            >
              <option value={12}>12 FPS</option>
              <option value={24}>24 FPS</option>
              <option value={30}>30 FPS</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              生成中...
            </div>
          ) : (
            '生成视频'
          )}
        </button>
      </div>

      {/* 进度显示 */}
      {progress && isGenerating && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700 text-sm">{progress}</p>
          {videoStatus?.logs && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-blue-600">查看详细日志</summary>
              <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">{videoStatus.logs}</pre>
            </details>
          )}
        </div>
      )}

      {/* 错误显示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* 结果显示 */}
      {videoStatus?.output && videoStatus.status === 'succeeded' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">生成结果</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <video
              src={videoStatus.output[0]}
              controls
              className="w-full h-auto"
              poster=""
            >
              您的浏览器不支持视频播放。
            </video>
            {generatedVideo && (
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>提示词:</strong> {generatedVideo.prompt}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                  <span><strong>时长:</strong> {generatedVideo.metadata.duration}秒</span>
                  <span><strong>帧率:</strong> {generatedVideo.metadata.fps} FPS</span>
                  <span><strong>模型:</strong> {generatedVideo.metadata.model}</span>
                  <span><strong>时间:</strong> {new Date(generatedVideo.metadata.timestamp).toLocaleString()}</span>
                </div>
                <div className="mt-2">
                  <a
                    href={videoStatus.output[0]}
                    download
                    className="text-purple-600 hover:text-purple-800 text-sm underline"
                  >
                    下载视频
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}