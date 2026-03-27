import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📺</span>
            <span className="text-lg font-bold">談笑書生</span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">功能</a>
            <a href="#how" className="hover:text-white transition-colors">流程</a>
            <a href="#pricing" className="hover:text-white transition-colors">定價</a>
            <Link href="/updates" className="hover:text-white transition-colors">更新</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                登入
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors"
              >
                免費開始
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm">
              AI 全自動 · 零剪輯技術 · 直上 YouTube
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-fade-in-up animation-delay-200">
            一鍵生成
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              {" "}YouTube 新聞影片
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
            選擇主題、語言、聲音，AI 自動抓取新聞、撰稿、配音、剪輯，
            <br className="hidden sm:block" />
            生成完整影片直接上傳你的 YouTube 頻道。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
            >
              免費試用 →
            </Link>
            <a
              href="#how"
              className="px-8 py-4 border border-white/20 hover:border-white/40 rounded-xl text-lg font-semibold transition-all hover:bg-white/5"
            >
              了解更多
            </a>
          </div>
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              ["5 分鐘", "生成一條片"],
              ["3 種語言", "廣粵普英"],
              ["全自動", "上傳 YouTube"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl sm:text-3xl font-bold text-orange-400">{num}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">強大功能</h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            從新聞抓取到影片上傳，全程 AI 自動化
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🔍",
                title: "智能新聞抓取",
                desc: "自訂 RSS 源或主題，AI 自動搜集最新新聞素材",
              },
              {
                icon: "✍️",
                title: "AI 撰稿",
                desc: "GPT 自動將新聞改寫為口語化播報稿，自然流暢",
              },
              {
                icon: "🎙️",
                title: "多語言配音",
                desc: "支援廣東話、普通話、英文，男女聲任選",
              },
              {
                icon: "🎬",
                title: "自動剪輯",
                desc: "AI 自動配圖、字幕、過場動畫，專業級影片",
              },
              {
                icon: "📤",
                title: "直上 YouTube",
                desc: "綁定你的頻道，影片自動上傳、設定標題描述標籤",
              },
              {
                icon: "🎨",
                title: "品牌自訂",
                desc: "上傳 Logo、設定品牌顏色，打造專屬頻道風格",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-orange-500/30 transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-orange-950/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">三步搞掂</h2>
          <p className="text-gray-400 text-center mb-16">簡單到令人難以置信</p>
          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "設定你的頻道",
                desc: "選擇新聞主題、語言、聲音風格，綁定 YouTube 頻道",
              },
              {
                step: "02",
                title: "AI 自動生成",
                desc: "系統自動抓取新聞、撰稿、配音、剪輯，全程無需人手",
              },
              {
                step: "03",
                title: "一鍵上傳",
                desc: "影片自動上傳到你的 YouTube 頻道，坐等觀看數增長",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xl font-bold">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">簡單定價</h2>
          <p className="text-gray-400 text-center mb-16">買 Credits，用幾多付幾多</p>

          {/* Credits Package */}
          <div className="max-w-md mx-auto mb-16">
            <div className="relative p-8 rounded-2xl border border-orange-500 bg-orange-500/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 rounded-full text-xs font-semibold">
                Credits 套餐
              </div>
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">$10</span>
                  <span className="text-gray-400 text-sm">USD</span>
                </div>
                <div className="mt-2 text-2xl text-orange-400 font-bold">1,000 Credits</div>
                <p className="mt-2 text-gray-400 text-sm">Credits 永不過期，用完再買</p>
              </div>
              <Link
                href="/sign-up"
                className="mt-6 block w-full py-3 rounded-xl font-semibold text-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25 transition-all"
              >
                立即開始
              </Link>
            </div>
          </div>

          {/* Credits Usage */}
          <h3 className="text-xl font-semibold text-center mb-8">Credits 消耗</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { duration: "5 分鐘", credits: "200", videos: "可生成 5 條片" },
              { duration: "10 分鐘", credits: "250", videos: "可生成 4 條片" },
              { duration: "15 分鐘", credits: "300", videos: "可生成 3 條片" },
            ].map((item) => (
              <div key={item.duration} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
                <div className="text-lg font-semibold">{item.duration}</div>
                <div className="mt-2 text-3xl font-bold text-orange-400">{item.credits}</div>
                <div className="text-sm text-gray-400">credits / 條片</div>
                <div className="mt-3 text-xs text-gray-500">$10 = {item.videos}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {[
              "所有新聞主題",
              "3 種語言（廣粵普英）",
              "男女聲配音",
              "1080p 畫質",
              "YouTube 自動上傳",
              "SEO 標題 + Tags",
              "Credits 永不過期",
              "Google 一鍵登入",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            準備好開始你的 AI 新聞頻道？
          </h2>
          <p className="text-gray-400 mb-8">
            免費開始，無需信用卡，1 分鐘內上手
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
          >
            立即免費試用
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📺</span>
            <span className="font-semibold">談笑書生</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; 2026 談笑書生. AI-Powered News Video Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
