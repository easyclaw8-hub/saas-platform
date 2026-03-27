import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | 談笑書生 — AI 自動生成 YouTube 新聞影片教學同心得",
  description: "了解點樣用 AI 自動生成 YouTube 新聞影片。涵蓋 AI 影片製作教學、YouTube 頻道經營技巧、廣東話內容創作心得。",
  keywords: "AI影片生成, YouTube教學, 自動化影片, 廣東話YouTube, 新聞影片製作, AI內容創作, YouTube頻道經營",
  openGraph: {
    title: "Blog | 談笑書生 AI 影片平台",
    description: "AI 影片製作教學、YouTube 頻道經營技巧同內容創作心得",
    type: "website",
  },
};

const posts = [
  {
    slug: "how-to-start-ai-youtube-channel",
    date: "2026-03-25",
    category: "教學",
    title: "2026 年點樣用 AI 零成本開始 YouTube 新聞頻道？完整教學",
    summary:
      "唔識剪片、唔識配音都冇問題。呢篇文章教你點樣用 AI 工具，由零開始建立一個全自動嘅 YouTube 新聞頻道。",
    content: `好多人都想開 YouTube 頻道，但一諗到要學剪片、買器材、錄音就打退堂鼓。2026 年嘅 AI 技術已經可以幫你解決所有呢啲問題。談笑書生就係一個成功例子——頻道完全由 AI 自動運作，每日出片，從未手動剪輯過一條影片。

第一步：選定你嘅內容方向

新聞類頻道係最適合 AI 自動化嘅類型，因為新聞內容每日更新，唔需要原創拍攝。你可以選擇特定領域，例如：香港本地新聞、國際時事、財經分析、科技新聞、娛樂八卦。揀一個你有興趣同基本認識嘅領域，觀眾會感受到你嘅熱誠。

第二步：設定自動新聞抓取

Google News RSS 係免費嘅新聞數據源。你只需要設定正確嘅搜尋關鍵字同語言，就可以自動抓取最新嘅新聞標題。談笑書生平台已經內建咗十大新聞分類嘅 RSS 源，用戶唔需要自己配置。

第三步：AI 自動撰稿

呢一步係成個流程最關鍵嘅部分。AI 會根據新聞標題，用自己嘅知識庫去補充背景資料、分析事件影響、加入生活化嘅例子。好嘅 prompt 設計可以令 AI 生成嘅講稿聽落好似真人評論員咁自然。

談笑書生用 DeepSeek AI 撰稿，每次生成 8000-10000 字嘅講稿，足夠製作 15 分鐘以上嘅影片。講稿會自動包含章節標記、開場白、分析同總結。

第四步：AI 配音

TTS（Text-to-Speech）技術已經發展到可以模擬真人語氣嘅程度。談笑書生支援廣東話、普通話同英文三種語言，男女聲任選。AI 配音會根據標點符號自動調整語速同停頓，令到成段講稿聽落好自然。

第五步：自動剪輯同上傳

系統會自動配對相關嘅 stock footage、加入字幕、製作縮圖，然後一鍵上傳到 YouTube。整個過程由撳「生成」到上傳完成，大約需要 15-20 分鐘。

成本分析

用談笑書生平台，你可以由免費計劃開始（每月 1 條片），測試吓效果。如果頻道開始有增長，升級到 Basic 計劃（$9.99/月）就可以每月出 10 條片，已經足夠建立穩定嘅內容輸出。

記住，YouTube 頻道嘅關鍵係堅持。AI 自動化嘅最大好處就係令你可以持續出片，唔會因為忙碌或者冇靈感而斷更。`,
  },
  {
    slug: "cantonese-ai-content-creation",
    date: "2026-03-22",
    category: "技術",
    title: "廣東話 AI 內容創作嘅挑戰同解決方案：點樣令 AI 講出地道廣東話？",
    summary:
      "廣東話同書面中文有極大差異，AI 生成嘅廣東話內容經常出現「書面語化」問題。呢篇文章深入分析挑戰同我哋嘅解決方案。",
    content: `廣東話係全球超過 8500 萬人使用嘅語言，但喺 AI 領域，廣東話嘅資源同支援遠遠落後於普通話同英文。要令 AI 生成自然流暢嘅廣東話內容，需要克服幾個核心挑戰。

挑戰一：口語同書面語嘅鴻溝

廣東話嘅口語同書面語差異之大，喺全球語言中都算罕見。同一句說話，書面語可能寫成「因此我們需要進行討論」，但廣東話口語係「所以我哋要傾下」。AI 模型訓練嘅數據大部分係書面語，自然傾向生成書面化嘅表達。

我哋嘅解決方案係喺 prompt 中加入大量「死規矩」同對照例子。例如明確列出：「進行」要寫「做」、「因此」要寫「所以」、「第一部分是」要寫「我哋先講下」。呢啲規則令 AI 有清晰嘅指引。

挑戰二：同音錯字

廣東話有大量同音字，AI 經常搞混。最常見嘅錯誤包括：「系」同「係」、「甘」同「咁」、「既」同「嘅」、「翻」同「返」。呢啲錯字雖然唔影響理解，但會令人覺得「唔地道」。

我哋嘅方案係加入專門嘅校對步驟，用另一個 AI 模型專門搵出同修正呢類錯字。校對 prompt 會列出常見嘅同音錯字對照表，確保高準確度修正。

挑戰三：語氣同節奏

廣東話有獨特嘅語氣詞（㗎、喎、囉、咩）同節奏感。AI 生成嘅文字如果冇適當嘅語氣詞同標點，讀出嚟會好生硬。

我哋喺 prompt 中要求每句控制喺 20 字左右，用充足嘅標點符號控制節奏，同埋適當加入語氣詞。另外，Grok AI 審稿會專門評估講稿嘅口語自然度，低於 7 分嘅講稿會被要求重寫。

挑戰四：英文混用

香港人日常溝通經常中英夾雜（code-mixing），但 YouTube 影片如果英文太多，會影響 TTS 配音質素同觀眾體驗。我哋嘅系統會自動偵測同移除英文字詞，將外國名詞全部翻譯為中文。

經過以上優化，談笑書生生成嘅廣東話內容已經可以達到接近真人主播嘅水平。觀眾經常留言表示「完全聽唔出係 AI」，呢個係我哋最大嘅成就。`,
  },
  {
    slug: "youtube-seo-tips-ai-channels",
    date: "2026-03-18",
    category: "經營",
    title: "AI YouTube 頻道 SEO 攻略：點樣令 AI 生成嘅影片獲得更多流量？",
    summary:
      "AI 生成影片後，SEO 優化係決定頻道成敗嘅關鍵。呢篇文章分享 5 個實戰技巧，幫你嘅 AI 頻道獲得更多自然流量。",
    content: `AI 可以幫你自動生成影片，但要令影片獲得觀看量，YouTube SEO 優化就至關重要。以下係談笑書生頻道實戰驗證過嘅 5 個核心技巧。

技巧一：標題要有「資訊缺口」

最有效嘅標題格式係「已知事實 + 未知答案」。例如「機場檢獲 340 萬大麻花」係已知事實，加上「香港海關點樣築起防毒牆？」就創造咗資訊缺口，觀眾會想知道答案而點擊。

談笑書生嘅 AI 會自動生成呢種格式嘅標題，包含 emoji 增加視覺吸引力，控制喺 15-30 字以內確保唔會被截斷。

技巧二：描述區域要有結構

YouTube 嘅描述區域係 SEO 嘅黃金地帶。前 150 字最重要，因為呢部分會顯示喺搜尋結果。我哋嘅系統會自動生成 300 字嘅結構化描述，包含：核心內容摘要（前 150 字）、影片章節時間戳、相關 hashtag。

時間戳特別重要，因為 YouTube 會將佢轉化為「影片章節」功能，令觀眾可以直接跳去想睇嘅部分。呢個功能可以顯著提升觀看時長同觀眾滿意度。

技巧三：標籤要涵蓋三個層次

有效嘅標籤策略分三個層次：核心關鍵字（例如「香港新聞」「海關」）、長尾關鍵字（例如「香港海關檢獲毒品」）、頻道品牌詞（例如「談笑書生」「新聞評論」）。談笑書生自動生成 20 個標籤，平衡涵蓋呢三個層次。

技巧四：縮圖設計決定點擊率

YouTube 官方數據顯示，90% 表現最好嘅影片都有自訂縮圖。我哋嘅 AI 會自動生成醒目嘅縮圖，使用大字標題、對比色同相關圖像。好嘅縮圖可以將點擊率提升 2-3 倍。

技巧五：發佈時間同一致性

YouTube 算法偏好定時定量發佈嘅頻道。談笑書生每日 8AM 同 8PM 各出一條片，呢個規律令算法更容易推薦我哋嘅內容。AI 自動化嘅最大優勢就係可以做到 100% 嘅發佈一致性，唔會因為任何原因斷更。

將以上 5 個技巧結合 AI 自動化，你可以建立一個持續增長嘅 YouTube 頻道，而你需要做嘅只係偶爾檢查數據同調整策略。`,
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📺</span>
            <span className="text-lg font-bold">談笑書生</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/updates" className="hover:text-white transition-colors">最新更新</Link>
            <Link href="/blog" className="text-white">Blog</Link>
            <Link href="/sign-up" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-sm font-medium transition-colors">
              免費開始
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-400 mb-12">AI 影片製作教學、YouTube 頻道經營技巧同內容創作心得</p>

        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} id={post.slug} className="border-b border-white/5 pb-12">
              <div className="flex items-center gap-3 mb-2">
                <time className="text-sm text-orange-400">{post.date}</time>
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-gray-400">
                  {post.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold mt-2 mb-3">{post.title}</h2>
              <p className="text-gray-400 mb-6">{post.summary}</p>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                {post.content}
              </div>
              <div className="mt-6">
                <Link
                  href="/sign-up"
                  className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg text-sm font-semibold transition-all"
                >
                  免費試用談笑書生 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📺</span>
            <span className="font-semibold">談笑書生</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">首頁</Link>
            <Link href="/updates" className="hover:text-white transition-colors">更新</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
          <p className="text-sm text-gray-500">&copy; 2026 談笑書生</p>
        </div>
      </footer>
    </div>
  );
}
