import { ApiStandardResponse, endpoints, textmeApi } from "@/app/services"
import { z } from "zod"
import { SetPasswordType } from "./SetPassword"
import { UserLoginType } from "@/pages/Login/components/loginForm"

export type NoteType = {
  id: number
  title: string
  content: string
  created_at: string
  category_id: number
  updated_at: string
}

interface LoginRes extends ApiStandardResponse {
  data: {
    token: string
  } & UserLoginType
}

interface getNoteRes extends ApiStandardResponse {
  email: string
}
interface getNoteReq {
  email: string
}
interface CreateAccountReq extends SetPasswordType {
  email: string
}
interface CreateAccountRes extends ApiStandardResponse {
  data: CreateAccountReq
}
export const noteContentFormSchema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
})
export type NoteContentForm = z.infer<typeof noteContentFormSchema>
type verifyOTPReq = { email: string; otp: string }
export const notesApi = textmeApi.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    sendOTP: builder.mutation<getNoteRes, getNoteReq>({
      query: (body) => ({
        url: endpoints.SEND_OTP,
        method: "POST",
        body: { ...body },
      }),
    }),
    verifyOTP: builder.mutation<getNoteRes, verifyOTPReq>({
      query: (body) => ({
        url: endpoints.VERIFY_OTP,
        method: "POST",
        body: { ...body },
      }),
    }),
    createAccount: builder.mutation<CreateAccountRes, CreateAccountReq>({
      query: (body) => ({
        url: endpoints.CREATE_ACCOUNT,
        method: "POST",
        body: { ...body },
      }),
    }),
    // getNoteData: builder.query<getNoteRes, string>({
    //   query: (title) => ({
    //     url: `${endpoints.NOTES}/${title}`,
    //     method: "GET",
    //   }),
    // }),
    login: builder.mutation<LoginRes, UserLoginType>({
      query: (body) => ({
        url: endpoints.LOGIN,
        method: "POST",
        body,
      }),
    }),
  }),
})
export const {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useCreateAccountMutation,
  useLoginMutation,
  // useGetNoteDataQuery,
} = notesApi
