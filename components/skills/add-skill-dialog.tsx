"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { skillSchema } from "@/src/lib/validations/schema";
import { commonSkills } from "./skill-data";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Extract only the fields we need for form submission
const addSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiency_level: z.number().min(1).max(5),
  years_experience: z.number().min(0),
});

type AddSkillFormData = z.infer<typeof addSkillSchema>;

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSkill: (skill: AddSkillFormData) => void;
}

export function AddSkillDialog({ open, onOpenChange, onAddSkill }: AddSkillDialogProps) {
  const [openCombobox, setOpenCombobox] = useState(false);
  const [customSkill, setCustomSkill] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddSkillFormData>({
    resolver: zodResolver(addSkillSchema),
    defaultValues: {
      name: "",
      proficiency_level: 3,
      years_experience: 0,
    },
  });

  const selectedSkill = watch("name");

  const onSubmit = async (data: AddSkillFormData) => {
    await onAddSkill(data);
    reset();
    onOpenChange(false);
  };

  const handleSkillSelect = (value: string) => {
    setValue("name", value);
    setOpenCombobox(false);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogDescription>
            Add a new skill to your profile. Select from common skills or enter a custom one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="skill">Skill Name</Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between"
                  >
                    {selectedSkill || "Select a skill..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search skills..."
                      onValueChange={(value) => setCustomSkill(value)}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {customSkill ? (
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleSkillSelect(customSkill)}
                          >
                            Add "{customSkill}"
                          </Button>
                        ) : (
                          "No skills found."
                        )}
                      </CommandEmpty>
                      <CommandGroup>
                        {commonSkills.map((skill) => (
                          <CommandItem
                            key={skill}
                            value={skill}
                            onSelect={handleSkillSelect}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSkill === skill ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {skill}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <input type="hidden" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="proficiency_level">Proficiency Level</Label>
              <Select
                defaultValue="3"
                onValueChange={(value) => setValue("proficiency_level", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Beginner</SelectItem>
                  <SelectItem value="2">2 - Elementary</SelectItem>
                  <SelectItem value="3">3 - Intermediate</SelectItem>
                  <SelectItem value="4">4 - Advanced</SelectItem>
                  <SelectItem value="5">5 - Expert</SelectItem>
                </SelectContent>
              </Select>
              {errors.proficiency_level && (
                <p className="text-sm text-red-500">{errors.proficiency_level.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                {...register("years_experience", { valueAsNumber: true })}
              />
              {errors.years_experience && (
                <p className="text-sm text-red-500">{errors.years_experience.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 