
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "@/types/forms";

interface SourceFieldProps {
  form: UseFormReturn<FormValues>;
  sources: string[];
}

const SourceField: FC<SourceFieldProps> = ({ form, sources }) => {
  return (
    <FormField
      control={form.control}
      name="source"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Source</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || "LinkedIn"}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="How did you find this job?" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {sources.map((source) => (
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
