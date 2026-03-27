// Replicates the N8N pipeline: RSS → DeepSeek script → Grok review → Proofread → /produce

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const GROK_API_KEY = process.env.GROK_API_KEY!;
const VIDEO_SERVER_URL = process.env.VIDEO_SERVER_URL || "http://localhost:5680";

// ─── Topic → RSS mapping ───
const TOPIC_RSS: Record<string, { rssUrl: string; relatedUrl: string; mode: string }> = {
  "香港新聞": {
    rssUrl: "https://news.google.com/rss/search?q=香港+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    relatedUrl: "https://news.google.com/rss/search?q=香港+新聞+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    mode: "hongkong",
  },
  "國際新聞": {
    rssUrl: "https://news.google.com/rss/search?q=breaking+world+news+when:1d&hl=en&gl=US&ceid=US:en",
    relatedUrl: "https://news.google.com/rss/search?q=world+news+today+when:1d&hl=en&gl=US&ceid=US:en",
    mode: "international",
  },
  "財經": {
    rssUrl: "https://news.google.com/rss/search?q=香港+財經+股市+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    relatedUrl: "https://news.google.com/rss/search?q=財經+新聞+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    mode: "hongkong",
  },
  "科技": {
    rssUrl: "https://news.google.com/rss/search?q=科技+AI+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    relatedUrl: "https://news.google.com/rss/search?q=technology+news+when:1d&hl=en&gl=US&ceid=US:en",
    mode: "hongkong",
  },
  "娛樂": {
    rssUrl: "https://news.google.com/rss/search?q=香港+娛樂+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    relatedUrl: "https://news.google.com/rss/search?q=娛樂+新聞+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    mode: "hongkong",
  },
  "體育": {
    rssUrl: "https://news.google.com/rss/search?q=體育+新聞+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    relatedUrl: "https://news.google.com/rss/search?q=sports+news+when:1d&hl=en&gl=US&ceid=US:en",
    mode: "hongkong",
  },
  "健康": {
    rssUrl: "https://news.google.com/rss/search?q=健康+醫療+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    relatedUrl: "https://news.google.com/rss/search?q=health+news+when:1d&hl=en&gl=US&ceid=US:en",
    mode: "hongkong",
  },
  "教育": {
    rssUrl: "https://news.google.com/rss/search?q=香港+教育+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    relatedUrl: "https://news.google.com/rss/search?q=教育+新聞+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    mode: "hongkong",
  },
  "環保": {
    rssUrl: "https://news.google.com/rss/search?q=環保+氣候+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    relatedUrl: "https://news.google.com/rss/search?q=climate+environment+when:1d&hl=en&gl=US&ceid=US:en",
    mode: "hongkong",
  },
  "AI / 人工智能": {
    rssUrl: "https://news.google.com/rss/search?q=AI+artificial+intelligence+when:1d&hl=en&gl=US&ceid=US:en",
    relatedUrl: "https://news.google.com/rss/search?q=人工智能+when:1d&hl=zh-HK&gl=HK&ceid=HK:zh-Hant",
    mode: "international",
  },
};

// ─── Step 1: Fetch & Parse RSS ───
async function fetchRSS(url: string): Promise<{ title: string; source: string }[]> {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const xml = await res.text();

  const items: { title: string; source: string }[] = [];
  const matches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const m of matches.slice(0, 10)) {
    const title = (m.match(/<title>(.*?)<\/title>/) || [])[1] || "";
    const source = (m.match(/<source[^>]*>(.*?)<\/source>/) || [])[1] || "";
    if (title) items.push({ title, source });
  }
  return items;
}

// ─── Step 2: Build Content ───
async function buildContent(topics: string[]) {
  // Use first topic as primary
  const primaryTopic = topics[0] || "香港新聞";
  const config = TOPIC_RSS[primaryTopic] || TOPIC_RSS["香港新聞"];

  const mainItems = await fetchRSS(config.rssUrl);
  if (!mainItems.length) throw new Error("無法抓取新聞，請稍後再試");

  const mainArticle = mainItems[0];
  const relatedItems = await fetchRSS(config.relatedUrl);
  const related = relatedItems.filter((r) => r.title !== mainArticle.title).slice(0, 8);

  const mainNews = "【主要新聞】" + mainArticle.title + (mainArticle.source ? "（" + mainArticle.source + "）" : "");
  const relatedNews = related.map((r, i) => "【相關" + (i + 1) + "】" + r.title).join("\n");
  const allSources = [...new Set([mainArticle.source, ...related.map((r) => r.source)].filter(Boolean))].join("、");

  return {
    title: mainArticle.title,
    content: mainNews + "\n\n" + relatedNews,
    related: related.map((r) => r.title).join("\n"),
    allSources,
    mode: config.mode,
    topicLabel: topics.join(" | "),
  };
}

