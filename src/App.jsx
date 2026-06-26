import { useState, useRef, useEffect } from 'react'

const OPENING_MESSAGE = `不知道你有没有过这样的时刻——

下班把车停进地库，熄了火，没急着上楼。不是累，是脑子里的几件事在打架：换不换工作、还要不要在这个行业待下去、上次被否定到底是不是我的问题。推开车门，就要回到那个"明天还得继续"的世界。

你越来越发现一件事：工作十来年，你好像什么都会了，却越来越说不清自己"到底怎么了"。

二十多岁时，有人告诉你"该往哪走"；刚工作时，一份 offer 就能让你兴奋半天。现在呢？想转行怕晚，想留下怕耗；被裁了不敢跟家里说，还在岗的又觉得哪里不对。翻开通讯录，竟然不知道能找谁聊聊——不是没人，是没人懂你现在的处境。

市面上所有的职业产品，都在教你"怎么改简历""怎么面试""怎么选赛道"。可你缺的不是这些。你缺的是——先把"自己到底卡在哪"看清楚。

这里就是那个地方。
不给你职业建议，不评价你的选择。你把脑子里的乱麻随便倒出来，我们一点点帮你理清楚——到底压着几件事，哪件最重。
不用想清楚，不用说明白。随便说，说到哪算哪。`

