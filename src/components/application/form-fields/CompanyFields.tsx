
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues, PreviousEntryData } from "@/types/forms";
import AnonymousToggle from "../AnonymousToggle";

interface CompanyFieldsProps {
  form: UseFormReturn<FormValues>;
  previousEntries: PreviousEntryData;
  isEditMode?: boolean;
}

const CompanyFields: FC<CompanyFieldsProps> = ({ form, previousEntries, isEditMode = false }) => {
  console.log("CompanyFields rendered with previousEntries:", previousEntries);
  
  return (
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
                  placeholder="Enter company name..."
                  {...field}
                  disabled={form.watch("isAnonymous")}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isEditMode && <AnonymousToggle form={form} />}
      </div>
      
      <FormField
        control={form.control}
        name="jobTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter job title..."
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyFields;
