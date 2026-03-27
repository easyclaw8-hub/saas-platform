export type Language = "cantonese" | "mandarin" | "english";
export type Voice = "male" | "female";
export type VideoDuration = 5 | 10 | 15;
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface UserSettings {
  id: string;
  clerk_user_id: string;
  topic: string;
  rss_feed_url: string | null;
  language: Language;
  voice: Voice;
  duration: VideoDuration;
  youtube_channel_id: string | null;
  logo_url: string | null;
  brand_color: string;
  plan: "free" | "basic" | "pro";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  videos_used_this_month: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  status: JobStatus;
  topic: string;
  language: Language;
  voice: Voice;
  duration: VideoDuration;
  video_url: string | null;
  youtube_url: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}
