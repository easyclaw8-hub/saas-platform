"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const TOPICS = [
  "香港新聞", "國際新聞", "財經", "科技", "娛樂", "體育",
  "健康", "教育", "環保", "AI / 人工智能",
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "排隊中", color: "text-yellow-400" },
  processing: { label: "生成中", color: "text-blue-400" },
  completed: { label: "完成", color: "text-green-400" },
  failed: { label: "失敗", color: "text-red-400" },
};

interface Job {
  id: string;
  status: string;
  topics: string[];
  language: string;
  voice: string;
  duration: number;
  video_url: string | null;
  video_path: string | null;
  youtube_url: string | null;
  video_title: string | null;
  description: string | null;
  tags: string | null;
  timeline: string | null;
  thumbnail_path: string | null;
  srt_path: string | null;
  error: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["香港新聞"]);
  const [language, setLanguage] = useState("cantonese");
  const [voice, setVoice] = useState("female");
  const [duration, setDuration] = useState("10");
  const [generating, setGenerating] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [buyingCredits, setBuyingCredits] = useState(false);

  const DURATION_CREDITS: Record<string, number> = { "5": 200, "10": 250, "15": 300 };

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setCredits(data.credits || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Poll for active job status every 10 seconds
  useEffect(() => {
    const hasActiveJob = jobs.some((j) => j.status === "processing");
    if (!hasActiveJob) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/jobs/status");
        if (res.ok) {
          const data = await res.json();
          if (data.status === "completed" || data.status === "failed") {
            await fetchJobs();
          }
        }
      } catch {
        // ignore
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [jobs, fetchJobs]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage("正在抓取新聞、AI 撰稿中... 大約需要 3-5 分鐘，請耐心等候");

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics: selectedTopics,
          language,
          voice,
          duration: parseInt(duration),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "生成失敗");
      } else {
        setMessage("任務已提交！影片生成中...");
        await fetchJobs();
      }
    } catch {
      setMessage("網絡錯誤，請稍後再試");
    } finally {
      setGenerating(false);
    }
  };

  const handleBuyCredits = async () => {
    setBuyingCredits(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || "無法建立付款頁面");
      }
    } catch {
      setMessage("網絡錯誤，請稍後再試");
    } finally {
      setBuyingCredits(false);
    }
  };

  const handleYouTubeUpload = async (jobId: string) => {
    setUploading(jobId);
    try {
      const res = await fetch("/api/youtube-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, privacy: "public" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("影片已成功上傳到 YouTube！");
        await fetchJobs();
      } else {
        setMessage(data.error || "YouTube 上傳失敗");
      }
    } catch {
      setMessage("YouTube 上傳失敗，請稍後再試");
    } finally {
      setUploading(null);
    }
  };

  const LANG_MAP: Record<string, string> = {
    cantonese: "廣東話",
    mandarin: "普通話",
    english: "English",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <nav className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📺</span>
            <span className="text-lg font-bold">談笑書生</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              💰 {credits} credits
            </span>
            <button
              onClick={handleBuyCredits}
              disabled={buyingCredits}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              {buyingCredits ? "..." : "購買 Credits"}
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            歡迎, {user?.firstName || "用戶"} 👋
          </h1>
          <p className="text-gray-400 mt-2">設定你嘅影片偏好，然後一鍵生成</p>
        </div>

        {/* Settings Grid */}
        <div className="space-y-8">
          {/* Topics */}
          <section className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="text-lg font-semibold mb-4">🔍 新聞主題</h2>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedTopics.includes(topic)
                      ? "bg-orange-500 text-white"
                      : "border border-white/20 text-gray-400 hover:border-white/40"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>

          {/* Language & Voice */}
          <div className="grid sm:grid-cols-2 gap-6">
            <section className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h2 className="text-lg font-semibold mb-4">🌐 語言</h2>
              <div className="space-y-2">
                {[
                  { value: "cantonese", label: "廣東話" },
                  { value: "mandarin", label: "普通話" },
                  { value: "english", label: "English" },
                ].map((lang) => (
                  <label
                    key={lang.value}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      language === lang.value
                        ? "bg-orange-500/10 border border-orange-500/30"
                        : "border border-transparent hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name="language"
                      value={lang.value}
                      checked={language === lang.value}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="accent-orange-500"
                    />
                    <span>{lang.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h2 className="text-lg font-semibold mb-4">🎙️ 聲音</h2>
              <div className="space-y-2">
                {[
                  { value: "female", label: "女聲" },
                  { value: "male", label: "男聲" },
                ].map((v) => (
                  <label
                    key={v.value}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      voice === v.value
                        ? "bg-orange-500/10 border border-orange-500/30"
                        : "border border-transparent hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name="voice"
                      value={v.value}
                      checked={voice === v.value}
                      onChange={(e) => setVoice(e.target.value)}
                      className="accent-orange-500"
                    />
                    <span>{v.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Duration */}
          <section className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="text-lg font-semibold mb-4">⏱️ 影片長度</h2>
            <div className="flex gap-3">
              {["5", "10", "15"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
                    duration === d
                      ? "bg-orange-500 text-white"
                      : "border border-white/20 text-gray-400 hover:border-white/40"
                  }`}
                >
                  <div>{d} 分鐘</div>
                  <div className="text-xs opacity-70">{DURATION_CREDITS[d]} credits</div>
                </button>
              ))}
            </div>
          </section>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-xl text-center text-sm ${
              message.includes("失敗") || message.includes("上限") || message.includes("錯誤")
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : generating
                ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                : "bg-green-500/10 border border-green-500/30 text-green-400"
            }`}>
              {generating && (
                <svg className="animate-spin h-4 w-4 inline-block mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {message}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || selectedTopics.length === 0}
            className="w-full py-4 rounded-xl text-lg font-semibold transition-all bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                提交中...
              </span>
            ) : (
              `🎬 一鍵生成影片（${DURATION_CREDITS[duration] || 250} credits）`
            )}
          </button>
        </div>

        {/* Recent Jobs */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">📋 最近生成記錄</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {jobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                暫無記錄，生成第一條影片開始吧！
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {jobs.map((job) => {
                  const status = STATUS_MAP[job.status] || { label: job.status, color: "text-gray-400" };
                  const isExpanded = expandedJob === job.id;
                  return (
                    <div key={job.id} className="p-4">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {job.video_title || job.topics?.join(", ")}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {LANG_MAP[job.language] || job.language} · {job.voice === "female" ? "女聲" : "男聲"} · {job.duration}分鐘 · {new Date(job.created_at).toLocaleString("zh-HK")}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Action buttons for completed jobs */}
                          {job.status === "completed" && (
                            <>
                              <a
                                href={`/api/serve-video?jobId=${job.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-all"
                              >
                                🎬 下載影片
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleYouTubeUpload(job.id);
                                }}
                                disabled={uploading === job.id || job.youtube_url === "uploaded"}
                                className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all disabled:opacity-50"
                              >
                                {uploading === job.id ? (
                                  <span className="flex items-center gap-1">
                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    上傳中...
                                  </span>
                                ) : job.youtube_url === "uploaded" ? (
                                  "✅ 已上傳"
                                ) : (
                                  "📤 上傳 YouTube"
                                )}
                              </button>
                            </>
                          )}
                          <span className={`text-sm font-medium ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>

                      {/* Expanded SEO info */}
                      {isExpanded && job.status === "completed" && (
                        <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                          {job.video_title && (
                            <div>
                              <div className="text-xs text-gray-500 mb-1">📰 標題</div>
                              <div className="text-sm">{job.video_title}</div>
                            </div>
                          )}
                          {job.description && (
                            <div>
                              <div className="text-xs text-gray-500 mb-1">📝 描述</div>
                              <div className="text-xs text-gray-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                                {job.description}
                              </div>
                            </div>
                          )}
                          {job.tags && (
                            <div>
                              <div className="text-xs text-gray-500 mb-1">🏷️ Tags</div>
                              <div className="flex flex-wrap gap-1">
                                {job.tags.split(",").slice(0, 15).map((tag, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-gray-400">
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {job.timeline && (
                            <div>
                              <div className="text-xs text-gray-500 mb-1">⏱️ 章節</div>
                              <div className="text-xs text-gray-400 whitespace-pre-wrap">
                                {job.timeline}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Error info */}
                      {isExpanded && job.status === "failed" && job.error && (
                        <div className="mt-4 border-t border-white/5 pt-4">
                          <div className="text-xs text-red-400 whitespace-pre-wrap max-h-24 overflow-y-auto">
                            {job.error}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
