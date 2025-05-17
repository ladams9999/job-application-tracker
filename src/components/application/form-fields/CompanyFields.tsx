
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { FormValues, PreviousEntryData } from "@/types/forms";
import AnonymousToggle from "../AnonymousToggle";

interface CompanyFieldsProps {
  form: UseFormReturn<FormValues>;
  previousEntries: PreviousEntryData;
}

const CompanyFields: FC<CompanyFieldsProps> = ({ form, previousEntries }) => {
  const companies = previousEntries?.companies || [];
  
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
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={form.watch("isAnonymous")}
                      >
                        {field.value || "Select company..."}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search company..." />
                      <CommandEmpty>No company found.</CommandEmpty>
                      {companies.length > 0 ? (
                        <CommandGroup>
                          {companies.map((company) => (
                            <CommandItem
                              key={company}
                              value={company}
                              onSelect={() => {
                                form.setValue("company", company);
                              }}
                            >
                              {company}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <div className="py-2 px-2 text-sm text-muted-foreground">No previous companies</div>
                      )}
                    </Command>
                    <Input
                      placeholder="Or enter a new company"
                      value={field.value}
                      onChange={field.onChange}
                      className="border-t"
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <AnonymousToggle form={form} />
      </div>
      
      <FormField
        control={form.control}
        name="jobTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value || "Select job title..."}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search job title..." />
                    <CommandEmpty>No job title found.</CommandEmpty>
                    {previousEntries.jobTitles.length > 0 ? (
                      <CommandGroup>
                        {previousEntries.jobTitles.map((title) => (
                          <CommandItem
                            key={title}
                            value={title}
                            onSelect={() => {
                              form.setValue("jobTitle", title);
                            }}
                          >
                            {title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <div className="py-2 px-2 text-sm text-muted-foreground">No previous job titles</div>
                    )}
                  </Command>
                  <Input
                    placeholder="Or enter a new job title"
                    value={field.value}
                    onChange={field.onChange}
                    className="border-t"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyFields;
