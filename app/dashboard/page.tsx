 "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth/auth-context";
import { UserService, CareerGoal, Skill } from "@/src/lib/services/user-service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart4, 
  Briefcase, 
  Star, 
  GraduationCap, 
  Code,
  LineChart, 
  ChevronRight, 
  BookOpen, 
  TrendingUp,
  Lightbulb,
  Award,
  Target
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      loadDashboardData();
    }
  }, [user, loading, router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const userGoals = await UserService.getUserCareerGoals(user!.id);
      const userSkills = await UserService.getUserSkills(user!.id);
      
      setGoals(userGoals);
      setSkills(userSkills);
    } catch (error: any) {
      console.error("Error loading dashboard data:", error.message);
      toast({
        title: "Error loading dashboard data",
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

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}! Here's your career progress overview.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.filter(goal => goal.status === "in_progress").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Career objectives in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills.length}</div>
            <p className="text-xs text-muted-foreground">
              Professional skills in your profile
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Career Path Progress</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-xs text-muted-foreground">
              Based on your active goals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Professional certifications earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Progress */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Career Goals</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/goals">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Track progress on your career objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground mb-4">You haven't set any career goals yet</p>
                  <Button asChild>
                    <Link href="/goals/create">Set Your First Goal</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{goal.title}</h3>
                          <Badge className={`ml-2 ${getStatusColor(goal.status)}`}>
                            {formatStatusLabel(goal.status)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                          <Link href={`/goals/${goal.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Target: {goal.target_role}
                        {goal.timeline_months && ` (${goal.timeline_months} months)`}
                      </p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>40%</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                    </div>
                  ))}

                  {goals.length > 3 && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/goals">
                        View {goals.length - 3} More Goals
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Skills Overview</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile?tab=skills">
                    Manage
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Your top professional skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground mb-4">You haven't added any skills yet</p>
                  <Button asChild>
                    <Link href="/profile?tab=skills">Add Your Skills</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {skills.slice(0, 5).map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm">{skill.proficiency_level}/5</span>
                      </div>
                      <Progress value={skill.proficiency_level * 20} className="h-2" />
                    </div>
                  ))}

                  {skills.length > 5 && (
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link href="/profile?tab=skills">
                        View {skills.length - 5} More Skills
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations and Insights */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-[600px] mb-4">
          <TabsTrigger value="courses">
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart4 className="h-4 w-4 mr-2" />
            Market Insights
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Lightbulb className="h-4 w-4 mr-2" />
            AI Recommendations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Courses</CardTitle>
              <CardDescription>
                Courses to help you achieve your career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Data Science Fundamentals</CardTitle>
                    <CardDescription>Python for Data Analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">DataCamp</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Master Python and data analysis techniques for career advancement</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#">View Course</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Web Development Bootcamp</CardTitle>
                    <CardDescription>Full-Stack JavaScript</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Udemy</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Comprehensive course on modern web development</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#">View Course</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Product Management</CardTitle>
                    <CardDescription>Strategic Product Skills</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Coursera</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Learn product management from industry experts</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="#">View Course</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="w-full" asChild>
                <Link href="/courses">
                  Browse All Courses
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>
                Latest trends in your target industries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Salary Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span>Software Engineer</span>
                        <span className="font-medium">$105,000</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Data Scientist</span>
                        <span className="font-medium">$120,000</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Product Manager</span>
                        <span className="font-medium">$115,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>UX Designer</span>
                        <span className="font-medium">$95,000</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">In-Demand Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Cloud Computing</Badge>
                        <Badge variant="secondary">React.js</Badge>
                        <Badge variant="secondary">Machine Learning</Badge>
                        <Badge variant="secondary">Data Analysis</Badge>
                        <Badge variant="secondary">Python</Badge>
                        <Badge variant="secondary">UI/UX Design</Badge>
                        <Badge variant="secondary">Product Management</Badge>
                        <Badge variant="secondary">DevOps</Badge>
                        <Badge variant="secondary">SQL</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Industry Growth Outlook</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Artificial Intelligence</span>
                          <span className="text-green-600 font-medium">+35%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Cybersecurity</span>
                          <span className="text-green-600 font-medium">+28%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Cloud Services</span>
                          <span className="text-green-600 font-medium">+24%</span>
                        </div>
                        <Progress value={74} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>E-commerce</span>
                          <span className="text-green-600 font-medium">+18%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="w-full" asChild>
                <Link href="/market-insights">
                  Detailed Market Analysis
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>AI Career Recommendations</CardTitle>
              <CardDescription>
                Personalized advice based on your skills and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Focus on cloud computing skills</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your goal to become a Senior Software Engineer, acquiring AWS or Azure certification
                        would significantly increase your market value and open new opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Consider building a portfolio project</h3>
                      <p className="text-sm text-muted-foreground">
                        Creating a full-stack application that demonstrates your skills with React, Node.js, and 
                        database management would significantly strengthen your profile for senior positions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Network with industry professionals</h3>
                      <p className="text-sm text-muted-foreground">
                        Joining tech communities and attending industry events can help you build connections
                        that could lead to job opportunities matching your career goals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="w-full" asChild>
                <Link href="/chatbot">
                  Get Personalized Career Advice
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button asChild>
          <Link href="/goals/create">
            <Target className="mr-2 h-4 w-4" />
            Set New Career Goal
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/profile?tab=skills">
            <Star className="mr-2 h-4 w-4" />
            Update Skills
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/chatbot">
            <Lightbulb className="mr-2 h-4 w-4" />
            Career Assistant
          </Link>
        </Button>
      </div>
    </div>
  );
}