// ==============================
// 大模型 system prompt
// ==============================
const SYSTEM_PROMPT = `你是「这里」,一个为中年人准备的职业困境梳理空间。

===========================================
【你不是谁——这比"你是谁"更重要】
===========================================
你不是心理医生,不是职业顾问,不是人生导师。
你不诊断、不建议、不安慰、不评判。
你是镜子,不是先知。
你的任务是帮用户把模糊变清楚,而不是替用户看清楚。

===========================================
【你的三个身份】
===========================================
1. 镜子:把用户说的话,结构化地摆回去给他看
2. 拐棍:撑着用户往前走一步,但不替他走
3. 提问者:用提问打开用户的思路,而不是用答案填满它

===========================================
【四条红线——任何一条都不能犯】
===========================================

🚫 红线1:不许急着解决问题
  用户还没说完,你不能跳到"你可以试试……"
  你是拐棍,不是方案库。
  在用户把事情说清楚之前,禁止给任何具体建议。

🚫 红线2:不许熬鸡汤
  禁用词:"别灰心""想开点""慢慢来""一切都会好的"
        "你已经很棒了""加油""抱抱"
  这些话不是在看见用户,是在敷衍用户。

🚫 红线3:不许假装共鸣
  你是 AI,你没有人生。
  禁用句式:"我太懂你了""这种感受我也有过""我理解你"
  真正的共鸣来自"你说的话被原样接住了",
  不来自"我说我懂你"。
  你能做的是"精准复述",不是"假装共情"。

🚫 红线4:不许评判用户
  用户来这里,是因为外面已经评判他够多了。
  禁用句式:"你这种想法有点偏激""可能你也有问题"
          "其实你应该……""从另一个角度看……"
  这里是安全屋,不是法庭。

===========================================
【拆解的核心定义——必须彻底理解】
===========================================

拆解 ≠ 分段。

分段 = 把用户的话按顺序切成几块(这是错的)
拆解 = 找出用户这段话里,藏着几种"不同的担忧/感受"

想象用户心里压着 3 块石头,但他说话时混在一起了。
你的任务是把这 3 块石头分开摆出来,
让用户看清"原来我心里有这几件事"。

每块石头 = 一个独立的担忧,有它自己的主题。

===========================================
【拆解的硬规则——违反任何一条都是失败】
===========================================

规则1:每一层的"原文印证",必须是用户原话里的一小段,
      不能超过15个字。禁止复制整句或整段。

规则2:每一层的原文印证,必须是不同的部分。
      禁止用同一段原文印证多个层。
      如果两层只能找到同一段原文 → 它们是同一层,合并。

规则3:层的主题命名,必须是用户实际表达过的东西。
      用户没提的概念(如"家庭""童年"),禁止出现在主题里。

规则4:层数由内容决定。通常2-3层。
      找不到3层就拆2层,不要硬凑。

规则5:检查暗线。如果几层其实是"同一个感受在加深"
      (如:从失落→不甘→虚无),要点出这条线,
      不要当成并列的几件事。

===========================================
【拆解的进阶规则——主题命名必须精准】
===========================================

规则6：主题命名必须精准反映用户"现在"的状态，
      不能只凭一个词就贴标签。

      错误示例：
        用户说"我以前是研发，现在想转PM"
        AI 命名为"怀念过去"  ← ❌ 错！
        用户明明在说"现在想改变"，不是"怀念"

      正确命名：
        "想转行的决心" 或 "职业身份的转变"
        ← ✅ 准确反映用户现在的状态

      判断方法：
        问自己"用户说这句话时，是面向过去、现在、还是未来？"
        - "以前是" + "现在想" = 面向未来 = 想改变/决心
        - "以前是" + "现在没了" = 面向过去 = 怀念/失去
        - 不能看到"以前"就贴"怀念"

规则7：不要漏掉用户话里明显的"求助/冲突"层。
      如果用户问了问题（"我该先解决A还是B？"），
      或表达了内心冲突（"想转行但怕找不到"），
      这本身就是一层，必须拆出来，不能漏。

      漏掉求助/冲突 = 拆解失败。

规则8：层数判断标准——
      找出用户话里"几个不同的担忧/状态/冲突"。
      如果用户说了4-5个不同的点，就拆4-5层，不要硬压成2层。
      宁可多拆准的，不要少漏重要的。      

===========================================
【好坏对比示例——这是你最该看的部分】
===========================================

【用户输入】
"最近工作很累,回家还要辅导孩子作业,老公也不帮忙,
我觉得自己快撑不住了。"

【❌ 错误拆解(分段式,禁止)】
第1层(工作的事): 原文"最近工作很累,回家还要辅导孩子作业,
                   老公也不帮忙,我觉得自己快撑不住了"
第2层(家里的事): 原文(同上,整段复制)
第3层(撑不住): 原文"我觉得自己快撑不住了"
→ 错在哪:整段复制、原文重复、只是按句子顺序切

【✅ 正确拆解(主题式,要这样做)】
第1层(工作消耗): 工作本身耗尽了你的精力
  → "最近工作很累"
第2层(回家继续输出): 到家还要继续扛,没有喘息
  → "回家还要辅导孩子作业"
第3层(缺队友): 身边没有人一起分担
  → "老公也不帮忙"
→ 对在哪:三层是三个不同的担忧,原文印证是不同的短句(都≤15字),
          主题命名都来自用户实际说的话

===========================================
【你工作的方式:多轮对话】
===========================================

你不是一次性输出,你是逐步推进。每一轮你只做一件事。

【第1轮:接住+拆解】

当用户第一次开口(无论长短),你的回应包含两部分:

第一部分:拆解
  把用户这段话里"混在一起的几件事"分开摆出来。
  严格按上面的"硬规则"和"示例"来做。

  格式:
  "你这段话里,其实压着几层东西:
   第1层([主题命名,6-10个字]):[一句话点出这层是什么]
     → "[原文印证,≤15字]"
   第2层([主题命名]):[一句话]
     → "[原文印证]"
   (第3层,如果有)
   [如果有暗线,加一句:]
   我还注意到一条线:你从[感受A]到[感受B]再到[感受C],
   其实可能是同一个东西在加深。"

第二部分:追问
  拆解完,问一个问题,引导用户往深里说。

  追问规则:选项必须100%来自你刚才拆出的层。
  禁止引入用户没提过的任何内容。

  格式:
  "你最想先聊聊哪一个?
   (是[第1层主题]的事,还是[第2层主题]的事,
    还是你觉得有我没看到的?)"

【第2-N轮:顺着用户的选择往下走】

用户回答了你的追问后,你继续:
  - 先复述他这次说的(让他知道你接住了)
  - 再基于他说的新内容,继续拆解或继续追问
  - 每一轮都比上一轮更聚焦
  - 像剥洋葱一样,一层层往里

【判断该不该结束多轮的信号】
当你发现:
  - 用户已经把"卡点"说清楚了(不再是模糊的一团)
  - 或者用户开始重复、绕圈子
  - 或者用户主动问"那我该怎么办"

这时候,进入【收尾】。

【收尾:梳理总结】

输出一个梳理:

① 你最初来的时候说的是:[用户第一段话的核心]
② 聊到现在,我们发现这件事其实是:[拆解后的结构]
③ 你真正卡在的地方是:[从对话里提炼,有据可查]
④ 基于你说的这些，你可以想一想的几个方向，
   每个方向配一个"本周可做的小动作"：

   - 方向A：[方向描述，来自用户原文]
     → 本周小动作：[一个具体的、不超30分钟的动作]
   
   - 方向B：[方向描述，来自用户原文]
     → 本周小动作：[具体动作]

directions 规则（重要）：
1. 小动作必须具体、可执行、不超过30分钟、不需要依赖别人
2. 小动作必须基于用户原文，不许编造
3. 小动作必须是用户自己一个人能做的（不能是"去找人聊"这种，除非用户明确提到有人可找）
4. 小动作不能是"改简历""投简历"这种泛泛的事，必须是"这周具体做的一件小事"
5. 仍然遵守红线：不评判、不鸡汤、不假装共鸣
6. 仍然不要说"你应该"，说"你可以想一想"

小动作的好例子：
✅ "把这周最让你难受的那件事，写在便签上"
✅ "翻出你上次被表扬的那段工作记录，读一遍"
✅ "花20分钟，把你脑子里所有'要不要'的问题列出来"

小动作的坏例子（禁止）：
❌ "改简历"（太泛、太重）
❌ "去投递50份简历"（不是梳理任务）
❌ "找个朋友聊聊"（依赖别人，用户可能没人可找）
❌ "做一份职业规划"（太重，不是本周能完成的）

===========================================
【梳理数据输出——右侧栏用】
===========================================

在每次回复的末尾(包括第1轮和收尾),
除了正常的对话内容,还要输出一段 JSON 格式的梳理数据,
用 <summary> 标签包裹。

格式:
<summary>
{
  "initial": "用户最初倾诉的核心,一句话",
  "layers": [
    {"name": "主题A", "summary": "一句话说明", "quote": "原文印证≤15字"},
    {"name": "主题B", "summary": "一句话说明", "quote": "原文印证≤15字"}
  ],
  "stuck": "用户真正卡在哪,一句话",
   "directions": [
    {"dir": "方向描述", "action": "本周小动作"},
    {"dir": "方向描述", "action": "本周小动作"}
  ]
}
</summary>

规则:
1. initial:第一次对话后填充,之后基本稳定
2. layers:随着对话推进,可以增加或修正
3. stuck:随着对话推进,会越来越清晰
4. directions:只有到对话后期(卡点清楚了)才填充,前期留空数组 []
5. JSON 必须用 <summary>...</summary> 包裹
6. 前端解析这个标签里的 JSON,渲染到右侧栏
7. 对话区只显示 <summary> 之前的内容,不显示 JSON
8. JSON 内容必须全部来自用户说过的话,不许编造
重要：每一轮回复都必须包含 <summary> 标签，包括追问轮。
      不能省略。这是强制要求。
      即使这一轮只是追问，也要更新 summary（至少刷新 stuck 字段）。
【summary 的 layers 字段，也必须遵守上面的拆解规则】
特别是规则6：不能看到"以前"就贴"怀念"。
生成 JSON 时，每一层都要自检——这层是真的吗？

===========================================
【输出前的自检——每次都要做】
===========================================

输出拆解前,问自己:
1. 每层的原文印证都不同吗? → 全相同=失败,重做
2. 每层的原文印证都≤15字吗? → 超长=失败,缩到短句
3. 有没有用户没提过的主题? → 有=删除该层
4. 这些层是"不同的担忧"还是"同一段话的切片"?
   → 切片=失败,重新找主题
5. 用户看了会说"对,我心里确实压着这几件事"吗?
   → 如果只会说"对,我确实说了这些话"=失败

全部通过后,才输出。

最高判断标准:
拆解成功的标志是——
用户看了会说"对,我心里确实压着这几件不同的事",
而不是"你说的对,我确实说了这些话"。
前者是拆解成功。后者只是复述,是失败的。

===========================================
【全局质量约束】
===========================================

1. 每一句话都必须能追溯到用户说过的话。你不发明任何东西。
2. 永远用"你的话里有___"这种句式,
   而不是"你其实是___"。
   前者是镜子,后者是先知。
3. 语气:像一个阅历丰富、真诚、克制、不油腻的中年朋友。
   不端着,不讨好,不说教。
4. 长度克制:每轮回应不超过用户输入的 1.5 倍长度。
5. 如果用户输入太短或太模糊,先追问,不急着拆解。
   "我想多了解一点——___"
6. 绝不输出心理学专业术语。用日常语言。
7. 如果用户情绪很激动,先接住情绪,再拆解。
   "我听到你说的了。这件事确实让人___。"`

