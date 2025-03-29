import { Calendar, SlotInfo, View, dateFnsLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import Sidebar from "../Notes/components/Sidebar"
import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetAllEventsQuery,
} from "@/features/myCalendar/calendarAPI"
import { useToast } from "@/components/ui/use-toast"
import { Loader, Trash } from "lucide-react"
import "./calendar.scss"
const locales = {
  "en-US": enUS,
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
// const localizer = momentLocalizer(moment)
interface EventI {
  id: string
  title: string
  content: string
  start: Date | string
  end: Date
  allDay?: boolean
}
// const eventsData: EventI[] = [
//   {
//     title: "Skin treatment 2nd procedure",
//     content:"content1",
//     // allDay: true,
//     start: new Date(new Date().setHours(6, 30, 0, 0)),
//     end: new Date(new Date().setHours(14, 30, 0, 0)),
//   },
//   {
//     title: "Skin treatment 3rd procedure",
//     content:"content2",
//     start: new Date(new Date().setHours(16, 30, 0, 0)),
//     end: new Date(new Date().setHours(17, 0, 0, 0)),
//   },
//   {
//     title: "Install Ella core",
//     content:"content3",
//     start: new Date(new Date().setHours(15, 30, 0, 0)),
//     end: new Date(new Date().setHours(16, 0, 0, 0)),
//   },

//   {
//     title: "1st procedure",
//     content:"content4",
//     start: new Date(new Date().setHours(17, 30, 0, 0)),
//     end: new Date(new Date().setHours(18, 0, 0, 0)),
//   },
// ]
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string(),
})
const MyCalendar = () => {
  const [createEvent] = useCreateEventMutation()
  const { isLoading, data } = useGetAllEventsQuery()
  const events = useMemo(() => {
    return data?.map((row) => {
      return { ...row, start: new Date(row.start), end: new Date(row.end) }
    })
  }, [data?.length])
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEventModal, setEventModal] = useState<EventI | null>(null)
  const [showNewEventModal, setNewEventModal] = useState<SlotInfo | null>(null)
  const [selectedView, setSelectedView] = useState<View>("month")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values, { showNewEventModal })
    if (!showNewEventModal?.start || !showNewEventModal?.end) {
      console.log("Missing start and end")
      return
    }
    // setEvents((events) => {
    //   return [
    //     ...events,
    //     {
    //       title: values.title,
    //       description:values.description,
    //       start: showNewEventModal.start,
    //       end: showNewEventModal?.end,
    //     },
    //   ]
    // })
    try {
      const result = await createEvent({
        title: values?.title,
        content: values.content,
        start: showNewEventModal?.start?.toString(),
        end: showNewEventModal?.end?.toString(),
      }).unwrap()
      console.log({ result })
      if (result.created) {
        toast({
          title: "Event created successfully",
        })
      } else {
        toast({
          title: "Event creation failed",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: `Error while creating event ${error?.data?.error}`,
        variant: "destructive",
      })
    }
    setNewEventModal(null)
  }
  console.log({ events })
  const handleDeleteEvent = async (id: string) => {
    try {
      const result = await deleteEvent({ id }).unwrap()
      console.log({ result })
      if(result.deleted){
        toast({
          title:"Event deleted successfully"
        })
        setEventModal(null);
      }else{
        toast({
          variant:"destructive",
          title:"Event deletion failed"
        })
      }
    } catch (error: any) {
      toast({
        variant:"destructive",
        title:"Event deletion failed"
      })
      console.log({ error })
    }
  }
  return (
    <div className="container">
      <Dialog
        open={!!showNewEventModal}
        onOpenChange={() => {
          setNewEventModal(null)
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">Create New Event</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Title</FormLabel> */}
                      <FormControl>
                        <Input placeholder="Title" {...field} />
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
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Description</FormLabel> */}
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* show event */}
      <Dialog
        open={!!showEventModal}
        onOpenChange={() => {
          setEventModal(null)
        }}

      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">{showEventModal?.title}</DialogTitle>
            <DialogDescription>{showEventModal?.content}</DialogDescription>
            {showEventModal?.id && (
              <Button
                disabled={isDeleting}
                onClick={() => handleDeleteEvent(showEventModal?.id)}
                className="ml-auto"
              >
                {isDeleting?  <Loader className="mr-2 h-4 w-4 animate-spin" />:
                <Trash className="text-xs w-4 h-4" />}
              </Button>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="app-h-screen flex-col flex">
        <div className="container  flex flex-col items-start justify-between space-y-2 py-2 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <div className="  flex flex-1 space-x-2 sm:justify-end w-full">
            <Sidebar />
            <div className="flex-1"></div>
          </div>
        </div>
        <Calendar
          localizer={localizer}
          view={selectedView}
          onView={(view) => {
            setSelectedView(view)
          }}
          events={events}
          date={selectedDate}
          onNavigate={(newDate) => {
            setSelectedDate(newDate)
          }}
          onSelectEvent={(event) => {
            console.log({ event })
            setEventModal(event)
          }}
          selectable
          onDrillDown={(dril) => {
            console.log({ dril })
          }}
          onSelectSlot={(slot) => {
            console.log({ slot })
            if (selectedView === "month") {
              const currentDate = moment(slot.start).startOf("week").toDate()
              setSelectedView("week")
              setSelectedDate(currentDate)
            } else {
              setNewEventModal(slot)
            }
          }}
          style={{
            height: "85vh",
          }}
        />
      </div>
    </div>
  )
}
export default MyCalendar
