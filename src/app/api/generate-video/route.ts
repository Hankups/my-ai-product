import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, duration = 3, fps = 24 } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: '请提供视频生成提示词' },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: '请配置REPLICATE_API_TOKEN环境变量' },
        { status: 500 }
      );
    }

    // 优化提示词
    const optimizedPrompt = `${prompt}, high quality video, smooth motion, detailed`;

    // 使用Replicate API生成视频 (Runway ML Stable Video Diffusion)
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "cfa36b8c25b70c9ce84ad8fb45b2a8cd47c13c36fefa46976caa6d67dcf6eb89",
        input: {
          prompt: optimizedPrompt,
          max_frames: duration * fps,
          num_inference_steps: 20,
          guidance_scale: 7.5,
          fps: fps,
          motion_bucket_id: 127,
          noise_aug_strength: 0.1,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: `视频生成失败: ${error.error?.message || error.detail || '未知错误'}` },
        { status: response.status }
      );
    }

    const prediction = await response.json();

    return NextResponse.json({
      success: true,
      predictionId: prediction.id,
      status: prediction.status,
      prompt: optimizedPrompt,
      metadata: {
        duration: duration,
        fps: fps,
        model: 'stable-video-diffusion',
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error: unknown) {
    console.error('视频生成错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: `服务器错误: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// 检查视频生成状态的GET端点
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const predictionId = searchParams.get('id');

    if (!predictionId) {
      return NextResponse.json(
        { error: '请提供预测ID' },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: '请配置REPLICATE_API_TOKEN环境变量' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: '获取视频状态失败' },
        { status: response.status }
      );
    }

    const prediction = await response.json();

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
      logs: prediction.logs,
    });

  } catch (error: unknown) {
    console.error('获取视频状态错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: `服务器错误: ${errorMessage}` },
      { status: 500 }
    );
  }
}