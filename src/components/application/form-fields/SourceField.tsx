
import { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormValues } from "@/types/forms";

interface SourceFieldProps {
  form: UseFormReturn<FormValues>;
  sources: string[];
}

const DEFAULT_SOURCES = ["LinkedIn", "Recruiter", "Job Board", "Company Website", "Other"];

const SourceField: FC<SourceFieldProps> = ({ form, sources = [] }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Ensure we always have valid sources and they're valid strings
  const availableSources = Array.isArray(sources) && sources.length > 0 
    ? sources.filter(source => source && typeof source === 'string')
    : DEFAULT_SOURCES;
  
  return (
    <FormField
      control={form.control}
      name="source"
      render={({ field }) => {
        const handleSelect = (selectedValue: string) => {
          if (selectedValue === "__ADD_NEW__") {
            // If "Add new" is selected, use the input value
            const newValue = inputValue.trim();
            if (newValue) {
              field.onChange(newValue);
            }
          } else {
            // Handle existing source selection
            field.onChange(selectedValue);
          }
          setOpen(false);
          setInputValue("");
        };

        // Filter sources based on input for display
        const filteredSources = availableSources.filter(source => 
          source.toLowerCase().includes(inputValue.toLowerCase())
        );

        // Check if input matches any existing source (case-insensitive)
        const exactMatch = availableSources.find(source => 
          source.toLowerCase() === inputValue.toLowerCase()
        );

        const showAddOption = inputValue.trim() && !exactMatch;

        return (
          <FormItem>
            <FormLabel>Source</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value || "How did you find this job?"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Search or type new source..." 
                    value={inputValue}
                    onValueChange={setInputValue}
                  />
                  <CommandList>
                    <CommandGroup>
                      {filteredSources.map((source) => (
                        <CommandItem
                          key={source}
                          value={source}
                          onSelect={(value) => handleSelect(value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === source ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {source}
                        </CommandItem>
                      ))}
                      {showAddOption && (
                        <CommandItem
                          value="__ADD_NEW__"
                          onSelect={(value) => handleSelect(value)}
                          className="flex items-center gap-2 text-blue-600"
                        >
                          <Plus className="h-4 w-4" />
                          Add "{inputValue.trim()}"
                        </CommandItem>
                      )}
                    </CommandGroup>
                    {!filteredSources.length && !showAddOption && inputValue && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SourceField;
