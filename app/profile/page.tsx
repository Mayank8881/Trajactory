"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/src/lib/auth/auth-context";
import { supabase } from "@/src/lib/supabase/client";
import { UserSkillsSection } from "@/components/skills/user-skills-section";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    full_name: "",
    bio: "",
    job_title: "",
    experience_years: 0,
    education_level: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      loadUserProfile();
    }
  }, [user, loading, router]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfileData({
          full_name: data.full_name || "",
          bio: data.bio || "",
          job_title: data.job_title || "",
          experience_years: data.experience_years || 0,
          education_level: data.education_level || ""
        });
      }
    } catch (error: any) {
      console.error("Error loading profile:", error.message);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: profileData.full_name,
          bio: profileData.bio,
          job_title: profileData.job_title,
          experience_years: profileData.experience_years,
          education_level: profileData.education_level,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user!.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === "experience_years" ? parseInt(value) || 0 : value,
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and professional information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_title">Current Job Title</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={profileData.job_title}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  max="50"
                  value={profileData.experience_years}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education_level">Education Level</Label>
                <Input
                  id="education_level"
                  name="education_level"
                  value={profileData.education_level}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor's, Master's, PhD"
                />
              </div>
              <Button 
                onClick={handleProfileUpdate} 
                disabled={isLoading}
                className="mt-4"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          {user && <UserSkillsSection userId={user.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
} 