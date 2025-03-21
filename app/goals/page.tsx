"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth/auth-context";
import { UserService, CareerGoal } from "@/src/lib/services/user-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Target, Calendar, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function GoalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      loadCareerGoals();
    }
  }, [user, loading, router]);

  const loadCareerGoals = async () => {
    setIsLoading(true);
    try {
      const goalsData = await UserService.getUserCareerGoals(user!.id);
      setGoals(goalsData);
    } catch (error: any) {
      console.error("Error loading career goals:", error.message);
      toast({
        title: "Error loading career goals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Career Goals</h1>
        <Button asChild>
          <Link href="/goals/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Goal
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Goals</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {["all", "in_progress", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {isLoading ? (
              <div className="text-center py-10">Loading career goals...</div>
            ) : goals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-10">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">No career goals yet</p>
                    <p className="text-muted-foreground">
                      Define your career aspirations to get personalized guidance
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/goals/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Goal
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals
                  .filter((goal) => tab === "all" || goal.status === tab)
                  .map((goal) => (
                    <Card key={goal.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{goal.title}</CardTitle>
                          <Badge className={getStatusColor(goal.status)}>
                            <div className="flex items-center">
                              {getStatusIcon(goal.status)}
                              {formatStatusLabel(goal.status)}
                            </div>
                          </Badge>
                        </div>
                        <CardDescription>
                          {goal.description || "No description provided"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{goal.target_role}</span>
                        </div>
                        {goal.timeline_months && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {goal.timeline_months}{" "}
                              {goal.timeline_months === 1 ? "month" : "months"} timeline
                            </span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/goals/${goal.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 