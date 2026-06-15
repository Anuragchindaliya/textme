import { textmeApi } from "@/app/services"

// const initialState = {
//   coords: { lat: 28.6139, lon: 77.209 }, // Delhi default
// };

export interface WeatherResponse {
  coord: Coord
  weather: Weather[]
  base: string
  main: Main
  visibility: number
  wind: Wind
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level: number
  grnd_level: number
}

export interface Wind {
  speed: number
  deg: number
  gust: number
}

export interface Clouds {
  all: number
}

export interface Sys {
  country: string
  sunrise: number
  sunset: number
}

interface CountriesRes {
  id: number
  name: string
  iso2: string
  iso3: string
  phonecode: string
  capital: string
  currency: string
  native: string
  emoji: string
}

const COUNTRY_BASE_URL = "https://api.countrystatecity.in/v1/countries"
const CSC_API_KEY =
  import.meta.env.VITE_CSC_API_KEY ||
  "dXRHa2l1QXZBMXNEUmxjdE9VZ2l5ejRudmZ4dVZwMUpTOTBOcnZtMg=="
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"
const WEATHER_API_KEY =
  import.meta.env.VITE_WEATHER_API_KEY || "714e4f7af2ccc29175dfc4099ff59474"

export const weatherApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeatherByCity: builder.mutation<
      WeatherResponse,
      { city: string; countryCode: string; units?: string }
    >({
      query: ({ city, countryCode, units = "metric" }) => ({
        url: `${WEATHER_BASE_URL}/weather?q=${city},${countryCode.toLowerCase()}&APPID=${WEATHER_API_KEY}&units=${units}`,
        method: "GET",
      }),
    }),
    getWeatherByCoords: builder.query<WeatherResponse, { units?: string }>({
      query: ({ units = "metric" }) => ({
        url: `${WEATHER_BASE_URL}/weather?lat=28.3735651&lon=77.2834679&APPID=${WEATHER_API_KEY}&units=${units}`,
        method: "GET",
      }),
    }),
    getCountries: builder.query<CountriesRes[], void>({
      query: () => ({
        url: COUNTRY_BASE_URL,
        headers: { "X-CSCAPI-KEY": CSC_API_KEY },
      }),
    }),
    getStates: builder.mutation<any[], string>({
      query: (countryCode) => ({
        url: `${COUNTRY_BASE_URL}/${countryCode}/states`,
        headers: { "X-CSCAPI-KEY": CSC_API_KEY },
      }),
    }),
    getCities: builder.mutation<
      any[],
      { countryCode: string; stateCode: string }
    >({
      query: ({ countryCode, stateCode }) => ({
        url: `${COUNTRY_BASE_URL}/${countryCode}/states/${stateCode}/cities`,
        headers: { "X-CSCAPI-KEY": CSC_API_KEY },
      }),
    }),
  }),
})

export const {
  useGetWeatherByCityMutation,
  useGetCountriesQuery,
  useGetStatesMutation,
  useGetCitiesMutation,
  useGetWeatherByCoordsQuery,
} = weatherApi
