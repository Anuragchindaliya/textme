import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react"
export interface ApiStandardResponse {
  statusCode: number
  message: string
}
// https://textmen-backend.onrender.com
// https://sheetdb.io/api/v1/l73k7anfjfai9/search_or?title=anurag
const allBaseUrls = {
  local: "http://localhost:5000",
  prod: "https://sheetdb.io/api/v1/l73k7anfjfai9",
  render:"https://textmen-backend.onrender.com"
}
// const baseUrl = allBaseUrls.local
const baseUrl = allBaseUrls.prod
export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (
    headers,
    //  { getState }
  ) => {
    // const token = (getState() as RootState).auth.token

    // // If we have a token set in state, let's assume that we should be passing it.
    // if (token) {
    //   headers.set("Authorization", `Bearer ${token}`)
    // }
    headers.set("Access-Control-Allow-Origin", "*")
    headers.set("Access-Control-Allow-Headers", "X-Requested-With")
    return headers
  },
  // credentials: "include",
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (
    (result.error && result.error.status === 401) ||
    // @ts-ignore
    result?.data?.statusCode === 401
  ) {
    // removeLocalTime()
    // api.dispatch(logoutAction())
  }
  return result
}

export const textmeApi = createApi({
  baseQuery: baseQueryWithReauth,
  // tagTypes: ["UserProfile"],
  endpoints: () => ({}),
  tagTypes:["AllEvents"]
})
const endpointsUrl = {
  EMAIL_VALIDATION: "emailvalidation",
  OTP_GENERATION: "otpgeneration",
  OTP_VALIDATION: "otpvalidation",
  LOGOUT: "logout",
  TOKEN_STATUS: "tokenstatus",
  PATIENTS: "referralpatient",
  PHYSICIAN: "physician",
  TRAINING: "trainingvideo",
  DASHBOARD_DETAILS: "referralsdashboard",
  DOCTORS: "doctors",
  CLINIC: "clinic",
  PRACTICE_TYPE: "practicetype",
  PROCEDURES: "procedures",
  PROCEDURES_TAKEN: "proceduresTaken",
  PROCEDURES_NOT_TAKEN: "proceduresNotTaken",
  // REVIEWS: "reviews",
  REVIEWS: "reviewandratings",
  // http://127.0.0.1:5000/reviewandratingscount/anurag.chindaliya@amantyatech.com
  REVIEWS_COUNT: "reviewandratingscount",
  REFERRALS: "refferals",
  PATIENT_OVERVIEW: "overview",
  PATIENT_PROCEDURE: "dashboardprocedure",
  PATIENT_REVIEW: "dashboardreviewrating",
  PATIENT_SELFIES: "physcompareselfie",
  SHOPIFY: "shopifygraphql",
  WAND: "wand",
  NOTES: "search_or",
  SEND_OTP: "auth/send-otp",
  VERIFY_OTP: "auth/verify-otp",
  CREATE_ACCOUNT: "auth/create-account",
  LOGIN: "auth/login",
  LOGIN_USER:"search?sheet=users",
  SEARCH:"search_or",
  NOTE_TITLE:"title",
  EDITOR_FILENAME:"filename"
} as const

type EndpointsType = typeof endpointsUrl
type EndpointsKeys = keyof EndpointsType
// type EndpointValues = EndpointsType[EndpointsKeys];
export const endpoints = Object.entries(endpointsUrl).reduce(
  (acc, [key, val]) => ({
    ...acc,
    [key]: `${baseUrl}/${val}`,
  }),
  {},
) as { [k in EndpointsKeys]: EndpointsType[k] }
