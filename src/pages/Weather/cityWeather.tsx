import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Sidebar from "../Notes/components/Sidebar"
import {
  useGetCitiesMutation,
  useGetCountriesQuery,
  useGetStatesMutation,
  useGetWeatherByCityMutation,
  useGetWeatherByCoordsQuery,
} from "./WeatherSlice"

// const config = {
//   cUrl: "https://api.countrystatecity.in/v1/countries",
//   cKey: "dXRHa2l1QXZBMXNEUmxjdE9VZ2l5ejRudmZ4dVZwMUpTOTBOcnZtMg==",
//   wUrl: "https://api.openweathermap.org/data/2.5/",
//   wKey: "714e4f7af2ccc29175dfc4099ff59474",
// };

// const getCountries = async (fieldName: string, ...args: string[]) => {
//   let apiEndPoint = config.cUrl;
//   if (fieldName === "states") apiEndPoint = `${config.cUrl}/${args[0]}/states`;
//   if (fieldName === "cities") apiEndPoint = `${config.cUrl}/${args[0]}/states/${args[1]}/cities`;

//   const response = await fetch(apiEndPoint, {
//     headers: { "X-CSCAPI-KEY": config.cKey },
//   });
//   if (!response.ok) throw new Error("Failed to fetch data");
//   return response.json();
// };

// const getWeather = async (city: string, ccode: string, units = "metric") => {
//   const res = await fetch(`${config.wUrl}weather?q=${city},${ccode.toLowerCase()}&APPID=${config.wKey}&units=${units}`);
//   if (!res.ok) throw new Error("Failed to fetch weather");
//   return res.json();
// };

const getDateTimeFromOffset = (timestamp: number, timeZoneOffsetSeconds: number) => {
  const localTime = new Date((timestamp + timeZoneOffsetSeconds) * 1000);
  return localTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    minute: "2-digit",
    hour: "2-digit",
    hour12: true,
  });
};


