"use client";

import { supabase } from "../supabase/client";
import type { Database } from "../supabase/database.types";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type CareerGoal = Database["public"]["Tables"]["career_goals"]["Row"];

/**
 * Service for managing user data and interactions
 */
export const UserService = {
  /**
   * Get a user by their ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  },

  /**
   * Update a user's profile information
   */
  async updateUserProfile(userId: string, userData: Partial<User>): Promise<boolean> {
    const { error } = await supabase
      .from("users")
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user profile:", error);
      return false;
    }

    return true;
  },

  /**
   * Get all skills for a user
   */
  async getUserSkills(userId: string): Promise<Skill[]> {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", userId)
      .order("name");

    if (error) {
      console.error("Error fetching user skills:", error);
      return [];
    }

    return data || [];
  },

  /**
   * Add a new skill for a user
   */
  async addUserSkill(
    userId: string, 
    skillData: { name: string; proficiency_level: number; years_experience: number }
  ): Promise<Skill | null> {
    const { data, error } = await supabase
      .from("skills")
      .insert({
        user_id: userId,
        name: skillData.name,
        proficiency_level: skillData.proficiency_level,
        years_experience: skillData.years_experience,
        last_used_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error adding user skill:", error);
      return null;
    }

    return data[0] || null;
  },

  /**
   * Delete a skill
   */
  async deleteUserSkill(skillId: string): Promise<boolean> {
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", skillId);

    if (error) {
      console.error("Error deleting skill:", error);
      return false;
    }

    return true;
  },

  /**
   * Get user's career goals
   */
  async getUserCareerGoals(userId: string): Promise<CareerGoal[]> {
    const { data, error } = await supabase
      .from("career_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching career goals:", error);
      return [];
    }

    return data || [];
  },

  /**
   * Get a specific career goal by ID
   */
  async getCareerGoalById(userId: string, goalId: string): Promise<CareerGoal | null> {
    const { data, error } = await supabase
      .from("career_goals")
      .select("*")
      .eq("id", goalId)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching career goal:", error);
      return null;
    }

    return data;
  },

  /**
   * Create a new career goal
   */
  async createCareerGoal(
    userId: string,
    goalData: {
      title: string;
      description?: string;
      target_role: string;
      timeline_months?: number;
    }
  ): Promise<CareerGoal | null> {
    const { data, error } = await supabase
      .from("career_goals")
      .insert({
        user_id: userId,
        title: goalData.title,
        description: goalData.description || null,
        target_role: goalData.target_role,
        timeline_months: goalData.timeline_months || null,
        status: "in_progress",
      })
      .select();

    if (error) {
      console.error("Error creating career goal:", error);
      return null;
    }

    return data[0] || null;
  },

  /**
   * Update an existing career goal
   */
  async updateCareerGoal(
    userId: string,
    goalId: string,
    goalData: {
      title?: string;
      description?: string | null;
      target_role?: string;
      timeline_months?: number | null;
      status?: string;
    }
  ): Promise<CareerGoal | null> {
    const { data, error } = await supabase
      .from("career_goals")
      .update({
        ...goalData,
        updated_at: new Date().toISOString()
      })
      .eq("id", goalId)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Error updating career goal:", error);
      return null;
    }

    return data[0] || null;
  },

  /**
   * Update the status of a career goal
   */
  async updateGoalStatus(
    userId: string,
    goalId: string,
    status: string
  ): Promise<boolean> {
    const { error } = await supabase
      .from("career_goals")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", goalId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating goal status:", error);
      return false;
    }

    return true;
  },

  /**
   * Delete a career goal
   */
  async deleteCareerGoal(userId: string, goalId: string): Promise<boolean> {
    const { error } = await supabase
      .from("career_goals")
      .delete()
      .eq("id", goalId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting career goal:", error);
      return false;
    }

    return true;
  },

  /**
   * Get skill gap analysis based on career goal and current skills
   * This would typically integrate with an AI service
   */
  async getSkillGapAnalysis(userId: string, goalId: string) {
    // 1. Get user's current skills
    const userSkills = await this.getUserSkills(userId);
    
    // 2. Get career goal details
    const { data: goalData } = await supabase
      .from("career_goals")
      .select("*")
      .eq("id", goalId)
      .single();
    
    if (!goalData) {
      return null;
    }
    
    // 3. Get market insights for the target role
    const { data: marketData } = await supabase
      .from("market_insights")
      .select("*")
      .ilike("role_title", `%${goalData.target_role}%`)
      .limit(5);
    
    // 4. In a real implementation, this would call an AI service
    // For now, we'll return a placeholder analysis
    return {
      currentSkills: userSkills,
      targetRole: goalData.target_role,
      marketInsights: marketData || [],
      missingSkills: [],  // Would be populated by AI analysis
      recommendations: [] // Would be populated by AI analysis
    };
  }
}; 