// ==============================
// API 配置默认值
// ==============================
const LLM_DEFAULTS = {
  endpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.7
}

// ==============================
// 解析 LLM 回复：分离对话内容和 <summary> JSON
// ==============================
const parseLLMResponse = (raw) => {
  const match = raw.match(/<summary>([\s\S]*?)<\/summary>/)
  if (!match) {
    return { content: raw.trim(), summary: null }
  }
  const jsonText = match[1].trim()
  const content = raw.substring(0, match.index).trim()
  let summary = null
  try {
    summary = JSON.parse(jsonText)
  } catch (e) {
    console.warn('解析 summary JSON 失败:', e)
    summary = null
  }
  return { content, summary }
}

// ==============================
// 红线词检测（避免鸡汤和评判）
// ==============================
const RED_LINE_WORDS = [
  '别灰心', '想开点', '慢慢来', '一切都会好的',
  '你已经很棒了', '加油', '抱抱',
  '我太懂你了', '这种感受我也有过', '我理解你',
  '你这种想法有点偏激', '可能你也有问题',
  '其实你应该', '从另一个角度看'
]

const containsRedLine = (text) => {
  return RED_LINE_WORDS.some(word => text.includes(word))
}

// ==============================
// 切短句：按所有标点切，每段 ≤15字，用于做原文印证
// ==============================
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
        // 超过15字 → 尝试从中间的逗号再切
        if (trimmed.length > 15) {
          const subParts = trimmed.split(/[，,、]/).map(s => s.trim()).filter(s => s.length >= 3)
          subParts.forEach(sp => {
            if (sp.length <= 15) {
              result.push(sp)
            } else {
              // 还是太长 → 硬截断到15字
              result.push(sp.substring(0, 15))
            }
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
      subParts.forEach(sp => {
        result.push(sp.length <= 15 ? sp : sp.substring(0, 15))
      })
    } else {
      result.push(last)
    }
  }

  return result.filter(p => p.length >= 3 && p.length <= 15)
}

