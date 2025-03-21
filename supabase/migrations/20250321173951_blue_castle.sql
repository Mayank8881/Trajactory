/*
  # Initial Schema Setup for Trajectory AI

  1. New Tables
    - users: Authentication and user profiles
    - skills: User skills and proficiency tracking
    - career_goals: User career objectives
    - roadmaps: AI-generated career paths
    - market_insights: Job market data
    - chatbot_sessions: ProfessorX chat logs
    - courses: Learning resources

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated user access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  bio TEXT,
  job_title TEXT,
  experience_years INTEGER DEFAULT 0,
  education_level TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
  years_experience NUMERIC(4,1) DEFAULT 0,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Career goals table
CREATE TABLE IF NOT EXISTS career_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_role TEXT NOT NULL,
  timeline_months INTEGER,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  career_goal_id UUID REFERENCES career_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  roadmap_data JSONB NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Market insights table
CREATE TABLE IF NOT EXISTS market_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_title TEXT NOT NULL,
  company_name TEXT,
  salary_range JSONB,
  required_skills TEXT[],
  location TEXT,
  job_posting_url TEXT,
  source TEXT,
  scraped_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chatbot sessions table
CREATE TABLE IF NOT EXISTS chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_data JSONB NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  skills TEXT[],
  difficulty_level TEXT,
  duration_hours NUMERIC(5,1),
  price NUMERIC(10,2),
  rating NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own skills" ON skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills" ON skills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own career goals" ON career_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own career goals" ON career_goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own roadmaps" ON roadmaps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own roadmaps" ON roadmaps
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read market insights" ON market_insights
  FOR SELECT USING (true);

CREATE POLICY "Users can read own chatbot sessions" ON chatbot_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chatbot sessions" ON chatbot_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read courses" ON courses
  FOR SELECT USING (true);