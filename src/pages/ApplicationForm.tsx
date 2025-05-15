
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addApplication, updateApplication, getAllApplications } from "@/services/applicationService";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatus, JobApplication } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  company: z.string().min(1, { message: "Company name is required" }),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  jobDescription: z.string(),
  dateApplied: z.date({
    required_error: "Date applied is required",
  }),
  status: z.enum(["applied", "interview", "offer", "rejected", "withdrawn"] as const),
  notes: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const ApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      jobTitle: "",
      jobDescription: "",
      status: "applied" as ApplicationStatus,
      notes: "",
      isAnonymous: false,
    },
  });

  // Load application data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      const applications = getAllApplications();
      const application = applications.find(app => app.id === id);
      
      if (application) {
        // Check if it's an anonymous application
        const isAnonymous = application.company === "Anonymous";
        
        form.reset({
          company: application.company,
          jobTitle: application.jobTitle,
          jobDescription: application.jobDescription,
          dateApplied: new Date(application.dateApplied),
          status: application.status,
          notes: application.notes || "",
          isAnonymous: isAnonymous,
        });
      } else {
        toast.error("Application not found");
        navigate("/applications");
      }
      setIsLoading(false);
    }
  }, [id, isEditMode, form, navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // If anonymous is selected, use "Anonymous" as the company name
      const companyName = data.isAnonymous ? "Anonymous" : data.company;
      
      if (isEditMode && id) {
        await updateApplication({
          id,
          company: companyName,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          dateApplied: data.dateApplied.toISOString(),
          status: data.status,
          notes: data.notes,
          createdAt: "", // These will be preserved by updateApplication
          updatedAt: "",
        });
        toast.success("Application successfully updated!");
      } else {
        await addApplication({
          company: companyName,
          jobTitle: data.jobTitle,
          jobDescription: data.jobDescription,
          dateApplied: data.dateApplied.toISOString(),
          status: data.status,
          notes: data.notes,
        });
        toast.success("Application successfully added!");
      }
      
      navigate("/applications");
    } catch (error) {
      console.error("Error saving application:", error);
      toast.error(isEditMode ? "Failed to update application" : "Failed to add application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {isEditMode ? "Edit Application" : "Add New Application"}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            {isEditMode 
              ? "Update the details of your job application" 
              : "Enter the details of the job you applied for"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Company name" 
                            {...field} 
                            disabled={form.watch("isAnonymous")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              // If checked, set company to "Anonymous", otherwise clear it
                              if (checked) {
                                form.setValue("company", "Anonymous");
                              } else {
                                form.setValue("company", "");
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Anonymous Application</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Hide the company name in your records
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the job description here"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateApplied"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Applied</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting 
                    ? (isEditMode ? "Updating..." : "Submitting...") 
                    : (isEditMode ? "Update Application" : "Save Application")
                  }
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;
