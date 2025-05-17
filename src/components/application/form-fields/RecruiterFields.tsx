
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "@/types/forms";

interface RecruiterFieldsProps {
  form: UseFormReturn<FormValues>;
}

const RecruiterFields: FC<RecruiterFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="recruiter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recruiter Name</FormLabel>
            <FormControl>
              <Input placeholder="Name of the recruiter" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="recruitingFirm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recruiting Firm</FormLabel>
            <FormControl>
              <Input placeholder="Name of the recruiting firm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RecruiterFields;