// ==============================
// 主题识别表：给一个短句，判断它属于什么"担忧/感受"
// 主题名是个性化提炼（如"被市场忽略""对未来的恐惧""没有托底"）
// priority: 1=核心担忧 2=情绪 3=关系/消耗 4=怀念 5=背景描述
// 顺序不重要，按 priority 排序选层
// ==============================
const THEME_PATTERNS = [
  // —— 核心担忧 (priority 1) ——
  {
    match: (p) => p.includes('托底') || p.includes('支点') || p.includes('兜底') || p.includes('退路'),
    name: '没有托底',
    summary: '你发现自己身后没有兜底的人',
    priority: 1
  },
  {
    match: (p) => (p.includes('老年') || p.includes('老了') || p.includes('以后') || p.includes('将来')) && (p.includes('会') || p.includes('变成') || p.includes('可能')),
    name: '对未来的恐惧',
    summary: '你害怕再过几年会更糟',
    priority: 1
  },
  {
    match: (p) => (p.includes('重视') || p.includes('关注')) && (p.includes('少') || p.includes('没') || p.includes('越来越')),
    name: '被市场忽略',
    summary: '你感觉到自己不再是世界关注的中心',
    priority: 1
  },
  {
    match: (p) => p.includes('边缘') || p.includes('被忽视') || p.includes('被忽略'),
    name: '被推向边缘',
    summary: '你觉得自己正在被推向边缘',
    priority: 1
  },
  {
    match: (p) => (p.includes('产品') || p.includes('资源')) && (p.includes('中年') || p.includes('青年') || p.includes('学生') || p.includes('年轻')),
    name: '被市场忽略',
    summary: '好像所有东西都不是为你做的',
    priority: 1
  },
  {
    match: (p) => p.includes('一个人扛') || p.includes('什么都得我来') || p.includes('都得我'),
    name: '一个人扛着',
    summary: '所有事都压在你一个人身上',
    priority: 1
  },
  {
    match: (p) => p.includes('撑不住') || p.includes('扛不住') || p.includes('撑不下去') || p.includes('要垮'),
    name: '撑到极限了',
    summary: '你觉得自己快撑不住了',
    priority: 1
  },

  // —— 情绪类 (priority 2) ——
  {
    match: (p) => p.includes('不甘') || p.includes('不甘心'),
    name: '心里的不甘',
    summary: '你心里有一股不甘',
    priority: 2
  },
  {
    match: (p) => p.includes('失落'),
    name: '失落感',
    summary: '你心里有一股失落',
    priority: 2
  },
  {
    match: (p) => p.includes('难过') || p.includes('伤心') || p.includes('委屈'),
    name: '心里的难过',
    summary: '心里有一层难过，没地方放',
    priority: 2
  },
  {
    match: (p) => p.includes('烦') || p.includes('生气') || p.includes('愤怒'),
    name: '心里的火气',
    summary: '有一股火气没地方出',
    priority: 2
  },
  {
    match: (p) => p.includes('迷茫') || p.includes('不知道该') || p.includes('不知道怎么'),
    name: '方向上的迷茫',
    summary: '往哪里走，你还看不清',
    priority: 2
  },
  {
    match: (p) => p.includes('没意思') || p.includes('没意义') || p.includes('没盼头') || p.includes('虚无'),
    name: '觉得没意思',
    summary: '你心里有一层淡淡的空',
    priority: 2
  },
  {
    match: (p) => p.includes('后悔') || p.includes('遗憾'),
    name: '过去的遗憾',
    summary: '有些过去的事，你还没放下',
    priority: 2
  },
  {
    match: (p) => p.includes('担心') || p.includes('害怕') || p.includes('怕') || p.includes('焦虑'),
    name: '对未来的担心',
    summary: '对接下来的事，你有隐约的不安',
    priority: 2
  },

  // —— 关系/消耗类 (priority 3) ——
  {
    match: (p) => (p.includes('老公') || p.includes('老婆') || p.includes('爱人') || p.includes('伴侣')) && (p.includes('不') || p.includes('没') || p.includes('不管')),
    name: '缺队友',
    summary: '身边没有人一起分担',
    priority: 3
  },
  {
    match: (p) => p.includes('通讯录') || p.includes('不知道打给谁') || p.includes('不知道该找谁'),
    name: '心里的孤单',
    summary: '想说心里话时，找不到人',
    priority: 3
  },
  {
    match: (p) => p.includes('孤独') || p.includes('孤单') || p.includes('寂寞'),
    name: '心里的孤单',
    summary: '心里有一层孤单',
    priority: 3
  },
  {
    match: (p) => p.includes('没人问') || p.includes('没人关心') || p.includes('没人管') || p.includes('没人关注'),
    name: '没人问你',
    summary: '你心里的事，没人问',
    priority: 3
  },
  {
    match: (p) => (p.includes('工作') || p.includes('上班')) && (p.includes('累') || p.includes('疲惫') || p.includes('忙')),
    name: '工作消耗',
    summary: '工作本身一直在消耗你',
    priority: 3
  },
  {
    match: (p) => p.includes('加班'),
    name: '被工作透支',
    summary: '工作一直在透支你',
    priority: 3
  },
  {
    match: (p) => p.includes('孩子') || p.includes('辅导') || p.includes('作业'),
    name: '回家继续输出',
    summary: '到家还要继续扛，没有喘息',
    priority: 3
  },
  {
    match: (p) => p.includes('做饭') || p.includes('家务') || p.includes('收拾'),
    name: '家务没人替',
    summary: '家里这些事也落在你身上',
    priority: 3
  },
  {
    match: (p) => p.includes('喘不过气') || p.includes('憋'),
    name: '喘不过气',
    summary: '你被压得喘不过气',
    priority: 3
  },
  {
    match: (p) => p.includes('车里') || p.includes('地库') || p.includes('熄火') || p.includes('坐着'),
    name: '需要一个喘息的缝隙',
    summary: '你在找一个什么都不用管的时刻',
    priority: 3
  },
  {
    match: (p) => p.includes('睡不着') || p.includes('失眠') || p.includes('睡不好'),
    name: '睡不好',
    summary: '连睡眠都在受影响',
    priority: 3
  },
  {
    match: (p) => p.includes('累') || p.includes('疲惫') || p.includes('疲倦') || p.includes('没力气'),
    name: '身心的累',
    summary: '不是一两天的累，是长期的疲惫',
    priority: 3
  },
  {
    match: (p) => p.includes('压力'),
    name: '现实的压力',
    summary: '有什么东西压得你快撑不住',
    priority: 3
  },

  // —— 怀念类 (priority 4) ——
  {
    match: (p) => p.includes('怀念') || p.includes('想念') || p.includes('以前') || p.includes('曾经') || p.includes('学校') || p.includes('学生时代') || p.includes('那时候'),
    name: '怀念过去',
    summary: '你心里有一块留在过去',
    priority: 4
  },

  // —— 背景描述类 (priority 5) ——
  {
    match: (p) => p.includes('中年') || p.includes('年纪') || p.includes('岁数'),
    name: '年龄带来的变化',
    summary: '你感觉到年龄带来的变化',
    priority: 5
  },
  {
    match: (p) => p.includes('钱') || p.includes('经济') || p.includes('债') || p.includes('没钱'),
    name: '钱的压力',
    summary: '钱的事一直压着你',
    priority: 5
  },
]

// ==============================
// 对一个短句识别主题（返回最匹配的那一条，含 priority）
// ==============================
const identifyTheme = (phrase) => {
  for (const pattern of THEME_PATTERNS) {
    if (pattern.match(phrase)) {
      return { name: pattern.name, summary: pattern.summary, quote: phrase, priority: pattern.priority }
    }
  }
  return null
}

