"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/src/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AddSkillDialog } from "./add-skill-dialog";

type Skill = {
  id: string;
  name: string;
  proficiency_level: number;
  years_experience: number;
};

export function UserSkillsSection({ userId }: { userId: string }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserSkills();
  }, [userId]);

  const loadUserSkills = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", userId)
        .order("name");

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      console.error("Error loading skills:", error.message);
      toast({
        title: "Error loading skills",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (newSkill: Omit<Skill, "id">) => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .insert({
          user_id: userId,
          name: newSkill.name,
          proficiency_level: newSkill.proficiency_level,
          years_experience: newSkill.years_experience,
        })
        .select();

      if (error) throw error;

      if (data) {
        setSkills((prev) => [...prev, data[0]]);
        toast({
          title: "Skill added",
          description: `${newSkill.name} has been added to your skills.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error adding skill",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skillId);

      if (error) throw error;

      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      toast({
        title: "Skill removed",
        description: "The skill has been removed from your profile.",
      });
    } catch (error: any) {
      toast({
        title: "Error removing skill",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Function to get color based on proficiency level
  const getProficiencyColor = (level: number) => {
    switch (level) {
      case 1: return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 2: return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case 3: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 4: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 5: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Skills</CardTitle>
          <CardDescription>
            Manage your professional skills and competencies
          </CardDescription>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading skills...</div>
        ) : skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven&apos;t added any skills yet.</p>
            <p className="mt-2">Add skills to showcase your expertise.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex flex-col">
                  <div className="font-medium">{skill.name}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getProficiencyColor(skill.proficiency_level)}>
                      Level {skill.proficiency_level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {skill.years_experience} {skill.years_experience === 1 ? "year" : "years"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <AddSkillDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddSkill={handleAddSkill}
      />
    </Card>
  );
} 