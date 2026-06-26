# 这里 —— 中年人的职业困境梳理空间

不给你职业建议，而是帮你理清"这团乱麻里到底压着几件事"。

## 体验方式

1. 打开网页后，点"我想说说"开始对话
2. 右上角 ⚙ 配置大模型 API（推荐 DeepSeek）
3. 随便说说你最近的职业困境，AI 会帮你拆解、追问、梳理

## 配置大模型（推荐 DeepSeek）

点右上角 ⚙ 齿轮按钮，填入：

| 字段 | 填什么 |
|------|--------|
| API 地址 | `https://api.deepseek.com/v1/chat/completions`（点"DeepSeek V3 聊天"自动填） |
| API Key | 你的 DeepSeek API Key |
| 模型 | `deepseek-chat`（自动填好） |
| 温度 | 0.7（默认即可） |

DeepSeek API Key 获取：https://platform.deepseek.com/ → 注册 → 创建 API Key

> 为什么推荐 DeepSeek？中文表达自然、支持浏览器跨域调用、价格便宜。
> OpenAI 的 API 默认不允许浏览器直接调用（CORS），可能会报错。

## 产品简介

- **目标用户**：30-50 岁、正在经历职业转折（转型/瓶颈/失业/被裁）、感到"说不清自己到底怎么了"的中年人
- **核心机制**：镜子模式——不给建议，通过多轮追问帮你理清职业困境的真实结构
- **四条红线**：不熬鸡汤、不假装共鸣、不评判、不急着给职业建议
- **右侧梳理**：对话同时，侧栏实时生成"你卡在哪 / 你真正在纠结什么 / 可以想的方向"

## 技术栈

- React 18 + Vite 5
- 纯前端，API Key 存在用户浏览器 localStorage
- 兼容任何 OpenAI chat completions 格式的 API

## 本地开发

```bash
npm install
npm run dev
```

## 部署

Vercel 一键部署，Vite 项目自动识别。
