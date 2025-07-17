
import { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormValues, PreviousEntryData } from "@/types/forms";

interface CompanyFieldsWithAutocompleteProps {
  form: UseFormReturn<FormValues>;
  previousEntries: PreviousEntryData;
  isDataLoading?: boolean;
  isEditMode?: boolean;
}

const CompanyFieldsWithAutocomplete: FC<CompanyFieldsWithAutocompleteProps> = ({ 
  form, 
  previousEntries, 
  isDataLoading = false,
  isEditMode = false
}) => {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [jobTitleOpen, setJobTitleOpen] = useState(false);
  
  console.log("CompanyFieldsWithAutocomplete rendered with:", { 
    previousEntries, 
    isDataLoading,
    companiesLength: previousEntries?.companies?.length,
    jobTitlesLength: previousEntries?.jobTitles?.length
  });

  // Only render autocomplete if data is fully loaded and valid
  const canRenderAutocomplete = !isDataLoading && 
    previousEntries && 
    Array.isArray(previousEntries.companies) && 
    Array.isArray(previousEntries.jobTitles);

  if (isDataLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Company</label>
          <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Job Title</label>
          <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  if (!canRenderAutocomplete) {
    console.warn("CompanyFieldsWithAutocomplete: Data not ready, falling back to simple inputs");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Company</FormLabel>
            <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={companyOpen}
                    className="w-full justify-between"
                  >
                    {field.value || "Select or enter company..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search companies..." 
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                  <CommandEmpty>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setCompanyOpen(false);
                        }}
                      >
                        Use current input
                      </Button>
                    </div>
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {previousEntries.companies.map((company) => (
                        <CommandItem
                          key={company}
                          value={company}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue);
                            setCompanyOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === company ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {company}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="jobTitle"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Job Title</FormLabel>
            <Popover open={jobTitleOpen} onOpenChange={setJobTitleOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={jobTitleOpen}
                    className="w-full justify-between"
                  >
                    {field.value || "Select or enter job title..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search job titles..." 
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                  <CommandEmpty>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setJobTitleOpen(false);
                        }}
                      >
                        Use current input
                      </Button>
                    </div>
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {previousEntries.jobTitles.map((jobTitle) => (
                        <CommandItem
                          key={jobTitle}
                          value={jobTitle}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue);
                            setJobTitleOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === jobTitle ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {jobTitle}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyFieldsWithAutocomplete;
