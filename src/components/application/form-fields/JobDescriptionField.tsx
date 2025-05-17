
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormValues } from "@/types/forms";

interface JobDescriptionFieldProps {
  form: UseFormReturn<FormValues>;
}

const JobDescriptionField: FC<JobDescriptionFieldProps> = ({ form }) => {
  return (
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
  );
};

export default JobDescriptionField;
