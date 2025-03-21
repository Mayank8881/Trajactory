"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth/auth-context";
import { UserService, CareerGoal, Skill } from "@/src/lib/services/user-service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft, Target, Calendar, CheckCircle, Clock, AlertCircle, Trash2, Edit, BookOpen, TrendingUp, Lightbulb } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase/client";

export default function GoalDetailPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [goal, setGoal] = useState<CareerGoal | null>(null);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && params.id) {
      loadGoalData();
    }
  }, [user, loading, params.id, router]);

  const loadGoalData = async () => {
    setIsLoading(true);
    try {
      // Fetch the goal details
      const { data, error } = await supabase
        .from("career_goals")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user!.id)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Goal not found",
          description: "The career goal you're looking for doesn't exist or you don't have access to it.",
          variant: "destructive",
        });
        router.push("/goals");
        return;
      }

      setGoal(data as CareerGoal);

      // Fetch user skills
      const skills = await UserService.getUserSkills(user!.id);
      setUserSkills(skills);
    } catch (error: any) {
      console.error("Error loading goal data:", error.message);
      toast({
        title: "Error loading goal data",
        description: error.message,
        variant: "destructive",
      });
      router.push("/goals");
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoalStatus = async (newStatus: string) => {
    if (!goal) return;

    setStatusUpdateLoading(true);
    try {
      const { error } = await supabase
        .from("career_goals")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", goal.id);

      if (error) throw error;

      setGoal({ ...goal, status: newStatus });
      
      toast({
        title: "Status updated",
        description: `Goal status changed to ${formatStatusLabel(newStatus)}.`,
      });
    } catch (error: any) {
      console.error("Error updating goal status:", error.message);
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const deleteGoal = async () => {
    if (!goal) return;

    try {
      const { error } = await supabase
        .from("career_goals")
        .delete()
        .eq("id", goal.id);

      if (error) throw error;

      toast({
        title: "Goal deleted",
        description: "The career goal has been deleted successfully.",
      });
      
      router.push("/goals");
    } catch (error: any) {
      console.error("Error deleting goal:", error.message);
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "abandoned":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Clock className="h-4 w-4 mr-1" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "on_hold":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "abandoned":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "on_hold":
        return "On Hold";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
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
          <Link href="/goals">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to goals
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main goal info */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <CardTitle className="text-2xl">{goal.title}</CardTitle>
                  <Badge className={`mt-2 ${getStatusColor(goal.status)}`}>
                    <div className="flex items-center">
                      {getStatusIcon(goal.status)}
                      {formatStatusLabel(goal.status)}
                    </div>
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/goals/${goal.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the career goal and all associated data.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteGoal} className="bg-red-600">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {goal.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Target Role</h3>
                  </div>
                  <p>{goal.target_role}</p>
                </div>

                {goal.timeline_months && (
                  <div className="bg-secondary/30 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Timeline</h3>
                    </div>
                    <p>
                      {goal.timeline_months} {goal.timeline_months === 1 ? "month" : "months"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Current Status</h3>
                <div className="flex items-center">
                  <Select
                    defaultValue={goal.status}
                    onValueChange={updateGoalStatus}
                    disabled={statusUpdateLoading}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="abandoned">Abandoned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Your skills match</span>
                  <span className="font-medium">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Career path completion</span>
                  <span className="font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              <Button className="w-full" asChild>
                <Link href={`/goals/${goal.id}/roadmap`}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Career Roadmap
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
              <CardDescription>
                Based on your skills and career goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">Consider learning Python for data analysis skills needed in Product Management</p>
                </div>
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm">Join product management communities to build your network</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/goals/${goal.id}/recommendations`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Learning Paths
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Skills Analysis</h2>
        <Tabs defaultValue="current-skills">
          <TabsList className="mb-4">
            <TabsTrigger value="current-skills">Your Skills</TabsTrigger>
            <TabsTrigger value="required-skills">Required Skills</TabsTrigger>
            <TabsTrigger value="skill-gap">Skill Gap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current-skills">
            {userSkills.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">You haven't added any skills yet.</p>
                  <Button className="mt-4" asChild>
                    <Link href="/profile?tab=skills">
                      Add Your Skills
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userSkills.map((skill) => (
                  <Card key={skill.id} className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Proficiency</span>
                            <span>{skill.proficiency_level}/5</span>
                          </div>
                          <Progress value={skill.proficiency_level * 20} className="h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {skill.years_experience} {skill.years_experience === 1 ? "year" : "years"} of experience
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="required-skills">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  AI analysis of required skills for {goal.target_role} role is in progress.
                </p>
                <Button className="mt-4" disabled>
                  Analyzing Required Skills...
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skill-gap">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Your personalized skill gap analysis is being generated.
                </p>
                <Button className="mt-4" disabled>
                  Generating Skill Gap Analysis...
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 