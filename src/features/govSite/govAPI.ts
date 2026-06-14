import { textmeApi } from "@/app/services";

export type GovLinksRes = {
  Category: string | "Document" | "Job";
  Name: string;
  URL: string;
  Services: string;
}
export const govApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    getGovLinks: builder.query<GovLinksRes[], void>({
      query: () => ({
        url: "?sheet=gov",
        method: "GET",
      }),
    }),

  }),
})
export const {
  useGetGovLinksQuery,
} = govApi
