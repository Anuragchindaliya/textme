import { endpoints, textmeApi } from "@/app/services"
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

const sheetres = [{ id: "1", title: "anurag", content: "test content" }]
type sheetRes = {
  id: string
  title: string
  content: string
}[]
export const editorContentFormSchema = z.object({
  filename: z.string().nonempty(),
  content: z.string().nonempty(),
})
export type EditorContentForm = z.infer<typeof editorContentFormSchema>

export const notesApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    // getNote: builder.mutation<sheetRes, string>({
    //   query: (title) => ({
    //     url: `${endpoints.SEARCH}?title=${title}`,
    //     method: "GET",
    //   }),
    // }),
    getEditorFileData: builder.query<sheetRes, string>({
      query: (fileName) => ({
        // url: `${endpoints.NOTES}/${fileName}`,
        url: `${endpoints.SEARCH}?filename=${fileName}&sheet=editor`,
        method: "GET",
      }),
    }),
    createEditorFile: builder.query({
      query: (filename) => ({
        url: `https://sheetdb.io/api/v1/l73k7anfjfai9?sheet=editor`,
        method: "POST",
        body:{
          id:"INCREMENT",
          filename,
        }
      }),
    }),
    postEditorFileContent: builder.mutation<any, {content:string,filename:string}>({
      query: (body) => ({
        // url: endpoints.NOTES,
        url: `${endpoints.EDITOR_FILENAME}/${body.filename}?sheet=editor`,
        method: "PATCH",
        body: { data: { content: body.content } },
      }),
    }),
  }),
})
export const {
  // useGetNoteMutation,
  useCreateEditorFileQuery,
  useGetEditorFileDataQuery,
  usePostEditorFileContentMutation
} = notesApi
