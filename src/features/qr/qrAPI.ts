import { baseUrl, endpoints, textmeApi } from "@/app/services"
import { z } from "zod"

// // A mock function to mimic making an async request for data
// export function fetchCount(amount = 1) {
//   return new Promise<{ data: number }>((resolve) =>
//     setTimeout(() => resolve({ data: amount }), 500),
//   )
// }


const DynamicQrItemType = [{ id: "1", title: "anurag", content: "test content" }]
export type DynamicQrItemType = {
  id: string
  key: string
  url: string
  created_at:string;
}

export const editorContentFormSchema = z.object({
  key: z.string().nonempty(),
  url: z.string().nonempty(),
})
export type EditorContentForm = z.infer<typeof editorContentFormSchema>

export const qrApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    // getNote: builder.mutation<DynamicQrItemType, string>({
    //   query: (title) => ({
    //     url: `${endpoints.SEARCH}?title=${title}`,
    //     method: "GET",
    //   }),
    // }),
    getQrData: builder.query<DynamicQrItemType[], string>({
      query: (key) => ({
        url: `${endpoints.SEARCH}?key=${key}&sheet=QR`,
        method: "GET",
      }),
    }),
    getQrDataList: builder.query<DynamicQrItemType[], void>({
      query: () => ({
        url: `${baseUrl}?&sheet=QR`,
        method: "GET",
      }),
    }),
    getQrUrl: builder.mutation<DynamicQrItemType[], string>({
      query: (key) => ({
        url: `${endpoints.SEARCH}?key=${key}&sheet=QR`,
        method: "GET",
      }),
    }),

    addRedirect: builder.mutation<any, { key: string; url: string}>({
      query: (body) => ({
        url: `https://sheetdb.io/api/v1/l73k7anfjfai9?sheet=QR`,
        method: "POST",
        body: {
          id: "INCREMENT",
          key: body.key,
          url: body.url,
          created_at:"TIMESTAMP",
          modified_at:"TIMESTAMP"
        },
      }),
    }),
    updateRedirectUrl: builder.mutation<any, { id: string; url: string}>({
      query: (body) => ({
        url: `https://sheetdb.io/api/v1/l73k7anfjfai9/id/${body.id}?sheet=QR`,
        method: "PATCH",
        body: {
          url: body.url,
          modified_at:"TIMESTAMP"
        },
      }),
    }),

  }),
})
export const {
  // useGetNoteMutation,
  useGetQrDataQuery,
  useGetQrUrlMutation,
  useAddRedirectMutation,
  useGetQrDataListQuery,
  useUpdateRedirectUrlMutation
} = qrApi
