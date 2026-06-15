import {
  allBaseUrls,
  ApiStandardResponse,
  endpoints,
  nodeBaseApi,
} from "@/app/services"
import { UserLoginType } from "@/pages/Login/components/loginForm"
import { ApiResponse, UserPublic } from "@/types"
import { z } from "zod"
import { SetPasswordType } from "./SetPassword"

export type NoteType = {
  id: number
  title: string
  content: string
  created_at: string
  category_id: number
  updated_at: string
}

type LoginRes = any[]
// interface LoginRes extends ApiStandardResponse {
//   data: {
//     token: string
//   } & UserLoginType
// }

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

interface LoginRequest {
  email: string
  password: string
}

interface UserResponse {
  user: UserPublic
}

export const notesApi = nodeBaseApi.injectEndpoints({
  overrideExisting: true,
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
        url: `${endpoints.LOGIN_USER}&email=${body.email}&password=${body.password}`,
      }),
    }),

    loginApi: builder.mutation<ApiResponse<UserResponse>, LoginRequest>({
      query: (credentials) => ({
        url: `/auth/login`,
        method: "POST",
        body: credentials,
      }),
      // transformResponse: (response: ApiResponse<UserResponse>) => response.data.user,
      invalidatesTags: ["User"],
    }),
  }),
})
export const {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useCreateAccountMutation,
  useLoginMutation,
  useLoginApiMutation,
  // useGetNoteDataQuery,
} = notesApi
