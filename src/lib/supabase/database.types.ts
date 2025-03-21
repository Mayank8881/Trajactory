export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          bio: string | null
          job_title: string | null
          experience_years: number | null
          education_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          bio?: string | null
          job_title?: string | null
          experience_years?: number | null
          education_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          bio?: string | null
          job_title?: string | null
          experience_years?: number | null
          education_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          proficiency_level: number
          years_experience: number
          last_used_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          proficiency_level: number
          years_experience?: number
          last_used_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          proficiency_level?: number
          years_experience?: number
          last_used_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      career_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_role: string
          timeline_months: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_role: string
          timeline_months?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_role?: string
          timeline_months?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      roadmaps: {
        Row: {
          id: string
          user_id: string
          career_goal_id: string
          title: string
          roadmap_data: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          career_goal_id: string
          title: string
          roadmap_data: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          career_goal_id?: string
          title?: string
          roadmap_data?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      market_insights: {
        Row: {
          id: string
          role_title: string
          company_name: string | null
          salary_range: Json | null
          required_skills: string[]
          location: string | null
          job_posting_url: string | null
          source: string
          scraped_at: string
          created_at: string
        }
        Insert: {
          id?: string
          role_title: string
          company_name?: string | null
          salary_range?: Json | null
          required_skills: string[]
          location?: string | null
          job_posting_url?: string | null
          source: string
          scraped_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          role_title?: string
          company_name?: string | null
          salary_range?: Json | null
          required_skills?: string[]
          location?: string | null
          job_posting_url?: string | null
          source?: string
          scraped_at?: string
          created_at?: string
        }
      }
      chatbot_sessions: {
        Row: {
          id: string
          user_id: string
          session_data: Json
          summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_data: Json
          summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_data?: Json
          summary?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          provider: string
          url: string
          description: string | null
          skills: string[]
          difficulty_level: string
          duration_hours: number
          price: number
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          provider: string
          url: string
          description?: string | null
          skills: string[]
          difficulty_level: string
          duration_hours: number
          price: number
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          provider?: string
          url?: string
          description?: string | null
          skills?: string[]
          difficulty_level?: string
          duration_hours?: number
          price?: number
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}