import { endpoints, textmeApi } from "@/app/services"
import { FormType } from "@formio/react"

const SHEETDB_BASE_URL =
  "https://sheetdb.io/api/v1/l73k7anfjfai9?sheet=forms" // Replace with your SheetDB ID
const data = [
  {
    "id": "1",
    "key": "127f924a-6275-4974-884a-b612da63eebb",
    "formname": "",
    "formjson": "{\"display\":\"form\",\"components\":[{\"label\":\"Text Field 1\",\"labelPosition\":\"top\",\"widget\":{\"type\":\"input\"},\"applyMaskOn\":\"change\",\"spellcheck\":true,\"tableView\":true,\"persistent\":true,\"inputFormat\":\"plain\",\"clearOnHide\":true,\"validateOn\":\"change\",\"key\":\"textField1\",\"type\":\"textfield\",\"input\":true,\"inputType\":\"text\",\"id\":\"ezv64ub\"},{\"label\":\"Text Field 2\",\"labelPosition\":\"top\",\"widget\":{\"type\":\"input\"},\"applyMaskOn\":\"change\",\"spellcheck\":true,\"tableView\":true,\"persistent\":true,\"inputFormat\":\"plain\",\"clearOnHide\":true,\"validateOn\":\"change\",\"key\":\"textField2\",\"type\":\"textfield\",\"input\":true,\"inputType\":\"text\",\"id\":\"ex8eoj9\"},{\"type\":\"button\",\"label\":\"Submit\",\"key\":\"submit\",\"size\":\"md\",\"action\":\"submit\",\"disableOnInvalid\":true,\"theme\":\"primary\",\"id\":\"emt07fc\",\"input\":true,\"clearOnHide\":true,\"dataGridLabel\":true,\"labelPosition\":\"top\",\"widget\":{\"type\":\"input\"},\"validateOn\":\"change\"}]}",
    "created_at": "1740297050",
    "modified_at": "1740297050"
  }
]
type FormListType = {
  id: string;
  key: string;
  formname: string;
  formjson: string;
  created_at: string;
  modified_at: string;
}

export const sheetDbApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    getFormJsonList: builder.query<FormListType[], void>({
      query: () => SHEETDB_BASE_URL,
      providesTags: ["DynamicForm"],
    }),
    getFormJson: builder.query<FormListType[], string>({
      query: (key:string) => ({
        // https://sheetdb.io/api/v1/l73k7anfjfai9/search_or?key=127f924a-6275-4974-884a-b612da63eebb&sheet=forms
        url: `${endpoints.SEARCH}?key=${key}&sheet=forms`,
      }),
      providesTags: ["DynamicForm"],
    }),
    addFormJson: builder.mutation<any, any>({
      query: (formJson) => ({
        url: SHEETDB_BASE_URL,
        method: "POST",
        body: {
          id: "INCREMENT",
          ...formJson,
          created_at: "TIMESTAMP",
          modified_at: "TIMESTAMP",
        },
      }),
      invalidatesTags: ["DynamicForm"],
    }),
    updateFormJson: builder.mutation<
      void,
      { id: string; data: Partial<FormType> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["DynamicForm"],
    }),
    deleteFormJson: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DynamicForm"],
    }),
  }),
})

export const {
  useGetFormJsonListQuery,
  useGetFormJsonQuery,
  useAddFormJsonMutation,
  useUpdateFormJsonMutation,
  useDeleteFormJsonMutation,
} = sheetDbApi