const CityWeather = () => {
  const { isLoading: countryLoading, data: countries } = useGetCountriesQuery()
  const [getStateApi, { isLoading: stateLoading }] = useGetStatesMutation()
  const [getCityApi, { isLoading: cityLoading }] = useGetCitiesMutation()
  const [getWeatherDataApi, { isLoading: weatherLoading }] =
    useGetWeatherByCityMutation()
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined)
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined)
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined)
  const [weather, setWeather] = useState<any | null>(null)
  const [unit, setUnit] = useState("metric")
  const [coords, setCoords] = useState({ lat: 28.6139, lon: 77.209 });
  // const useGetWeatherQuery({ lat: 28.6139, lon: 77.209 }); // Default to Delhi coordinates
  const {data:coordsWeather,isLoading:cWeatherLoading}=useGetWeatherByCoordsQuery({
    
  })

  

  const handleCountryChange = async (code: string) => {
    setSelectedCountry(code)
    setSelectedState(undefined)
    setSelectedCity(undefined)
    setCities([])
    setWeather(null)
    const res = await getStateApi(code).unwrap()
    if(res.length === 0) {
      toast.error("No states found for this country.")
      setStates([])
    }else{
      setStates(res)
    }
  }

  const handleStateChange = async (code: string) => {
    setSelectedState(code)
    setSelectedCity(undefined)
    setWeather(null)
    if(!selectedCountry) {
      toast.error("Please select a country first.")
      return
    }
    const res = await getCityApi({
      countryCode: selectedCountry,
      stateCode: code,
    }).unwrap()
    if (!res || res.length === 0) {
      toast.error("No cities found for this state.")
      setCities([])
      return
    }else if (res.length === 1 && res[0].name === "Unknown") {
      setCities([])
      return
    }else{
      setCities(res)
    }
  }

  const handleCityChange = async (city: string) => {
    setSelectedCity(city)
    // const data = await getWeather(city, selectedCountry, unit);
    if (!selectedCountry) {
      toast.error("Please select a country first.")
      return
    }
    if (!city) {
      setWeather(null)
      toast.error("Please select a city.")
      return
    }
    const data = await getWeatherDataApi({
      city,
      countryCode: selectedCountry,
      units: unit,
    }).unwrap()
    setWeather(data)
  }

  const switchUnit = async (newUnit: string) => {
    setUnit(newUnit)
    if (selectedCity && selectedCountry) {
      const data = await getWeatherDataApi({
        city: selectedCity,
        countryCode: selectedCountry,
        units: newUnit,
      }).unwrap()
      setWeather(data)
    }
  }
  console.log({ countries, states, cities, weather,coords,selectedCountry, selectedState, selectedCity, unit });
  // console.log("Weather data:", weather);
   const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log("User location access granted.");
            const { latitude, longitude } = pos.coords;
            console.log("User location:", latitude, longitude);
            setCoords({ lat: latitude, lon: longitude });
          },
          (err) => {
            console.warn("Location access denied.", err);
          }
        );
      }
    };
  
    useEffect(() => {
      getUserLocation();
    }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
      <Sidebar />
        </div>
      <h1 className=" flex-1 text-3xl font-bold text-center mb-4">🌤️ Weather App</h1>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Select onValueChange={handleCountryChange} value={selectedCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Select Country" />
            <Loader
              className={`ml-2 ${countryLoading ? "animate-spin" : "hidden"}`}
            />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {countries?.map((c) => (
              <SelectItem key={c.iso2} value={c.iso2}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {
          <Select
            onValueChange={handleStateChange}
            disabled={states.length <= 0}
            value={selectedState}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
              <Loader
                className={`ml-2 ${stateLoading ? "animate-spin" : "hidden"}`}
              />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {states.map((s) => (
                <SelectItem key={s.iso2} value={s.iso2}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        {
          <Select
            onValueChange={handleCityChange}
            disabled={cities.length <= 0}
            value={selectedCity}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
              <Loader
                className={`ml-2 ${cityLoading ? "animate-spin" : "hidden"}`}
              />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {cities.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      </div>

      {weatherLoading ? (
        <Card className="p-4 animate-pulse">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </Card>
      ) : weather ? (
        <div>
          <Card className="p-4 bg-gradient-to-br from-blue-200 to-blue-500 text-white shadow-lg">
            <CardContent className="space-y-2 md:flex md:justify-between items-center">
              <div>
              <div className="text-xl font-semibold">
                {weather.name}, {weather.sys.country}
              </div>
              <div>{getDateTimeFromOffset(weather.dt,weather.timezone)}</div>
              </div>
              <div>
              <div className="text-2xl font-bold">
                {weather.main.temp}°{unit === "metric" ? "C" : "F"}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={unit === "metric" ? "default" : "secondary"}
                  onClick={() => switchUnit("metric")}
                >
                  °C
                </Button>
                <Button
                  variant={unit === "imperial" ? "default" : "secondary"}
                  onClick={() => switchUnit("imperial")}
                >
                  °F
                </Button>
              </div>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="weather icon"
                />
                <span className="capitalize">
                  {weather.weather[0].description}
                </span>
              </div>
              <div>
              <div className="text-sm">
                Min: {weather.main.temp_min}°, Max: {weather.main.temp_max}°
              </div>
              
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-opacity-20 backdrop-blur-md">
              <CardContent className="p-4">
                <p className="text-xl font-semibold">Temperature</p>
                <p>Current: {weather?.main?.temp}°C</p>
                <p>Feels Like: {weather?.main?.feels_like}°C</p>
                <p>
                  Min: {weather?.main?.temp_min}°C / Max: {weather?.main?.temp_max}°C
                </p>
              </CardContent>
            </Card>
            <Card className="bg-opacity-20 backdrop-blur-md">
              <CardContent className="p-4">
                <p className="text-xl font-semibold">Atmosphere</p>
                <p>Humidity: {weather?.main?.humidity}%</p>
                <p>Pressure: {weather?.main?.pressure} hPa</p>
                <p>Visibility: {weather?.main?.visibility} m</p>
              </CardContent>
            </Card>
            <Card className="bg-opacity-20 backdrop-blur-md">
              <CardContent className="p-4">
                <p className="text-xl font-semibold">Wind & Clouds</p>
                <p>Speed: {weather?.wind?.speed} m/s</p>
                <p>Direction: {weather?.wind?.deg}°</p>
                <p>Cloudiness: {weather?.clouds?.all}%</p>
              </CardContent>
            </Card>
            <Card className="bg-opacity-20 backdrop-blur-md">
              <CardContent className="p-4">
                <p className="text-xl font-semibold">Sun</p>
                <p>
                  Sunrise:{" "}
                  {/* {new Date(weather?.sys?.sunrise * 1000).toLocaleTimeString()} */}
                  {new Date(weather?.sys?.sunrise * 1000).toLocaleTimeString("en-US")}

                </p>
                <p>
                  Sunset:{" "}
                  {/* {new Date(weather?.sys?.sunset * 1000).toLocaleTimeString()} */}
                   {new Date(weather?.sys?.sunset * 1000).toLocaleTimeString("en-US")}

                </p>
              </CardContent>
            </Card>
            <Card className="bg-opacity-20 backdrop-blur-md">
              <CardContent className="p-4">
                <p className="text-xl font-semibold">Weather</p>
                <p>Main: {weather?.weather?.[0]?.main}</p>
                <p>Description: {weather?.weather?.[0]?.description}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${weather?.weather?.[0]?.icon}@2x.png`}
                  alt="Weather icon"
                  className="w-16 h-16 mt-2"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
      {/* <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">7-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {weather?.daily?.time.map((day:any, index:number) => (
          <Card key={day}>
            <CardContent className="p-4 space-y-2">
              <p className="font-bold">{new Date(day).toDateString()}</p>
              <p>Max: {weather.daily.temperature_2m_max[index]}°C</p>
              <p>Min: {weather.daily.temperature_2m_min[index]}°C</p>
              <p>Rain: {weather.daily.precipitation_sum[index]}mm</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div> */}
    </div>
  )
}

export default CityWeather
