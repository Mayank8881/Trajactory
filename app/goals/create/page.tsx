"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth/auth-context";
import { UserService } from "@/src/lib/services/user-service";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const careerGoalFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(200),
  description: z.string().max(1000).optional(),
  target_role: z.string().min(1, { message: "Target role is required" }).max(100),
  timeline_months: z.number().int().min(1).max(120).optional(),
});

type CareerGoalFormData = z.infer<typeof careerGoalFormSchema>;

export default function CreateGoalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerGoalFormData>({
    resolver: zodResolver(careerGoalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      target_role: "",
      timeline_months: 12,
    }
  });

  const onSubmit = async (data: CareerGoalFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const newGoal = await UserService.createCareerGoal(user.id, {
        title: data.title,
        description: data.description,
        target_role: data.target_role,
        timeline_months: data.timeline_months,
      });

      if (newGoal) {
        toast({
          title: "Success",
          description: "Career goal created successfully!",
        });
        router.push("/goals");
      } else {
        throw new Error("Failed to create career goal");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">Loading...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
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
        <h1 className="text-3xl font-bold">Create New Career Goal</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Career Goal Details</CardTitle>
          <CardDescription>
            Define your career aspiration to get personalized guidance and skill recommendations.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="E.g., Become a Senior Developer"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_role">Target Role</Label>
              <Input
                id="target_role"
                placeholder="E.g., Data Scientist, Product Manager"
                {...register("target_role")}
              />
              {errors.target_role && (
                <p className="text-sm text-red-500">{errors.target_role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details about your career goal..."
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline_months">Timeline (Months)</Label>
              <Input
                id="timeline_months"
                type="number"
                min={1}
                max={120}
                {...register("timeline_months", { valueAsNumber: true })}
              />
              {errors.timeline_months && (
                <p className="text-sm text-red-500">{errors.timeline_months.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Goal"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 