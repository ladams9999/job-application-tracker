
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormValues } from "@/types/forms";

interface NotesFieldProps {
  form: UseFormReturn<FormValues>;
}

const NotesField: FC<NotesFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Any additional notes"
              className="min-h-[120px]"
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            Add any additional information about this job application
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesField;
