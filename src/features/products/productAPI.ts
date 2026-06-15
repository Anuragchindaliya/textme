import { textmeApi } from "@/app/services"

export type Product = {
  ID: string
  Name: string
  Description: string
  image_light: string
  image_dark: string
  Discount: string
  Price: string
  Rating: string
  Reviews: string
  Feature_1: string
  Feature_2: string
  Prod_link: string
}
const res = {
  ID: "1",
  Name: 'Apple iMac 27"',
  Description: "1TB HDD, Retina 5K Display, M3 Max",
  image_light:
    "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
  image_dark:
    "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg",
  Discount: "Up to 35% off",
  Price: "1699",
  Rating: "5",
  Reviews: "455",
  Feature_1: "Fast Delivery",
  Feature_2: "Best Price",
}
export const govApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProduct: builder.query<Product[], void>({
      query: () => ({
        url: "?sheet=products",
        method: "GET",
      }),
    }),
  }),
})
export const { useGetAllProductQuery } = govApi
