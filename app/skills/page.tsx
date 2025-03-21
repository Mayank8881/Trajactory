"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth/auth-context";
import { supabase } from "@/src/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddSkillDialog } from "@/components/skills/add-skill-dialog";
import { Progress } from "@/components/ui/progress";
import { Clock, Plus, Star, Trash2 } from "lucide-react";

type Skill = {
  id: string;
  name: string;
  proficiency_level: number;
  years_experience: number;
};

export default function SkillsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      loadUserSkills();
    }
  }, [user, loading, router]);

  const loadUserSkills = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user!.id)
        .order("proficiency_level", { ascending: false });

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
          user_id: user!.id,
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Skills</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading skills...</div>
      ) : skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">No skills added yet</p>
              <p className="text-muted-foreground">
                Start by adding skills to showcase your expertise
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{skill.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-red-500 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm text-muted-foreground">Proficiency</div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < skill.proficiency_level
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Progress value={skill.proficiency_level * 20} className="h-2" />
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {skill.years_experience} {skill.years_experience === 1 ? "year" : "years"} of experience
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddSkillDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddSkill={handleAddSkill}
      />
    </div>
  );
} 