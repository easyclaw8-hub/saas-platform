import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "最新更新 | 談笑書生 — AI YouTube 新聞影片自動生成平台",
  description: "談笑書生平台最新功能更新、版本發佈同產品路線圖。了解我哋點樣用 AI 技術自動生成 YouTube 新聞影片。",
  keywords: "談笑書生, AI影片生成, YouTube自動化, 新聞影片, 平台更新, AI新聞",
  openGraph: {
    title: "最新更新 | 談笑書生 AI 影片平台",
    description: "談笑書生平台最新功能更新同產品路線圖",
    type: "website",
  },
};

const updates = [
  {
    slug: "saas-platform-launch",
    date: "2026-03-26",
    title: "談笑書生 SaaS 平台正式上線：一鍵生成 AI 新聞影片",
    summary:
      "經過數月開發，談笑書生正式由個人頻道進化成 SaaS 平台。任何人都可以用 AI 自動生成專業新聞影片，直接上傳 YouTube。",
    content: `談笑書生由一個香港 YouTube 新聞頻道起步，每日自動用 AI 抓取新聞、撰寫講稿、配音、剪輯、上傳 YouTube。經過數月嘅開發同優化，我哋正式將呢套全自動 pipeline 包裝成 SaaS 平台，開放畀所有內容創作者使用。

平台核心功能包括：自訂新聞主題（香港新聞、國際新聞、財經、科技等十大分類）、三種語言選擇（廣東話、普通話、英文）、男女聲配音、影片長度自訂（5/10/15 分鐘）。用戶只需要揀好設定，撳一個按鈕，系統就會自動完成成個流程。

技術上，我哋採用 DeepSeek AI 進行新聞撰稿，配合 Grok AI 審稿確保廣東話口語質素，再經過自動校對修正錯字。影片製作方面，系統自動配對相關 stock footage、生成 AI 配音、加入字幕同章節標記。

定價方面，我哋提供免費計劃（每月 1 條片），Basic 計劃（$9.99/月，10 條片）同 Pro 計劃（$29.99/月，60 條片），適合唔同規模嘅內容創作者。

未來我哋會繼續優化 AI 撰稿質素、加入更多語言支援、同埋提供更豐富嘅品牌自訂功能。歡迎所有有興趣嘅創作者免費試用！`,
  },
  {
    slug: "ai-script-quality-upgrade",
    date: "2026-03-20",
    title: "AI 撰稿質素大升級：雙重 AI 審核確保廣東話口語自然流暢",
    summary:
      "我哋引入咗 Grok AI 審稿同 DeepSeek 校對嘅雙重品質保證機制，令生成嘅廣東話講稿更加自然、地道。",
    content: `廣東話口語同書面語有好大分別，好多 AI 生成嘅廣東話內容都會出現「書面語化」嘅問題。為咗解決呢個難題，談笑書生引入咗獨特嘅雙重 AI 審核機制。

第一重審核由 Grok AI 負責。Grok 會檢查講稿嘅口語程度，搵出唔夠地道嘅句子，同時修正標題令佢更加吸引。例如將「根據國際貨幣基金組織的報告指出」改成「國際貨幣基金組織出咗份報告，入面講到...」。

第二重審核由 DeepSeek 進行校對。呢個步驟專門處理同音錯字（例如「系」改「係」、「甘」改「咁」、「既」改「嘅」），確保每句都有適當標點，同時刪除所有英文字詞，全部改為中文表達。

經過雙重審核後，講稿嘅口語自然度評分由平均 6 分提升到 8.5 分（10 分滿分）。觀眾反應亦明顯改善，留言經常提到「好似真人講嘢咁」同「好自然，聽得好舒服」。

呢個技術突破唔單止適用於廣東話，未來我哋會將同樣嘅雙重審核機制應用到普通話同英文，確保所有語言嘅生成質素都達到專業水平。`,
  },
  {
    slug: "youtube-auto-upload-seo",
    date: "2026-03-15",
    title: "YouTube 全自動上傳功能：包含 SEO 標題、描述、標籤同章節標記",
    summary:
      "新增一鍵上傳 YouTube 功能，自動填寫 SEO 優化嘅標題、描述、標籤，同埋生成影片章節時間戳。",
    content: `YouTube SEO 對於頻道增長至關重要。談笑書生平台而家支援一鍵上傳 YouTube，同時自動填寫所有 SEO 相關資訊。

標題優化方面，AI 會根據新聞內容生成 15-30 字嘅標題，包含 emoji 同關鍵字，確保喺搜尋結果同推薦頁面有最大吸引力。例如「機場大麻花檢三百四萬！香港海關點樣築起防毒牆？」呢類標題，既有資訊性又有懸念感。

描述區域會自動填入 300 字嘅內容摘要，包含相關 hashtag 同影片時間戳。時間戳會自動對應影片嘅章節標記，令觀眾可以直接跳去想睇嘅部分。

標籤方面，系統會生成 20 個相關標籤，涵蓋新聞關鍵字、頻道名稱同熱門搜尋詞。呢啲標籤經過優化，可以幫助影片喺 YouTube 搜尋同推薦算法中獲得更好嘅排名。

另外，系統會自動生成影片縮圖（thumbnail），使用醒目嘅設計同標題文字，提高點擊率。所有呢啲功能都係全自動，用戶唔需要做任何額外工作。

上傳後，用戶可以喺 Dashboard 直接睇到影片嘅 SEO 資訊，包括標題、描述、標籤同章節時間戳，方便檢查同調整。`,
  },
];

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📺</span>
            <span className="text-lg font-bold">談笑書生</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/updates" className="text-white">最新更新</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/sign-up" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-sm font-medium transition-colors">
              免費開始
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">最新更新</h1>
        <p className="text-gray-400 mb-12">談笑書生平台嘅最新功能同改進</p>

        <div className="space-y-12">
          {updates.map((post) => (
            <article key={post.slug} id={post.slug} className="border-b border-white/5 pb-12">
              <time className="text-sm text-orange-400">{post.date}</time>
              <h2 className="text-2xl font-bold mt-2 mb-3">{post.title}</h2>
              <p className="text-gray-400 mb-6">{post.summary}</p>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                {post.content}
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
