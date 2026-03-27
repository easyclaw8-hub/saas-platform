-- 談笑書生 SaaS Platform - Supabase Schema
-- Run this in Supabase SQL Editor

-- Users settings table
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  topic TEXT DEFAULT '香港新聞',
  rss_feed_url TEXT,
  language TEXT DEFAULT 'cantonese' CHECK (language IN ('cantonese', 'mandarin', 'english')),
  voice TEXT DEFAULT 'male' CHECK (voice IN ('male', 'female')),
  duration INTEGER DEFAULT 10 CHECK (duration IN (5, 10, 15)),
  youtube_channel_id TEXT,
  logo_url TEXT,
  brand_color TEXT DEFAULT '#FFDD00',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  videos_used_this_month INTEGER DEFAULT 0,
  quota_reset_at TIMESTAMPTZ DEFAULT (date_trunc('month', now()) + interval '1 month'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_settings(clerk_user_id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  topic TEXT NOT NULL,
  language TEXT NOT NULL,
  voice TEXT NOT NULL,
  duration INTEGER NOT NULL,
  video_url TEXT,
  youtube_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_user_settings_clerk_id ON user_settings(clerk_user_id);

-- RLS Policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can only view their own jobs
CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
