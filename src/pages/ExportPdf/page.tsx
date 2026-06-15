import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  useCreateDrawFileQuery,
  useGetDrawFileDataQuery,
  usePostDrawFileContentMutation,
} from "@/features/draw/drawAPI"
import { useToast } from "@/components/ui/use-toast"
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"
import PdfDocument from "./PdfDocument"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2, FileText, Check } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import ToolLayout from "@/components/ToolLayout"
import { theme } from "@/lib/theme"

const formSchema = z.object({
  invoiceNumber: z.string().nonempty("Invoice number is required"),
  date: z.date(),
  dueDate: z.date(),
  custName: z.string().nonempty("Customer name is required"),
  custAddress: z.string().nonempty("Customer address is required"),
  items: z.array(
    z.object({
      description: z.string().nonempty("Description is required"),
      quantity: z.number().min(1, "Qty must be at least 1"),
      price: z.number().min(0.01, "Price must be at least 0.01"),
    }),
  ),
  logo: z.string(),
})

export type InvoiceSchemaType = z.infer<typeof formSchema>

const ExportPdf = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: "INV-001",
      date: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      custName: "John Doe",
      custAddress: "123 Main St, City, Country",
      items: [
        { description: "Consulting Services", quantity: 2, price: 150 },
        { description: "UI Design Handout", quantity: 1, price: 500 },
      ],
      logo: "https://example.com/logo.png",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const invoiceDataRes = form.watch()
  const [drawData, setDrawData] = useState<any>()
  const [searchParams] = useSearchParams()
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null)
  const fileName = searchParams.get("t")
  const { data, refetch } = useGetDrawFileDataQuery(fileName || "", {
    skip: !fileName,
    refetchOnMountOrArgChange: true,
  })
  const { isSuccess } = useCreateDrawFileQuery(fileName, {
    skip: data?.length !== 0,
  })
  const { toast } = useToast()
  const [postDrawContent, { isLoading: isLoadingUpdate }] =
    usePostDrawFileContentMutation()

  const onSave = async () => {
    if (!fileName) {
      toast({
        title: "Local Invoice Updated",
        description: "Invoice template state updated successfully.",
      })
      return
    }
    try {
      const resData = await postDrawContent({
        filename: fileName,
        content: JSON.stringify(drawData) || "",
      }).unwrap()
      toast({
        title: "Invoice Saved",
        description: "Saved draft successfully.",
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setDrawData([])
    }
  }, [isSuccess])

  useEffect(() => {
    if (data?.[0]?.content) {
      try {
        const output = JSON.parse(data[0].content) || []
        excalidrawAPI?.updateScene({ elements: output })
      } catch (error) {
        // quiet error
      }
    }
  }, [data])

  return (
    <ToolLayout
      title="📄 Invoice PDF Generator"
      description="Design dynamic PDF invoices and billing statements in real time."
      className="p-0 md:p-0 bg-transparent dark:bg-transparent border-none shadow-none backdrop-blur-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div
          className={cn(
            theme.classes.card,
            "lg:col-span-5 p-6 space-y-6 shadow-sm border border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md",
          )}
        >
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="size-4 text-indigo-500" />
              Invoice Details
            </h3>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-5">
              {/* Invoice Number & Cust Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme.classes.label}>
                        Invoice Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={theme.classes.input}
                          placeholder="INV-001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="custName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme.classes.label}>
                        Customer Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={theme.classes.input}
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className={theme.classes.label}>
                        Issue Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                theme.classes.input,
                                "pl-3 text-left font-normal flex items-center justify-between w-full",
                                !field.value && "text-slate-400",
                              )}
                            >
                              <span>
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick issue date"}
                              </span>
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className={theme.classes.label}>
                        Due Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                theme.classes.input,
                                "pl-3 text-left font-normal flex items-center justify-between w-full",
                                !field.value && "text-slate-400",
                              )}
                            >
                              <span>
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick due date"}
                              </span>
                              <CalendarIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Customer Address */}
              <FormField
                control={form.control}
                name="custAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme.classes.label}>
                      Billing Address
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className={theme.classes.textarea}
                        placeholder="123 Main St, City, Country"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Items Section Header */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Line Items
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      theme.classes.buttonSecondary,
                      "py-1.5 px-3 h-8 text-xs gap-1",
                    )}
                    onClick={() =>
                      append({ description: "", quantity: 1, price: 10 })
                    }
                  >
                    <Plus className="size-3.5" /> Add Item
                  </Button>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {fields.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50"
                    >
                      <div className="flex-[3]">
                        <Input
                          {...form.register(
                            `items.${index}.description` as const,
                          )}
                          placeholder="Description"
                          className={theme.classes.input}
                        />
                        {form.formState.errors.items?.[index]?.description && (
                          <span className="text-xs text-red-500 mt-0.5 block">
                            {
                              form.formState.errors?.items?.[index]?.description
                                ?.message
                            }
                          </span>
                        )}
                      </div>
                      <div className="flex-[1.5] flex gap-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          className={theme.classes.input}
                          {...form.register(
                            `items.${index}.quantity` as const,
                            { valueAsNumber: true },
                          )}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          className={theme.classes.input}
                          {...form.register(`items.${index}.price` as const, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        type="button"
                        className="h-9 px-3 self-end md:self-auto"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <div className="text-center py-6 text-sm text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      No items added yet. Click &quot;Add Item&quot; to build
                      invoice.
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className={cn(
                  theme.classes.buttonPrimary,
                  "w-full py-2.5 flex items-center justify-center gap-2",
                )}
              >
                <Check className="size-4" /> Apply Changes
              </Button>
            </form>
          </Form>
        </div>

        {/* Preview Column */}
        <div
          className={cn(
            theme.classes.card,
            "lg:col-span-7 p-6 shadow-sm border border-slate-200/60 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 backdrop-blur-md min-h-[500px]",
          )}
        >
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="size-4 text-emerald-500" />
              Live PDF Document Preview
            </h3>
          </div>
          <div className="border rounded-lg overflow-hidden border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 p-2 min-h-[480px]">
            <PdfDocument invoiceData={invoiceDataRes} />
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}

export default ExportPdf
