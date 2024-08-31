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

export type GovLinksRes = {
  Category: string | "Document" | "Job";
  Name: string;
  URL: string;
  Services: string;
}
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
const res = [
  {
    "Category": "Document",
    "Website Name": "UIDAI (Aadhaar Card)",
    "URL": "https://uidai.gov.in",
    "Services": "Aadhaar card creation, updates, and e-Aadhaar download."
  },
]
export const govApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    getGovLinks: builder.query<GovLinksRes[], void>({
      query: () => ({
        url: `https://sheetdb.io/api/v1/l73k7anfjfai9?sheet=gov`,
        method: "GET",
      }),
    }),
    getAllEvents: builder.query<GovLinksRes[], void>({
      query: () => ({
        url: `?sheet=calendar`,
        method: "GET",
      }),
      providesTags: ["AllEvents"],
    }),
    createEvent: builder.mutation<{ created: number }, CreateEventReq>({
      query: (body) => ({
        url: `https://sheetdb.io/api/v1/l73k7anfjfai9?sheet=calendar`,
        method: "POST",
        body: {
          id: "INCREMENT",
          ...body,
        },
      }),
      invalidatesTags: ["AllEvents"],
    }),
    deleteEvent: builder.mutation<{ deleted: number }, {id:string}>({
      query: ({id}) => ({
        url: `https://sheetdb.io/api/v1/l73k7anfjfai9/id/${id}?sheet=calendar`,
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
  useGetGovLinksQuery,
  useCreateEventMutation,
  useGetAllEventsQuery,
  useDeleteEventMutation
  // usePostEditorFileContentMutation
} = govApi
