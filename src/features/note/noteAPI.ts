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
// interface getNoteRes extends ApiStandardResponse {
//   data: NoteType
// }

const sheetres = [{ id: "1", title: "anurag", content: "test content" }]
type sheetRes = {
  id: string
  title: string
  content: string
}[]
type ContentType = {
  id: string
  title: string
  content: string
  tab: string
}[]
export const noteContentFormSchema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
})
export type NoteContentForm = z.infer<typeof noteContentFormSchema>

export const ShareContentFormSchema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
  tab: z.string().nonempty(),
})

export type ShareContentForm = {
  title: string;
  content: string;
  tab: string;
}

export const notesApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    // getNote: builder.mutation<sheetRes, string>({
    //   query: (title) => ({
    //     url: `${endpoints.SEARCH}?title=${title}`,
    //     method: "GET",
    //   }),
    // }),
    getNoteData: builder.query<sheetRes, string>({
      query: (title) => ({
        // url: `${endpoints.NOTES}/${title}`,
        url: `${endpoints.SEARCH}?title=${title}`,
        method: "GET",
      }),
    }),
    getContentData: builder.query<ContentType, string>({
      query: (title) => ({
        // url: `${endpoints.NOTES}/${title}`,
        url: `${endpoints.SEARCH}?sheet=shareContent&title=${title}`,
        method: "GET",
      }),
    }),
    createNote: builder.query({
      query: (title) => ({
        url: `https://sheetdb.io/api/v1/l73k7anfjfai9`,
        method: "POST",
        body:{
          id:"INCREMENT",
          title,
        }
      }),
    }),
    postNoteContent: builder.mutation<any, NoteContentForm>({
      query: (body) => ({
        // url: endpoints.NOTES,
        url: `${endpoints.NOTE_TITLE}/${body.title}`,
        method: "PATCH",
        body: { data: { content: body.content } },
      }),
    }),
    postShareContent: builder.mutation<any, ShareContentForm>({
      query: (body) => ({
        // url: endpoints.NOTES,
        url: `${endpoints.NOTE_TITLE}/${body.title}?sheet=shareContent`,
        method: "PATCH",
        body: { data: { content: body.content,tab:body.tab } },
      }),
    }),
  }),
})
export const {
  // useGetNoteMutation,
  usePostNoteContentMutation,
  useGetNoteDataQuery,
  useCreateNoteQuery,
  useGetContentDataQuery,
  usePostShareContentMutation,
} = notesApi
