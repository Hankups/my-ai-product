# 🎨 AI 创作工坊

基于 [Vercel AI SDK](https://github.com/vercel/ai) 构建的现代化AI内容生成平台，支持文生图和文生视频功能。

## ✨ 功能特点

- 🖼️ **AI文生图**: 基于OpenAI DALL-E 3，支持多种风格和尺寸
- 🎬 **AI文生视频**: 基于Replicate API，支持Stable Video Diffusion
- 🎨 **多种风格**: 写实、艺术、卡通、抽象等风格选择
- 📱 **响应式设计**: 完美支持桌面端和移动端
- ⚡ **实时进度**: 实时显示生成进度和状态
- 🚀 **快速部署**: 一键部署到Vercel

## 🛠️ 技术栈

- **前端框架**: Next.js 15 + React 19
- **AI SDK**: Vercel AI SDK
- **样式**: Tailwind CSS
- **类型安全**: TypeScript
- **部署**: Vercel

## 📦 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.env.local` 文件并添加以下API密钥：

```env
# OpenAI API（用于DALL-E 3图像生成）
OPENAI_API_KEY=sk-xxx

# Replicate API（用于视频生成）
REPLICATE_API_TOKEN=r8_xxx

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🔑 API密钥获取

### OpenAI API Key
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 登录并创建新的API密钥
3. 确保账户有足够的信用额度

### Replicate API Token
1. 访问 [Replicate](https://replicate.com/account/api-tokens)
2. 登录并创建新的API令牌
3. 复制令牌到环境变量中

## 💡 使用指南

### 文生图功能
1. 选择"📸 文生图"标签
2. 输入图像描述
3. 选择风格和尺寸
4. 点击"生成图像"按钮

### 文生视频功能
1. 选择"🎬 文生视频"标签
2. 输入视频描述
3. 选择时长和帧率
4. 点击"生成视频"按钮

## 🚀 部署到Vercel

```bash
npm run build
```

或使用 Vercel CLI：
```bash
vercel --prod
```

## 💰 成本估算

- **OpenAI DALL-E 3**: $0.040/图像 (1024×1024)
- **Replicate视频**: 约$0.01-0.05/秒

## 📄 许可证

MIT License
