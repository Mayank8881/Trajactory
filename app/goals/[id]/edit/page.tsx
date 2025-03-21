"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/src/lib/supabase/client";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  target_role: z.string().min(2, "Target role is required"),
  timeline_months: z.coerce.number().min(1, "Timeline must be at least 1 month").max(60, "Timeline cannot exceed 60 months"),
  status: z.enum(["in_progress", "completed", "on_hold", "abandoned"])
});

type FormValues = z.infer<typeof formSchema>;

export default function EditGoalPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      target_role: "",
      timeline_months: 6,
      status: "in_progress"
    }
  });

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

      // Set form values
      form.reset({
        title: data.title,
        description: data.description || "",
        target_role: data.target_role,
        timeline_months: data.timeline_months,
        status: data.status
      });
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

  const onSubmit = async (values: FormValues) => {
    setSubmitLoading(true);
    
    try {
      // Update the goal
      const { error } = await supabase
        .from("career_goals")
        .update({
          title: values.title,
          description: values.description,
          target_role: values.target_role,
          timeline_months: values.timeline_months,
          status: values.status,
          updated_at: new Date().toISOString()
        })
        .eq("id", params.id)
        .eq("user_id", user!.id);

      if (error) throw error;

      toast({
        title: "Goal updated",
        description: "Your career goal has been updated successfully.",
      });
      
      router.push(`/goals/${params.id}`);
    } catch (error: any) {
      console.error("Error updating goal:", error.message);
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading || isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">Loading...</div>;
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

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Career Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Become a Senior Data Scientist" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear and specific title for your career goal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your goal in more detail..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Data Scientist" {...field} />
                    </FormControl>
                    <FormDescription>
                      The specific job title or role you are aiming for
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeline_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline (months)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={60} {...field} />
                    </FormControl>
                    <FormDescription>
                      Realistic timeframe to achieve this goal (1-60 months)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="abandoned">Abandoned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  asChild
                >
                  <Link href={`/goals/${params.id}`}>Cancel</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitLoading}
                >
                  {submitLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 