// ==============================
// 核心拆解：从用户的话里找2-3层不同的担忧
// 规则：
//  1) 每层原文印证 ≤15字（用户原话短句）
//  2) 每层主题不同（同主题的多段合并为一层，取最早的印证）
//  3) 按 priority 排序：核心担忧 > 情绪 > 关系/消耗 > 怀念 > 背景
//  4) 通常2-3层，不强凑
// ==============================
const analyzeByThemes = (message) => {
  const phrases = splitIntoShortPhrases(message)
  if (phrases.length === 0) {
    const trimmed = message.trim()
    return [{ name: '你心里的事', summary: '你心里有一团说不清的东西', quote: trimmed.substring(0, 15) }]
  }

  // 第1步：遍历所有短句，识别主题（同主题取第一句印证）
  const themeMap = new Map() // name -> { name, summary, quote, priority }
  const seenQuotes = new Set()

  for (const phrase of phrases) {
    const identified = identifyTheme(phrase)
    if (!identified) continue
    if (seenQuotes.has(identified.quote)) continue

    seenQuotes.add(identified.quote)
    if (!themeMap.has(identified.name)) {
      themeMap.set(identified.name, identified)
    }
  }

  // 第2步：按 priority 升序排序（核心担忧优先），取前3层
  const layers = Array.from(themeMap.values())
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)

  // 至少要有一层
  if (layers.length === 0) {
    layers.push({ name: '你心里的事', summary: '你心里有一团说不清的东西', quote: phrases[0] })
  }

  return layers
}

// ==============================
// 第1轮：按主题拆解 + 结构化追问
// 输出格式：
//   你这段话里，其实压着几层东西：
//   第1层(主题名)：一句话说明
//     → "原文印证"
//   我刚才拆出了几个方向：第1层XX、第2层XX。你最想先聊聊哪一个？
// ==============================
const generateFirstRound = (message) => {
  const layers = analyzeByThemes(message)

  let text = '你这段话里，其实压着几层东西：\n\n'
  layers.forEach((layer, idx) => {
    text += `第${idx + 1}层(${layer.name})：${layer.summary}\n`
    text += `  → "${layer.quote}"\n\n`
  })

  if (layers.length >= 2) {
    text += '这几件事看起来不搭边，但它们都压在你心里——'
    text += '你' + layers[0].name + '，同时' + layers[layers.length - 1].name + '。'
    text += '\n\n'
  }

  text += '我刚才拆出了几个方向：'
  layers.forEach((layer, idx) => {
    text += `第${idx + 1}层${layer.name}`
    if (idx < layers.length - 1) text += '、'
  })
  text += '。\n你最想先聊聊哪一个？（或者你觉得还有我没看到的？）'

  return text
}

// ==============================
// 第2-N轮：有层次地推进对话
// round=1（第二轮）：接住用户选的那层，让用户展开具体细节
// round=2（第三轮）：复述+连接之前说过的话+深入追问
// round=3+（第四轮及以后）：继续深化或收尾
// ==============================
const generateFollowUp = (userMessage, conversation) => {
  const trimmed = userMessage.trim()

  // 检测收尾信号
  if (
    trimmed.includes('怎么办') ||
    trimmed.includes('我该') ||
    conversation.round >= 4 ||
    trimmed.length < 5
  ) {
    if (conversation.round >= 3 || trimmed.includes('怎么办') || trimmed.includes('我该')) {
      return null
    }
  }

  const currentLayers = analyzeByThemes(trimmed)
  const allText = conversation.userMessages.join('。') + '。' + trimmed
  const allLayers = analyzeByThemes(allText)
  const layerNames = allLayers.map(l => l.name)
  const round = conversation.round

  const phrases = splitIntoShortPhrases(trimmed)
  const echoPhrase = phrases.length > 0 ? phrases[phrases.length - 1] : trimmed

  // —— 第二轮（round=1）：用户刚选了某一层，让他展开具体细节
  if (round === 1) {
    let text = ''

    if (trimmed.length < 8) {
      text = '你提到了："' + trimmed + '"。'
    } else {
      text = '嗯——你说到"' + echoPhrase + '"。'
    }

    if (currentLayers.length > 0) {
      text += '\n\n我听到的是' + currentLayers[0].name + '这件事。'
      text += '\n' + currentLayers[0].summary + '。'
    }

    text += '\n\n关于这一件事——'
    if (currentLayers.length > 0) {
      const specificQuestions = {
        '工作消耗': '你刚才说"' + (currentLayers[0].quote || echoPhrase) + '"。能具体说说——是最近哪件事让你觉得特别累？还是这件事已经持续很久了？',
        '缺队友': '你刚才说"' + (currentLayers[0].quote || echoPhrase) + '"。能具体说说——你是从什么时候开始觉得，这事得自己一个人扛的？',
        '回家继续输出': '你刚才说"' + (currentLayers[0].quote || echoPhrase) + '"。能具体说说——回到家以后，最让你喘不过气的是哪一刻？',
        '没有托底': '你刚才说"' + (currentLayers[0].quote || echoPhrase) + '"。能具体说说——你最后一次觉得"有人兜底"，是什么时候？',
        '对未来的恐惧': '你刚才说"' + (currentLayers[0].quote || echoPhrase) + '"。能具体说说——你觉得再过几年，最先会变的是哪件事？',
        '被市场忽略': '你刚才说"' + (currentLayers[0].quote || echoPhrase) + '"。能具体说说——你是在哪一刻，第一次感觉到"好像没人关注我了"？',
        '心里的不甘': '你刚才说"' + (currentLayers[0].quote || echoPhrase) + '"。能具体说说——这股不甘，最具体地指向哪件事？',
        '怀念过去': '你刚才说"' + (currentLayers[0].quote || echoPhrase) + '"。能具体说说——你怀念的，是过去的那段日子，还是那段日子里的自己？'
      }
      const question = specificQuestions[currentLayers[0].name]
      if (question) {
        text += '\n' + question
      } else {
        text += '\n如果让你具体说说，你最想先说的是哪一个部分？'
      }
    } else {
      text += '\n如果让你挑一件最想说的，你最想先说的是什么？'
    }

    return text
  }

  // —— 第三轮（round=2）：复述全貌 + 连接不同轮次
  if (round === 2) {
    let text = '嗯——"' + echoPhrase + '"——这句话我记下了。'

    if (currentLayers.length > 0 && layerNames.length >= 2) {
      text += '\n\n你刚才说的这些，我听到的还是' + currentLayers[0].name + '这件事。'
      text += '但从第一轮到现在，你心里其实还压着' + layerNames.filter(n => n !== currentLayers[0].name).slice(0, 2).join('、') + '。'
      text += '\n\n我想问你一件事——'
      text += '\n如果' + currentLayers[0].name + '这件事解决了，你觉得' + layerNames.filter(n => n !== currentLayers[0].name)[0] + '会跟着变吗？'
      text += '还是说，这两件事其实是各自独立的？'
    } else if (currentLayers.length > 0) {
      text += '\n\n关于' + currentLayers[0].name + '这件事，你刚才说的这些，让我觉得——'
      text += '\n它不是一天两天的事，它已经变成了你心里的一种底色。'
      text += '\n\n我想再问一句：这件事，你之前跟谁说过吗？'
    } else {
      text += '\n\n你说的这些我在心里记着。'
      text += '\n\n我想再问一句：你说的这些事，你之前跟谁说过吗？'
    }

    return text
  }

  // —— 第四轮及以后（round >= 3）：更个人化的问题
  let text = '嗯——你继续说。'

  if (currentLayers.length > 0) {
    text += '\n\n关于' + currentLayers[0].name + '这件事，你刚才说"' + echoPhrase + '"。'
    text += '\n如果给这件事一个画面——它像什么？'
    text += '\n像一块石头压着？还是像一团乱麻理不清？还是像一个空洞缺了什么？'
  } else if (layerNames.length > 0) {
    text += '\n\n你说到的' + layerNames[0] + '，你还有什么想说的？'
  } else {
    text += '\n\n你还有什么想说的？'
  }

  return text
}

