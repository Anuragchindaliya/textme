import * as React from "react"
import { Check, LucideIcon, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { TaskType } from "../task.types"

interface DataTableFacetedFilter {
  selectedValues: string[]
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>
  tasks: TaskType[]
  // column?: Column<TData, TValue>
  title?: string
  options: {
    id: string
    label: string
    value: string
    icon?: LucideIcon
  }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  tasks,
  selectedValues,
  setSelectedStatus,
  title,
  options,
}: DataTableFacetedFilter) {
  // console.log("Selected values:", tasks);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.includes(option.id))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                // const isSelected = selectedValues.includes(option.value)
                const isSelected = selectedValues?.includes(option.id)
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedStatus(
                          selectedValues.filter((op) => op != option.id),
                        )
                      } else {
                        setSelectedStatus([...selectedValues, option.id])
                      }
                      // const filterValues = Array.from(selectedValues)
                      // console.log("Selected values after toggle:", isSelected,selectedValues)
                      // column?.setFilterValue(
                      //   filterValues.length ? filterValues : undefined,
                      // )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {tasks?.length > 0 && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {tasks.filter((op) => op.status === option.id).length}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    // onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
