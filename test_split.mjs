// 临时测试文件：验证拆解逻辑
const msg = '我真的很怀念在学校的日子，很多资源你都是免费甚至是低价获取的，现在出了学校报个课，至少得是10倍的价格，你年纪越来越大，受到的重视和关注度越来越少。到老年可能就会变成边缘地带，大概只有你的父母会重视你，真的很不甘心，好像很少产品是给中年人做的吧，基本上百分之八十到九十的资源给了青年人和学生。我终于理解为啥中年男士喜欢下班坐在车里了，其实是没有托底的支点了'

const THEME_PATTERNS = [
  { match: (p) => p.includes('托底') || p.includes('支点') || p.includes('兜底') || p.includes('退路'),
    name: '没有托底', summary: '你发现自己身后没有兜底的人', priority: 1 },
  { match: (p) => (p.includes('老年') || p.includes('老了') || p.includes('以后') || p.includes('将来')) && (p.includes('会') || p.includes('变成') || p.includes('可能')),
    name: '对未来的恐惧', summary: '你害怕再过几年会更糟', priority: 1 },
  { match: (p) => (p.includes('重视') || p.includes('关注')) && (p.includes('少') || p.includes('没') || p.includes('越来越')),
    name: '被市场忽略', summary: '你感觉到自己不再是世界关注的中心', priority: 1 },
  { match: (p) => p.includes('边缘') || p.includes('被忽视') || p.includes('被忽略'),
    name: '被推向边缘', summary: '你觉得自己正在被推向边缘', priority: 1 },
  { match: (p) => (p.includes('产品') || p.includes('资源')) && (p.includes('中年') || p.includes('青年') || p.includes('学生') || p.includes('年轻')),
    name: '被市场忽略', summary: '好像所有东西都不是为你做的', priority: 1 },
  { match: (p) => p.includes('不甘') || p.includes('不甘心'),
    name: '心里的不甘', summary: '你心里有一股不甘', priority: 2 },
  { match: (p) => p.includes('怀念') || p.includes('想念') || p.includes('以前') || p.includes('曾经') || p.includes('学校') || p.includes('学生时代') || p.includes('那时候'),
    name: '怀念过去', summary: '你心里有一块留在过去', priority: 4 },
  { match: (p) => p.includes('中年') || p.includes('年纪') || p.includes('岁数'),
    name: '年龄带来的变化', summary: '你感觉到年龄带来的变化', priority: 5 },
]

const splitIntoShortPhrases = (message) => {
  const result = []
  const punct = ['，', '。', '！', '？', '；', '：', ',', '.', '!', '?', ';', '\n']
  let current = ''
  for (let i = 0; i < message.length; i++) {
    const ch = message[i]
    current += ch
    if (punct.includes(ch)) {
      const trimmed = current.trim().replace(/[，。！？、!?;:,.\\s]+$/, '')
      if (trimmed.length >= 3) {
        if (trimmed.length > 15) {
          const subParts = trimmed.split(/[，,、]/).map(s => s.trim()).filter(s => s.length >= 3)
          subParts.forEach(sp => {
            if (sp.length <= 15) result.push(sp)
            else result.push(sp.substring(0, 15))
          })
        } else {
          result.push(trimmed)
        }
      }
      current = ''
    }
  }
  const last = current.trim().replace(/[，。！？、!?;:,.\\s]+$/, '')
  if (last.length >= 3) {
    if (last.length > 15) {
      const subParts = last.split(/[，,、]/).map(s => s.trim()).filter(s => s.length >= 3)
      subParts.forEach(sp => result.push(sp.length <= 15 ? sp : sp.substring(0, 15)))
    } else {
      result.push(last)
    }
  }
  return result.filter(p => p.length >= 3 && p.length <= 15)
}

const identifyTheme = (phrase) => {
  for (const pattern of THEME_PATTERNS) {
    if (pattern.match(phrase)) {
      return { name: pattern.name, summary: pattern.summary, quote: phrase, priority: pattern.priority }
    }
  }
  return null
}

const phrases = splitIntoShortPhrases(msg)
console.log('=== 切出的短句 ===')
phrases.forEach((p, i) => console.log(`${i}: [${p.length}字] ${p}`))

console.log('\n=== 主题识别 ===')
const themeMap = new Map()
const seenQuotes = new Set()
for (const phrase of phrases) {
  const identified = identifyTheme(phrase)
  if (!identified) continue
  if (seenQuotes.has(identified.quote)) continue
  seenQuotes.add(identified.quote)
  if (!themeMap.has(identified.name)) {
    themeMap.set(identified.name, identified)
    console.log(`  "${phrase}" -> ${identified.name} (priority ${identified.priority})`)
  } else {
    console.log(`  "${phrase}" -> ${identified.name} (已存在，跳过)`)
  }
}

console.log('\n=== 最终拆解（按priority排序，取前3） ===')
const layers = Array.from(themeMap.values()).sort((a, b) => a.priority - b.priority).slice(0, 3)
layers.forEach((layer, idx) => {
  console.log(`第${idx + 1}层(${layer.name})：${layer.summary}`)
  console.log(`  → "${layer.quote}"`)
})

console.log('\n=== 完整AI回复 ===')
let part1 = '你这段话里，其实压着几层东西：\n\n'
layers.forEach((layer, idx) => {
  part1 += `第${idx + 1}层(${layer.name})：${layer.summary}\n`
  part1 += `  → "${layer.quote}"\n\n`
})
let part2 = '我刚才拆出了几个方向：'
layers.forEach((layer, idx) => {
  part2 += `第${idx + 1}层${layer.name}`
  if (idx < layers.length - 1) part2 += '、'
})
part2 += '。\n你最想先聊聊哪一个？（或者你觉得还有我没看到的？）'
console.log(part1 + part2)