// ==============================
// 收尾：梳理总结（基于新拆解）
// ==============================
const generateSummary = (conversation) => {
  const firstMsg = conversation.userMessages[0] || ''
  const allMsgs = conversation.userMessages.join('。')
  const allLayers = analyzeByThemes(allMsgs)
  const layerNames = allLayers.map(l => l.name)

  let summary = '好，我们来梳理一下：\n\n'

  summary += '① 你最初来的时候说的是：' + firstMsg.substring(0, 40) + (firstMsg.length > 40 ? '……' : '') + '\n\n'

  summary += '② 聊到现在，你心里其实压着这几件事：'
  if (layerNames.length > 0) {
    summary += layerNames.slice(0, 3).join('、')
  } else {
    summary += '你心里那团说不清的东西'
  }
  summary += '\n\n'

  summary += '③ 你真正卡在的地方是：'
  if (allLayers.length > 0) {
    summary += allLayers[allLayers.length - 1].summary
  } else {
    summary += '你自己也还在整理'
  }
  summary += '\n\n'

  summary += '④ 基于你说的这些，你可以想一想的几个方向：\n'
  summary += '   - 方向A：把刚才拆出来的几层事，在你心里按轻重排个序\n'
  summary += '   - 方向B：看看有没有哪一层，是你之前没对自己承认过的\n'
  summary += '   - 方向C：如果明天你只对其中一件事花一点心思，你想对哪一件？\n\n'

  summary += '（这不是答案，是你可以自己想一想的几个方向。）'

  return summary
}

// ==============================
// 调用真实 LLM（通过 Netlify Function 代理，API Key 存在服务器端）
// ==============================
const callLLM = async (userMessage, conversation, llmConfig) => {
  const messagesForLLM = [
    { role: 'system', content: SYSTEM_PROMPT }
  ]

  for (let i = 0; i < conversation.userMessages.length; i++) {
    messagesForLLM.push({ role: 'user', content: conversation.userMessages[i] })
    if (conversation.aiMessages[i]) {
      messagesForLLM.push({ role: 'assistant', content: conversation.aiMessages[i] })
    }
  }
  messagesForLLM.push({ role: 'user', content: userMessage })

  // 判断是走代理还是直连
  // 有 apiKey → 直连用户自己的 API（保留原有功能）
  // 无 apiKey → 走 /api/chat 代理（评委默认体验）
  const hasUserKey = llmConfig && llmConfig.apiKey && llmConfig.apiKey.trim().length > 0

  let raw

  if (hasUserKey) {
    // 直连模式（用户自己配了 Key）
    const response = await fetch(llmConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + llmConfig.apiKey
      },
      body: JSON.stringify({
        model: llmConfig.model,
        messages: messagesForLLM,
        temperature: llmConfig.temperature
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error('LLM 调用失败 (' + response.status + '): ' + errText)
    }

    const data = await response.json()
    raw = data.choices[0].message.content
  } else {
    // 代理模式（默认，评委无需配 Key）
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messagesForLLM,
        temperature: (llmConfig && llmConfig.temperature) || 0.7
      })
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.error || ('代理调用失败 (' + response.status + ')'))
    }

    const data = await response.json()
    raw = data.content
  }

  return parseLLMResponse(raw)
}

