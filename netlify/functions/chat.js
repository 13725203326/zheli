// Netlify Function: 大模型 API 代理
// 评委浏览器 → /api/chat → DeepSeek API
// API Key 存在 Netlify 环境变量里，不暴露给前端

const DEFAULT_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'
const DEFAULT_MODEL = 'deepseek-chat'

// 兼容 Netlify v1 (handler) 和 v2 (default export) 两种格式
const handler = async (event) => {
  // 只允许 POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { messages, temperature } = body

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'messages 字段必填' })
      }
    }

    // API Key 从环境变量读取
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '服务器未配置 DEEPSEEK_API_KEY 环境变量' })
      }
    }

    const endpoint = process.env.LLM_ENDPOINT || DEFAULT_ENDPOINT
    const model = process.env.LLM_MODEL || DEFAULT_MODEL

    // 使用 Node 18+ 内置 fetch（Netlify 默认 Node 18）
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: typeof temperature === 'number' ? temperature : 0.7
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'LLM 调用失败: ' + errText })
      }
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '服务器错误: ' + (err.message || String(err)) })
    }
  }
}

export { handler as default }
