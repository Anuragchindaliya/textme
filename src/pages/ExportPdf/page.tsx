import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Sidebar from "../Notes/components/Sidebar"
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
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

const formSchema = z.object({
  invoiceNumber: z.string().nonempty(),
  date: z.date(),
  dueDate: z.date(),
  custName: z.string(),
  custAddress: z.string(),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
  logo: z.string(),
})
// Define your invoice data
export type InvoiceSchemaType = z.infer<typeof formSchema>
const invoiceData = {
  invoiceNumber: "INV-001",
  date: "2024-04-02",
  dueDate: "2024-04-10",
  customer: {
    name: "John Doe",
    address: "123 Main St, City, Country",
  },
  items: [
    { description: "Item 1", quantity: 2, price: 10 },
    { description: "Item 2", quantity: 3, price: 15 },
  ],
  logo: "https://example.com/logo.png", // Replace with your logo URL
}

const ExportPdf = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: "INV-001",
      date: new Date("2024-04-02"),
      dueDate: new Date("2024-04-10"),
      custName: "John Doe",
      custAddress: "123 Main St, City, Country",
      items: [
        { description: "Item 1", quantity: 2, price: 10 },
        { description: "Item 2", quantity: 3, price: 15 },
      ],
      logo: "https://example.com/logo.png", // Replace with your logo URL
    },
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })
  const invoiceDataRes = form.getValues()
  console.log({ invoiceDataRes })
  const { theme } = useTheme()
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
    console.log({ drawData })
    if (!fileName) {
      return
    }
    const resData = await postDrawContent({
      filename: fileName,
      content: JSON.stringify(drawData) || "",
    }).unwrap()
    console.log({ resData })
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "File created",
      })
      // editorRef.current?.clear()
      setDrawData([])
    }
  }, [isSuccess])
  useEffect(() => {
    if (data?.[0]?.content) {
      try {
        const output = JSON.parse(data[0].content) || []
        // setDrawData(output)
        console.log({ output })
        excalidrawAPI?.updateScene({ elements: output })
        // .then((data) => {
        //   console.log("render", data)
        // })
        // .catch((data) => {
        //   console.log(data)
        // })
      } catch (error) {
        // console.log(error)
      }
    }
  }, [data])
  return (
    <div style={{ height: "87vh" }}>
      <div className="container  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full">
          <Sidebar />
          {/* <DrawInput /> */}
          <div className="flex-1"></div>
        </div>
      </div>
      <div className="flex justify-center px-8 gap-4">
        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Inoice No." {...field} />
                      </FormControl>
                      {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="custName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer Name" {...field} />
                      </FormControl>
                      {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date) =>
                            //   date > new Date() || date < new Date("1900-01-01")
                            // }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {/* <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date) =>
                            //   date > new Date() || date < new Date("1900-01-01")
                            // }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {/* <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="custAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Address </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Customer Address" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <div>Items</div>
                <Button
                  type="button"
                  onClick={() =>
                    append({ description: "", quantity: 0, price: 0 })
                  }
                >
                  Add Item
                </Button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 w-full">Description</div>
                <div className="flex-1">Quantity</div>
                <div className="flex-1">price</div>
                <div className="flex-1"></div>
              </div>
              <div 
              className="flex flex-col gap-3 h-32 p-3 overflow-y-auto" 
              // className="h-24 overflow-y-auto"
              >
              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      {...form.register(`items.${index}.description` as const)}
                      placeholder="Description"
                    />
                    {/* <div>{form.}</div> */}
                    {form.formState.errors.items?.[index]?.description && (
                      <span>
                        {
                          form.formState.errors?.items?.[index]?.description
                            ?.message
                        }
                      </span>
                    )}
                  </div>
                  <Input
                    type="number"
                    className="flex-1"
                    {...form.register(`items.${index}.quantity` as const)}
                    placeholder="Quantity"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    className="flex-1"
                    {...form.register(`items.${index}.price` as const)}
                    placeholder="Price"
                  />
                  <Button
                    variant={"destructive"}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              </div>

              <Button type="submit">Update</Button>
            </form>
          </Form>
        </div>
        <div className="flex-1">
          <PdfDocument invoiceData={invoiceDataRes} />
        </div>
      </div>
    </div>
  )
}

export default ExportPdf
