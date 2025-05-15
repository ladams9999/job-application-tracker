
import { FC } from "react";
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/forms";

interface AnonymousToggleProps {
  form: UseFormReturn<FormValues>;
}

const AnonymousToggle: FC<AnonymousToggleProps> = ({ form }) => (
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
);

export default AnonymousToggle;
