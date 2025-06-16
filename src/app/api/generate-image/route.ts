import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, style = 'realistic', size = '1024x1024' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: '请提供图像生成提示词' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: '请配置OPENAI_API_KEY环境变量' },
        { status: 500 }
      );
    }

    // 优化提示词
    const optimizedPrompt = `${prompt}, ${style} style, high quality, detailed`;

    // 使用OpenAI DALL-E 3生成图像
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: optimizedPrompt,
        n: 1,
        size: size,
        quality: 'standard',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: `图像生成失败: ${error.error?.message || '未知错误'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: '生成图像失败，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: optimizedPrompt,
      metadata: {
        size: size,
        style: style,
        model: 'dall-e-3',
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error: unknown) {
    console.error('图像生成错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: `服务器错误: ${errorMessage}` },
      { status: 500 }
    );
  }
}