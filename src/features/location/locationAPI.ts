// src/features/sheetDbApi.ts
import { textmeApi } from "@/app/services"

const SHEETDB_BASE_URL =
  "https://sheetdb.io/api/v1/l73k7anfjfai9?sheet=locations" // Replace with your SheetDB ID

export interface Location {
  id?: string // SheetDB auto-generates an ID if not provided
  name: string
  type?: string
  address?: string
  contact?: string
  latitude: number
  longitude: number
}


type PlaceType = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
}

export const sheetDbApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => SHEETDB_BASE_URL,
      providesTags: ["Location"],
    }),
    searchPlaces: builder.query<PlaceType[], string>({
      query: (query) => `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      providesTags: ["Location"],
    }),
    addLocation: builder.mutation<any, Location>({
      query: (newLocation) => ({
        url: SHEETDB_BASE_URL,
        method: "POST",
        body: {
          id: "INCREMENT",
          ...newLocation,
          created_at: "TIMESTAMP",
          modified_at: "TIMESTAMP",
        },
      }),
      invalidatesTags: ["Location"],
    }),
    updateLocation: builder.mutation<
      void,
      { id: string; data: Partial<Location> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Location"],
    }),
    deleteLocation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Location"],
    }),
  }),
})

export const {
  useGetLocationsQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useSearchPlacesQuery
} = sheetDbApi
