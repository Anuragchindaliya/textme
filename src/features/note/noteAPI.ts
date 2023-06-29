import { ApiStandardResponse, endpoints, textmeApi } from "@/app/services"
import { z } from "zod"

// // A mock function to mimic making an async request for data
// export function fetchCount(amount = 1) {
//   return new Promise<{ data: number }>((resolve) =>
//     setTimeout(() => resolve({ data: amount }), 500),
//   )
// }
export type NoteType = {
  id: number
  title: string
  content: string
  created_at: string
  category_id: number
  updated_at: string
}
// const res = {
//   statusCode: 200,
//   message: "Note fetched successfully",
//   data: {
//     id: 1,
//     title: "Note Title",
//     content: "Note Content",
//     created_at: "2023-06-24T06:50:08.000Z",
//     category_id: 1,
//     updated_at: "2023-06-24T06:52:23.000Z",
//   },
// }
interface getNoteRes extends ApiStandardResponse {
  data: NoteType
}
export const noteContentFormSchema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
})
export type NoteContentForm = z.infer<typeof noteContentFormSchema>

export const notesApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    getNote: builder.mutation<getNoteRes, string>({
      query: (title) => ({
        url: `${endpoints.NOTES}/${title}`,
        method: "GET",
      }),
    }),
    getNoteData: builder.query<getNoteRes, string>({
      query: (title) => ({
        url: `${endpoints.NOTES}/${title}`,
        method: "GET",
      }),
    }),
    postNoteContent: builder.mutation<any, NoteContentForm>({
      query: (body) => ({
        url: endpoints.NOTES,
        method: "POST",
        body,
      }),
    }),
  }),
})
export const {
  useGetNoteMutation,
  usePostNoteContentMutation,
  useGetNoteDataQuery,
} = notesApi
