import { endpoints, textmeApi } from "@/app/services"
import { z } from "zod"

export type NoteType = {
  id: number
  title: string
  content: string
  created_at: string
  category_id: number
  updated_at: string
}

// const sheetres = [{ id: "1", title: "anurag", content: "test content" }]
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
    getDrawFileData: builder.query<sheetRes, string>({
      query: (fileName) => ({
        url: `${endpoints.SEARCH}?filename=${fileName}&sheet=draw`,
        method: "GET",
      }),
    }),
    createDrawFile: builder.query({
      query: (filename) => ({
        url: "?sheet=draw",
        method: "POST",
        body:{
          id:"INCREMENT",
          filename,
        }
      }),
    }),
    postDrawFileContent: builder.mutation<any, {content:string,filename:string}>({
      query: (body) => ({
        // url: endpoints.NOTES,
        url: `${endpoints.EDITOR_FILENAME}/${body.filename}?sheet=draw`,
        method: "PATCH",
        body: { data: { content: body.content } },
      }),
    }),
  }),
})
export const {
  // useGetNoteMutation,
  useCreateDrawFileQuery,
  useGetDrawFileDataQuery,
  usePostDrawFileContentMutation
} = notesApi
