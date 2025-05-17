
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "@/types/forms";

interface SourceFieldProps {
  form: UseFormReturn<FormValues>;
  sources: string[];
}

const SourceField: FC<SourceFieldProps> = ({ form, sources = [] }) => {
  // Ensure we always have default sources
  const availableSources = sources.length > 0 
    ? sources 
    : ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"];
  
  return (
    <FormField
      control={form.control}
      name="source"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Source</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || "LinkedIn"} // Ensure we have a default value
            defaultValue="LinkedIn"
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="How did you find this job?" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SourceField;
