import { ApiStandardResponse, endpoints, textmeApi } from "@/app/services"
import { z } from "zod"

export type NoteType = {
  id: number
  title: string
  content: string
  created_at: string
  category_id: number
  updated_at: string
}

type SheetRes = {
  id: string
  title: string
  content: string
  start: Date
  end: Date
}[]
export const editorContentFormSchema = z.object({
  filename: z.string().nonempty(),
  content: z.string().nonempty(),
})
export type EditorContentForm = z.infer<typeof editorContentFormSchema>
type CreateEventReq = {
  title: string
  content: string
  start: string
  end: string
}
export const calendarApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    getEventData: builder.query<SheetRes, string>({
      query: (fileName) => ({
        url: `${endpoints.SEARCH}?filename=${fileName}&sheet=calendar`,
        method: "GET",
      }),
    }),
    getAllEvents: builder.query<SheetRes, void>({
      query: () => ({
        url: `?sheet=calendar`,
        method: "GET",
      }),
      providesTags: ["AllEvents"],
    }),
    createEvent: builder.mutation<{ created: number }, CreateEventReq>({
      query: (body) => ({
        url: "?sheet=calendar",
        method: "POST",
        body: {
          id: "INCREMENT",
          ...body,
        },
      }),
      invalidatesTags: ["AllEvents"],
    }),
    deleteEvent: builder.mutation<{ deleted: number }, { id: string }>({
      query: ({ id }) => ({
        url: `/id/${id}?sheet=calendar`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllEvents"],
    }),

    // postEditorFileContent: builder.mutation<any, {content:string,filename:string}>({
    //   query: (body) => ({
    //     url: `${endpoints.EDITOR_FILENAME}/${body.filename}?sheet=calendar`,
    //     method: "PATCH",
    //     body: { data: { content: body.content } },
    //   }),
    // }),
  }),
})
export const {
  // useGetNoteMutation,
  useCreateEventMutation,
  useGetEventDataQuery,
  useGetAllEventsQuery,
  useDeleteEventMutation,
  // usePostEditorFileContentMutation
} = calendarApi