// ─── Step 3: Build Prompt ───
function buildPrompt(content: string, sources: string, mode: string): string {
  if (mode === "international") {
    return `你係「談笑書生」，一個香港YouTube知識型國際新聞評論頻道嘅主持人。你用好口語嘅廣東話，好似喺茶餐廳同朋友傾計咁講國際大事。

【死規矩】
1. 你叫「談笑書生」
2. 講稿要 8000-10000 字（起碼 15 分鐘片）
3. 全程講口語廣東話！「進行」寫「做」，「因此」寫「所以」
4. 用「我哋」唔好用「你」
5. 唔好加任何語氣聲 tag 如 (breath)(laughs)(sighs)！用標點控制節奏
6. 絕對唔好用英文！外國人名地名全部用中文
7. 每句 20 字左右，要有標點
8. 唔好寫任何後台備註、提示、指示
9. 要有充足標點符號
10. 每個章節開頭一定要加 [SUB:章節名] 標記

【重要】你要用自己嘅知識同理解去豐富內容！我只提供新聞標題，你要：
- 用你對呢件國際事件嘅知識去補充背景
- 分析各方立場
- 解釋對香港人嘅影響
- 加入生動嘅例子同比喻

【輸出格式】
===TITLE===
（15-30字，有emoji，要有具體國家名或「國際」）

===SCRIPT===
（8000-10000字，純口語，有標點，冇英文，冇語氣tag，冇後台備註，每個章節有 [SUB:xxx] 標記）

===DESCRIPTION===
（300字，加#hashtags同時間戳）

===TAGS===
（20個標籤，逗號分隔，包含國際相關關鍵字）

===TIMELINE===
00:00 開場
02:00 事件背景
05:00 各方反應
08:00 深度分析
12:00 對香港影響
15:00 總結

今日國際新聞標題：
${content}

新聞來源：${sources}`;
  }

  return `你係「談笑書生」，一個香港YouTube知識型新聞評論頻道嘅主持人。你嘅風格係用好口語嘅廣東話，好似喺茶餐廳同朋友傾計咁同觀眾講新聞。

【死規矩】
1. 你叫「談笑書生」，唔好用其他名
2. 講稿要 8000-10000 字（起碼 15 分鐘片）
3. 全程講口語廣東話！「進行」寫「做」，「因此」寫「所以」，「第一部分是」寫「我哋先講下」
4. 用「我哋」唔好用「你」
5. 唔好加任何語氣聲 tag 如 (breath)(laughs)(sighs)！用標點控制節奏
6. 絕對唔好用英文！全部中文
7. 每句 20 字左右，要有標點（句號、逗號、問號、感嘆號）
8. 唔好寫任何後台備註、提示、指示。只寫觀眾聽到嘅內容
9. 要有充足標點符號，每句之間用「。」或「，」分隔
10. 每個章節開頭一定要加 [SUB:章節名] 標記！

【重要】你要用自己嘅知識同理解去豐富內容！我只提供新聞標題，你要：
- 用你對香港社會嘅知識去補充背景
- 分析事件對普通香港人嘅影響
- 加入貼地嘅例子（茶餐廳、MTR、返工等）
- 用同理心講觀眾嘅感受

【輸出格式】
===TITLE===
（15-30字，有emoji）

===SCRIPT===
（8000-10000字，純口語，有標點，冇英文，冇語氣tag，冇後台備註，每個章節有 [SUB:xxx] 標記）

===DESCRIPTION===
（300字，加#hashtags同時間戳）

===TAGS===
（20個標籤，逗號分隔）

===TIMELINE===
00:00 開場
02:00 新聞背景
05:00 重點分析
12:00 談笑書生觀點
16:00 總結

今日香港新聞標題：
${content}

新聞來源：${sources}`;
}

// ─── Step 4: Call DeepSeek ───
async function callDeepSeek(prompt: string, maxTokens = 8192, temperature = 0.7): Promise<string> {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature,
    }),
    signal: AbortSignal.timeout(180000),
  });

  const data = await res.json();
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  throw new Error("DeepSeek API 回應異常: " + JSON.stringify(data).substring(0, 200));
}

