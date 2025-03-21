"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth/auth-context";
import { UserService, CareerGoal } from "@/src/lib/services/user-service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  BookOpen, 
  Briefcase, 
  Award, 
  GraduationCap,
  CircleCheck,
  Circle
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase/client";

// Define a milestone type for the roadmap
type Milestone = {
  id: string;
  title: string;
  description: string;
  type: "skill" | "course" | "certification" | "experience";
  completed: boolean;
  order: number;
};

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [goal, setGoal] = useState<CareerGoal | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && params.id) {
      loadRoadmapData();
    }
  }, [user, loading, params.id, router]);

  const loadRoadmapData = async () => {
    setIsLoading(true);
    try {
      // Fetch the goal details
      const goalData = await UserService.getCareerGoalById(user!.id, params.id);
      
      if (!goalData) {
        toast({
          title: "Goal not found",
          description: "The career goal you're looking for doesn't exist or you don't have access to it.",
          variant: "destructive",
        });
        router.push("/goals");
        return;
      }

      setGoal(goalData);

      // Fetch the roadmap data, or generate a mock one for demonstration
      // In a real implementation, you would fetch real roadmap data from supabase
      
      // Check if the goal has an associated roadmap
      const { data: roadmapData, error } = await supabase
        .from("roadmaps")
        .select("*")
        .eq("career_goal_id", params.id)
        .eq("user_id", user!.id)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
        console.error("Error fetching roadmap:", error);
        toast({
          title: "Error loading roadmap data",
          description: error.message,
          variant: "destructive",
        });
      }

      if (roadmapData) {
        // Parse the roadmap data
        const parsedMilestones = roadmapData.roadmap_data.milestones as Milestone[];
        setMilestones(parsedMilestones);
      } else {
        // Generate mock milestones for demonstration
        const mockMilestones = generateMockMilestones(goalData.target_role);
        setMilestones(mockMilestones);
        
        // Create a new roadmap in the database
        const { error: insertError } = await supabase
          .from("roadmaps")
          .insert({
            user_id: user!.id,
            career_goal_id: params.id,
            title: `Roadmap for ${goalData.title}`,
            roadmap_data: { milestones: mockMilestones },
            status: "active"
          });

        if (insertError) {
          console.error("Error creating roadmap:", insertError);
        }
      }
    } catch (error: any) {
      console.error("Error loading goal data:", error.message);
      toast({
        title: "Error loading roadmap",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockMilestones = (targetRole: string): Milestone[] => {
    // Generate different milestones based on the target role
    let milestones: Milestone[] = [];
    
    if (targetRole.toLowerCase().includes("data scientist")) {
      milestones = [
        {
          id: "1",
          title: "Learn Python Fundamentals",
          description: "Master Python basics including data structures, functions, and file operations",
          type: "skill",
          completed: true,
          order: 1
        },
        {
          id: "2",
          title: "Data Analysis with Pandas",
          description: "Learn to manipulate and analyze data using Pandas library",
          type: "skill",
          completed: false,
          order: 2
        },
        {
          id: "3",
          title: "Introduction to Machine Learning with Scikit-Learn",
          description: "Understand ML algorithms and implement them using Scikit-Learn",
          type: "course",
          completed: false,
          order: 3
        },
        {
          id: "4",
          title: "Complete a Kaggle Competition",
          description: "Apply your skills in a real-world data science competition",
          type: "experience",
          completed: false,
          order: 4
        },
        {
          id: "5",
          title: "Deep Learning Specialization",
          description: "Master neural networks and deep learning techniques",
          type: "certification",
          completed: false,
          order: 5
        },
        {
          id: "6",
          title: "Build a Portfolio Project",
          description: "Create an end-to-end data science project to showcase your skills",
          type: "experience",
          completed: false,
          order: 6
        }
      ];
    } else if (targetRole.toLowerCase().includes("software engineer") || targetRole.toLowerCase().includes("developer")) {
      milestones = [
        {
          id: "1",
          title: "Master Core Programming Language",
          description: "Develop proficiency in JavaScript/TypeScript, Python, or Java",
          type: "skill",
          completed: true,
          order: 1
        },
        {
          id: "2",
          title: "Learn Data Structures & Algorithms",
          description: "Study fundamental CS concepts for efficient problem-solving",
          type: "skill",
          completed: false,
          order: 2
        },
        {
          id: "3",
          title: "Web Development Framework",
          description: "Master React, Angular, or Vue for frontend development",
          type: "course",
          completed: false,
          order: 3
        },
        {
          id: "4",
          title: "Contribute to Open Source",
          description: "Make meaningful contributions to GitHub projects",
          type: "experience",
          completed: false,
          order: 4
        },
        {
          id: "5",
          title: "Cloud Certification",
          description: "Earn AWS, Azure, or GCP certification",
          type: "certification",
          completed: false,
          order: 5
        },
        {
          id: "6",
          title: "Build a Full-Stack Application",
          description: "Create an end-to-end application demonstrating your skills",
          type: "experience",
          completed: false,
          order: 6
        }
      ];
    } else if (targetRole.toLowerCase().includes("product manager")) {
      milestones = [
        {
          id: "1",
          title: "Product Management Fundamentals",
          description: "Learn core product management principles and methodologies",
          type: "skill",
          completed: true,
          order: 1
        },
        {
          id: "2",
          title: "User Research & Customer Development",
          description: "Master techniques for understanding user needs and problems",
          type: "skill",
          completed: false,
          order: 2
        },
        {
          id: "3",
          title: "Agile & Scrum Certification",
          description: "Become certified in agile product development methodologies",
          type: "certification",
          completed: false,
          order: 3
        },
        {
          id: "4",
          title: "Product Analytics",
          description: "Learn to use data to drive product decisions",
          type: "course",
          completed: false,
          order: 4
        },
        {
          id: "5",
          title: "Product Launch Experience",
          description: "Lead or participate in a product launch from concept to market",
          type: "experience",
          completed: false,
          order: 5
        },
        {
          id: "6",
          title: "Product Management Case Study",
          description: "Create a detailed case study of a product improvement or launch",
          type: "experience",
          completed: false,
          order: 6
        }
      ];
    } else {
      // Default milestones for any career
      milestones = [
        {
          id: "1",
          title: "Core Skills Development",
          description: `Develop the foundational skills required for ${targetRole}`,
          type: "skill",
          completed: true,
          order: 1
        },
        {
          id: "2",
          title: "Professional Certification",
          description: `Obtain industry-recognized certification relevant to ${targetRole}`,
          type: "certification",
          completed: false,
          order: 2
        },
        {
          id: "3",
          title: "Advanced Training",
          description: "Complete specialized courses to deepen expertise",
          type: "course",
          completed: false,
          order: 3
        },
        {
          id: "4",
          title: "Practical Experience",
          description: "Gain hands-on experience through projects or internships",
          type: "experience",
          completed: false,
          order: 4
        },
        {
          id: "5",
          title: "Leadership Development",
          description: "Develop management and leadership skills",
          type: "skill",
          completed: false,
          order: 5
        },
        {
          id: "6",
          title: "Portfolio Project",
          description: "Create a showcase project demonstrating all your skills",
          type: "experience",
          completed: false,
          order: 6
        }
      ];
    }
    
    return milestones;
  };

  const toggleMilestoneCompletion = async (milestoneId: string) => {
    // Update the milestone completion status
    const updatedMilestones = milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        return { ...milestone, completed: !milestone.completed };
      }
      return milestone;
    });
    
    setMilestones(updatedMilestones);
    
    // Update the roadmap in the database
    try {
      const { error } = await supabase
        .from("roadmaps")
        .update({
          roadmap_data: { milestones: updatedMilestones },
          updated_at: new Date().toISOString()
        })
        .eq("career_goal_id", params.id)
        .eq("user_id", user!.id);
      
      if (error) throw error;
      
      toast({
        title: "Progress updated",
        description: "Your roadmap progress has been saved.",
      });
    } catch (error: any) {
      console.error("Error updating roadmap:", error.message);
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "skill":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "course":
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "certification":
        return <Award className="h-5 w-5 text-purple-500" />;
      case "experience":
        return <Briefcase className="h-5 w-5 text-green-500" />;
      default:
        return <GraduationCap className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMilestoneTypeLabel = (type: string) => {
    switch (type) {
      case "skill":
        return "Skill Development";
      case "course":
        return "Course";
      case "certification":
        return "Certification";
      case "experience":
        return "Practical Experience";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getProgress = () => {
    if (milestones.length === 0) return 0;
    const completedCount = milestones.filter(m => m.completed).length;
    return Math.round((completedCount / milestones.length) * 100);
  };

  if (loading || isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">Loading...</div>;
  }

  if (!goal) {
    return <div className="text-center py-10">Goal not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/goals/${params.id}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to goal
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Career Roadmap</h1>
        <p className="text-muted-foreground mb-4">
          Your personalized path to becoming a {goal.target_role}
        </p>
        
        <div className="bg-primary/10 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Overall Progress</h2>
            <span className="font-medium">{getProgress()}%</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500" 
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative">
            {/* Connecting line */}
            {index < milestones.length - 1 && (
              <div className="absolute left-[22px] top-[60px] w-0.5 bg-muted h-[calc(100%+32px)]"></div>
            )}
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 z-10">
                <div 
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 ${
                    milestone.completed 
                    ? "border-primary bg-primary/10" 
                    : "border-muted bg-background"
                  }`}
                >
                  {milestone.completed ? (
                    <CircleCheck className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              <Card className={`flex-grow transition-colors ${
                milestone.completed ? "border-primary/20 bg-primary/5" : ""
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      <div className="flex items-center mt-1">
                        {getMilestoneIcon(milestone.type)}
                        <CardDescription className="ml-1">
                          {getMilestoneTypeLabel(milestone.type)}
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant={milestone.completed ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleMilestoneCompletion(milestone.id)}
                    >
                      {milestone.completed ? "Mark Incomplete" : "Mark Complete"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{milestone.description}</p>
                  
                  {milestone.type === "course" && (
                    <Button variant="link" asChild className="p-0 h-auto mt-2">
                      <Link href="/courses">Find recommended courses</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {/* Final item - target role */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 z-10">
            <div className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-primary bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <Card className="flex-grow border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Achievement Unlocked: {goal.target_role}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete all the milestones above to achieve your career goal!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-12 flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/goals/${params.id}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Goal
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href={`/goals/${params.id}/recommendations`}>
            Course Recommendations
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
} 