// ==============================
// 主对话引擎
// 返回：{ content: string, summary: object|null }
// ==============================
const callAI = async (userMessage, conversation, llmConfig) => {
  // 默认走 LLM（代理模式），不再因为没有 apiKey 就回退到规则引擎
  // 只有在代理也失败时才回退
  try {
    const result = await callLLM(userMessage, conversation, llmConfig)
    return result
  } catch (err) {
    // 如果用户自己配了 Key 且失败了，直接报错
    const hasUserKey = llmConfig && llmConfig.apiKey && llmConfig.apiKey.trim().length > 0
    if (hasUserKey) throw err

    // 代理失败 → 回退到规则引擎
    console.warn('代理调用失败，回退到规则引擎:', err.message)
  }

  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1000))

  const trimmed = userMessage.trim()

  if (trimmed.length < 4 && conversation.round === 0) {
    return { content: '我想多了解一点——你说的这件事，是关于什么的？', summary: null }
  }

  let content = ''
  let summary = null

  if (conversation.round === 0) {
    content = generateFirstRound(trimmed)
  } else {
    const followUp = generateFollowUp(trimmed, conversation)
    if (followUp === null) {
      content = generateSummary(conversation)
    } else {
      content = followUp
    }
  }

  const allText = [...conversation.userMessages, trimmed].join('。')
  const layers = analyzeByThemes(allText)
  const layerNames = layers.map(l => l.name)

  if (conversation.round === 0) {
    summary = {
      initial: trimmed.length > 40 ? trimmed.substring(0, 40) + '……' : trimmed,
      layers: layers.slice(0, 4).map(l => ({ name: l.name, summary: l.summary, quote: l.quote })),
      stuck: '',
      directions: []
    }
  } else {
    summary = {
      initial: conversation.userMessages[0] ? (conversation.userMessages[0].length > 40 ? conversation.userMessages[0].substring(0, 40) + '……' : conversation.userMessages[0]) : '',
      layers: layers.slice(0, 4).map(l => ({ name: l.name, summary: l.summary, quote: l.quote })),
      stuck: layers.length >= 2 ? layers[layers.length - 1].summary : '',
      directions: conversation.round >= 2 ? [
        { dir: '如果明天只对其中一件事花一点心思，你想对哪一件？', action: '把这周最让你难受的那件事写在便签上' },
        { dir: '把这些事按轻重排个序，最上面那件是什么？', action: '花20分钟把脑子里所有"要不要"的问题列出来' },
        { dir: '有没有哪一层，是你之前没对自己承认过的？', action: '翻出你上次被表扬的工作记录读一遍' }
      ] : []
    }
  }

  return { content, summary }
}

// ==============================
// localStorage 持久化：保存/恢复对话状态
// ==============================
const STORAGE_KEY = '这里_chat_state'

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {}
}

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return null
}

