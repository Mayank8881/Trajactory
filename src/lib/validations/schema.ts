import * as z from 'zod';

// User Schema
export const userSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  job_title: z.string().max(100).optional(),
  experience_years: z.number().min(0).max(50).optional(),
  education_level: z.string().max(100).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Skill Schema
export const skillSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  proficiency_level: z.number().min(1).max(5),
  years_experience: z.number().min(0).max(50),
  last_used_at: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Career Goal Schema
export const careerGoalSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  target_role: z.string().min(1).max(100),
  timeline_months: z.number().min(1).max(120).optional(),
  status: z.enum(['in_progress', 'completed', 'on_hold', 'abandoned']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Roadmap Schema
export const roadmapSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  career_goal_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  roadmap_data: z.record(z.unknown()),
  status: z.enum(['active', 'completed', 'archived']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Market Insight Schema
export const marketInsightSchema = z.object({
  id: z.string().uuid(),
  role_title: z.string().min(1).max(200),
  company_name: z.string().max(200).optional(),
  salary_range: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().optional(),
  }).optional(),
  required_skills: z.array(z.string()),
  location: z.string().max(200).optional(),
  job_posting_url: z.string().url().optional(),
  source: z.string().max(100),
  scraped_at: z.string().datetime(),
  created_at: z.string().datetime(),
});

// Chatbot Session Schema
export const chatbotSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  session_data: z.record(z.unknown()),
  summary: z.string().max(500).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Course Schema
export const courseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  provider: z.string().min(1).max(100),
  url: z.string().url(),
  description: z.string().max(1000).optional(),
  skills: z.array(z.string()),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration_hours: z.number().min(0),
  price: z.number().min(0),
  rating: z.number().min(0).max(5).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});