// ─── Step 5: Parse Script Output ───
function parseScript(text: string) {
  let title = "", script = "", description = "", tags = "", timeline = "";

  const tm = text.match(/===TITLE===([\s\S]*?)(?====)/);
  if (tm) title = tm[1].trim();
  const sm = text.match(/===SCRIPT===([\s\S]*?)(?====)/);
  if (sm) script = sm[1].trim();
  const dm = text.match(/===DESCRIPTION===([\s\S]*?)(?====)/);
  if (dm) description = dm[1].trim();
  const tgm = text.match(/===TAGS===([\s\S]*?)(?====)/);
  if (tgm) tags = tgm[1].trim();
  const tlm = text.match(/===TIMELINE===([\s\S]*?)$/);
  if (tlm) timeline = tlm[1].trim();

  if (!script) script = text;
  if (!title) title = script.substring(0, 50);

  return { videoTitle: title, script, description, tags, timeline };
}

// ─── Step 6: Grok Review ───
async function grokReview(title: string, script: string): Promise<{ score: number; fixedTitle?: string }> {
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-3-mini-fast",
        messages: [
          { role: "system", content: "你係廣東話口語專家同YouTube內容審核員。" },
          {
            role: "user",
            content: `檢查以下講稿，回覆JSON：{"score": 1-10, "fixed_title": "修正標題", "has_english": bool}\n\n標題：${title}\n\n講稿前500字：${script.substring(0, 500)}\n\n講稿尾500字：${script.substring(Math.max(0, script.length - 500))}`,
          },
        ],
        stream: false,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(30000),
    });

    const data = await res.json();
    const grokText = data.choices?.[0]?.message?.content || "{}";
    const jsonMatch = grokText.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {
    // Grok review is optional, continue without it
  }
  return { score: 0 };
}

// ─── Step 7: Clean Script ───
function cleanScript(script: string): string {
  let clean = script;
  clean = clean.replace(/\((breath|laughs|laugh|sighs|sigh|chuckle|coughs|groans|gasps|sniffs|humming|hissing|emm|inhale|exhale|pant|snorts|burps|sneezes|clear-throat|lip-smacking)\)/gi, "");
  clean = clean.replace(/[A-Za-z]+/g, "");
  clean = clean.replace(/\s{2,}/g, " ");
  return clean;
}

// ─── Step 8: Proofread ───
async function proofread(script: string): Promise<string> {
  const prompt = `你係廣東話校對專家。以下係一篇YouTube廣東話講稿，請做以下修正：

1. 修正所有同音錯字（如「系」改「係」，「甘」改「咁」，「既」改「嘅」）
2. 刪除所有唔屬於內容嘅文字（如後台備註提示）
3. 確保每句都有標點符號
4. 修正唔通順嘅句子
5. 刪除所有英文字，改做中文
6. 頻道名係「談笑書生」
7. 保留所有 [SUB:xxx] 標記

只返回修正後嘅講稿。

講稿：
${script}`;

  try {
    const fixed = await callDeepSeek(prompt, 8192, 0.3);
    if (fixed.length > script.length * 0.3) return fixed.trim();
  } catch {
    // Proofread is optional, return original
  }
  return script;
}

// ─── Step 9: Trigger Video Server ───
async function triggerProduce(payload: {
  videoTitle: string;
  script: string;
  description: string;
  tags: string;
  timeline: string;
  mode: string;
  playlistName: string;
}) {
  const res = await fetch(`${VIDEO_SERVER_URL}/produce`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  return await res.json();
}

// ─── Main Pipeline ───
export interface PipelineInput {
  topics: string[];
  language: string;
  voice: string;
  duration: number;
}

export interface PipelineResult {
  videoTitle: string;
  description: string;
  tags: string;
  timeline: string;
  serverResponse: { status: string; message: string };
  grokScore: number;
}

export async function runPipeline(input: PipelineInput): Promise<PipelineResult> {
  // 1. Fetch news
  const newsContent = await buildContent(input.topics);

  // 2. Build prompt & call DeepSeek
  const prompt = buildPrompt(newsContent.content, newsContent.allSources, newsContent.mode);
  const rawScript = await callDeepSeek(prompt);

  // 3. Parse output
  const parsed = parseScript(rawScript);

  // 4. Grok review
  const review = await grokReview(parsed.videoTitle, parsed.script);
  if (review.fixedTitle && review.fixedTitle.length > 5) {
    parsed.videoTitle = review.fixedTitle;
  }

  // 5. Clean
  parsed.script = cleanScript(parsed.script);

  // 6. Proofread
  parsed.script = await proofread(parsed.script);

  // 7. Trigger video server
  const playlistName = newsContent.mode === "international" ? "國際新聞" : input.topics[0] || "香港人生活";
  const serverResponse = await triggerProduce({
    ...parsed,
    mode: newsContent.mode,
    playlistName,
  });

  return {
    videoTitle: parsed.videoTitle,
    description: parsed.description,
    tags: parsed.tags,
    timeline: parsed.timeline,
    serverResponse,
    grokScore: review.score || 0,
  };
}