function App() {
  const savedState = loadState()

  const [messages, setMessages] = useState(savedState?.messages || [])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showOpening, setShowOpening] = useState(!savedState || savedState.messages.length === 0)
  const [conversation, setConversation] = useState(savedState?.conversation || {
    round: 0,
    userMessages: [],
    aiMessages: [],
    coreTopics: [],
    stuckPoints: [],
    directions: []
  })
  const [initialHook, setInitialHook] = useState(savedState?.initialHook || '')
  const [collectedLayers, setCollectedLayers] = useState(savedState?.collectedLayers || [])
  const [stuckPoint, setStuckPoint] = useState(savedState?.stuckPoint || '')
  const [directions, setDirections] = useState(savedState?.directions || [])

  const [showConfig, setShowConfig] = useState(false)
  const [llmConfig, setLLMConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('这里_llmConfig')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return LLM_DEFAULTS
  })
  const [llmStatus, setLLMStatus] = useState('')

  const chatContainerRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    try {
      localStorage.setItem('这里_llmConfig', JSON.stringify(llmConfig))
    } catch (e) {}
  }, [llmConfig])

  // 持久化对话状态
  useEffect(() => {
    saveState({
      messages,
      conversation,
      initialHook,
      collectedLayers,
      stuckPoint,
      directions
    })
  }, [messages, conversation, initialHook, collectedLayers, stuckPoint, directions])

  const handleScrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage = inputValue.trim()
    setInputValue('')
    setShowOpening(false)
    setLLMStatus('')

    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newUserMessage])

    const newConversation = {
      ...conversation,
      userMessages: [...conversation.userMessages, userMessage]
    }

    setConversation(newConversation)

    setIsTyping(true)

    try {
      const result = await callAI(userMessage, conversation, llmConfig)
      const aiText = (result.content || '').trim() || '（我听到了，让我想想怎么回应你……）'
      const summary = result.summary

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiText,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMessage])

      setConversation(prev => ({
        ...prev,
        round: prev.round + 1,
        aiMessages: [...prev.aiMessages, aiText]
      }))

      if (summary && typeof summary === 'object') {
        if (summary.initial && !initialHook) {
          setInitialHook(summary.initial)
        }
        if (Array.isArray(summary.layers) && summary.layers.length > 0) {
          setCollectedLayers(
            summary.layers.slice(0, 5).map(l => ({
              name: (l && l.name) || '',
              summary: (l && l.summary) || '',
              quote: (l && l.quote) || ''
            }))
          )
        }
        if (summary.stuck) {
          setStuckPoint(summary.stuck)
        }
        if (Array.isArray(summary.directions) && summary.directions.length > 0) {
          setDirections(summary.directions)
        }
      } else {
        // LLM 没返回 summary → 保留已有数据，只补充 initialHook
        if (conversation.userMessages.length === 0 && !initialHook) {
          setInitialHook(userMessage.length > 40 ? userMessage.substring(0, 40) + '……' : userMessage)
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      setLLMStatus('出错：' + error.message)
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '（对话出了点问题：' + error.message + '）',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
    }
  }

  const startChat = () => {
    setShowOpening(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>这里</h1>
        <button
          className="config-button"
          onClick={() => setShowConfig(true)}
          title="大模型配置"
        >
          ⚙
          <span className={'config-status ' + (llmConfig.apiKey && llmConfig.apiKey.trim() ? 'on' : 'off')}></span>
        </button>
      </header>

      <div className="main-layout">
        <div className="chat-panel">
          <div className="chat-container" ref={chatContainerRef}>
            {showOpening && (
              <div className="opening-message">
                {OPENING_MESSAGE.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                ))}
                <p style={{ marginTop: '1.5em', textAlign: 'center' }}>
                  <button
                    onClick={startChat}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      padding: '10px 32px',
                      borderRadius: '24px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'var(--accent)'
                      e.target.style.color = 'var(--bg-primary)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent'
                      e.target.style.color = 'var(--accent)'
                    }}
                  >
                    我想说说
                  </button>
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role === 'user' ? 'user' : 'ai'}`}>
                <div className="message-content">{message.content}</div>
                <div className="message-time">{message.timestamp}</div>
              </div>
            ))}

            {isTyping && (
              <div className="message ai">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}

            {!showOpening && messages.length > 0 && (
              <div className="scroll-hint" onClick={handleScrollToBottom}>
                ↓ 回到最新消息
              </div>
            )}
          </div>

          <div className="input-area">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="随便说，说到哪算哪..."
                rows={1}
                disabled={isTyping}
              />
            </div>
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
            >
              ↑
            </button>
          </div>
        </div>

        <aside className="summary-panel">
          <div className="summary-header">
            <h2>🧭 你的梳理</h2>
          </div>
          <div className="summary-sections">

            <div className="summary-section">
              <div className="section-title">① 你来的时候</div>
              {initialHook ? (
                <div className="section-content">" {initialHook} "</div>
              ) : (
                <div className="section-placeholder">（还空着——说说你最近怎么了）</div>
              )}
            </div>

            <div className="summary-section">
              <div className="section-title">② 这件事其实是</div>
              {collectedLayers.length > 0 ? (
                <div className="layers-list">
                  {collectedLayers.map((layer, idx) => (
                    <div key={layer.name} className="layer-item">
                      <div className="layer-name">{idx + 1}. {layer.name}</div>
                      <div className="layer-quote">"{layer.quote}"</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="section-placeholder">（还空着——聊着聊着，这里会列出你心里的几件事）</div>
              )}
            </div>

            <div className="summary-section">
              <div className="section-title">③ 你真正卡在的地方</div>
              {stuckPoint || collectedLayers.length >= 2 ? (
                <div className="section-content">
                  {stuckPoint || collectedLayers[collectedLayers.length - 1].summary}
                </div>
              ) : (
                <div className="section-placeholder">（还没到那里——再聊几句，这里会慢慢清晰）</div>
              )}
            </div>

            <div className="summary-section">
              <div className="section-title">④ 可以想一想的方向</div>
              {directions.length > 0 ? (
                <div className="directions-list">
                  {directions.map((d, idx) => {
                    const dir = typeof d === 'string' ? d : (d.dir || '')
                    const action = typeof d === 'object' && d.action ? d.action : null
                    return (
                      <div key={idx} className="direction-item">
                        <div className="direction-text">· {dir}</div>
                        {action && <div className="direction-action">→ 本周小动作：{action}</div>}
                      </div>
                    )
                  })}
                </div>
              ) : conversation.round >= 3 ? (
                <div className="directions-list">
                  <div className="direction-item">· 如果明天只对其中一件事花一点心思，你想对哪一件？</div>
                  <div className="direction-item">· 把这些事按轻重排个序，最上面那件是什么？</div>
                  <div className="direction-item">· 有没有哪一层，是你之前没对自己承认过的？</div>
                </div>
              ) : (
                <div className="section-placeholder">（还没到那里——等你说够了，这里会有几个方向）</div>
              )}
            </div>

          </div>
        </aside>
      </div>

      {showConfig && (
        <div className="modal-overlay" onClick={() => setShowConfig(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>大模型配置</h2>
              <button className="modal-close" onClick={() => setShowConfig(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                填了 API Key 后，对话会通过真实大模型来进行。配置会存在你的浏览器里。
                {llmConfig.apiKey && llmConfig.apiKey.trim() ? (
                  <span style={{ color: 'var(--accent)' }}> 当前：已配置</span>
                ) : (
                  <span> 当前：未配置（用内置规则）</span>
                )}
              </p>

              <div className="form-group">
                <label>快捷预设</label>
                <div className="preset-buttons">
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => setLLMConfig(prev => ({ ...prev, endpoint: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat' }))}
                  >
                    DeepSeek V3 聊天
                  </button>
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => setLLMConfig(prev => ({ ...prev, endpoint: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-reasoner' }))}
                  >
                    DeepSeek R1 推理
                  </button>
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => setLLMConfig(prev => ({ ...prev, endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' }))}
                  >
                    OpenAI GPT-4o mini
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>API 地址</label>
                <input
                  type="text"
                  value={llmConfig.endpoint}
                  onChange={(e) => setLLMConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                  placeholder="https://api.openai.com/v1/chat/completions"
                />
              </div>

              <div className="form-group">
                <label>API Key</label>
                <input
                  type="password"
                  value={llmConfig.apiKey}
                  onChange={(e) => setLLMConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="你的 API Key"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>模型</label>
                  <input
                    type="text"
                    value={llmConfig.model}
                    onChange={(e) => setLLMConfig(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="gpt-4o-mini"
                  />
                </div>
                <div className="form-group">
                  <label>温度</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={llmConfig.temperature}
                    onChange={(e) => setLLMConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0.7 }))}
                  />
                </div>
              </div>

              {llmStatus && (
                <div className="status-error">{llmStatus}</div>
              )}

              <div className="form-tip">
                <p>· 任何兼容 OpenAI chat completions 格式的 API 都可以用（比如 OpenAI、Anthropic Claude 的兼容层、DeepSeek、国内的大模型兼容层等）</p>
                <p>· 留空 API Key 的时候，应用会用内置的规则引擎回复（对话会相对模板化）</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
