import { Button } from "@/components/ui/button"
import { useGetLocationsQuery } from "@/features/location/locationAPI"
import { Icon } from "leaflet"
import {
  ArrowRight,
  BookPlus,
  Coffee,
  Dumbbell,
  LocateIcon,
  Plus,
  SearchIcon,
} from "lucide-react"
import React, { useRef, useState } from "react"
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
  ZoomControl,
} from "react-leaflet"
import AddNewLocationForm from "./AddNewLocationForm"
import { Input } from "@/components/ui/input"
// Define a type for a business location
type BusinessLocation = {
  id: number
  name: string
  type?: string
  address?: string
  contact?: string
  latitude: number
  longitude: number
}
const customIcon = new Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Pinpoint.svg", // Replace with your icon URL
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
const newCustomIcon = new Icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/6/65/OOjs_UI_icon_mapPin-progressive.svg", // Replace with your icon URL
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const LocationItemConfig = {
  Cafe: <Coffee />,
  Bookstore: <BookPlus />,
  Gym: <Dumbbell />,
} as any

const MapComponent: React.FC = () => {
  const [searchText,setSearchText] = useState("");
  const [actionType, setActionType] = useState("")
  const mapRef = useRef<any | null>(null)
  // const [locationList, setLocationList] = useState<Business[]>(businesses)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null)

  const { data: locationList, isLoading } = useGetLocationsQuery()
  // Map click to add a new marker
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (actionType === "add") {
          setSelectedPosition([e.latlng.lat, e.latlng.lng])
          setIsSidebarOpen(true)
        }
      },
    })
    return null
  }

  // Update marker position dynamically
  const handleMarkerDrag = (event: any) => {
    const { lat, lng } = event.target.getLatLng()
    setSelectedPosition([lat, lng])
  }

  const handleCloseSidebar = () => {
    setSelectedPosition(null)
    setIsSidebarOpen(false)
  }
  const handleLocationClick = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 15) // Adjust zoom level as needed
      // setSelectedPosition([latitude, longitude])
    }
  }
  return (
    <div className="flex flex-1 relative">
      {/* Map */}
      <div className="absolute z-20 top-10 left-2 ">
        <div className="bg-gray-900 shadow-lg">
          <div className="relative">
            <Button
              variant={actionType === "search" ? "default" : "secondary"}
              className="rounded-none"
              onClick={() => {
                setActionType((prev) => (prev === "search" ? "" : "search"))
                setIsSidebarOpen(false)
              }}
            >
              <SearchIcon />
            </Button>
            {actionType === "search" && (
              <div className="absolute left-full top-0">
                <div className="bg-gray-950 flex p-2 rounded-t gap-2">
                  <Input placeholder="Search..." onChange={(e)=>{
                    setSearchText(e.currentTarget.value);
                  }} />
                  <Button variant={"secondary"} className="px-2">
                    <SearchIcon />
                  </Button>
                </div>
                <ul className="bg-gray-900  rounded-b shadow divide-y divide-gray-200 w-[25vw]">
                  {locationList?.filter((item)=>{
                    return item.name.toLowerCase().includes(searchText.toLowerCase())
                  })?.map((location) => (
                    <li
                      onClick={() =>
                        handleLocationClick(
                          location.latitude,
                          location.longitude,
                        )
                      }
                      key={location.id}
                      className="px-4 py-2 flex gap-2 items-center cursor-pointer"
                    >
                      {LocationItemConfig?.[location.type as any] || (
                        <LocateIcon />
                      )}
                      <div>
                        <div>{location.name}</div>
                        <div className="text-xs text-gray-300">
                          ({location.latitude}, {location.longitude})
                        </div>
                      </div>
                      <ArrowRight className="ml-auto" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button
            variant={actionType === "add" ? "default" : "secondary"}
            className="rounded-none"

            onClick={() => {
              if (actionType === "add") {
                setActionType("")
                setSelectedPosition(null)
                setIsSidebarOpen(false)
              } else {
                setActionType("add")
                const coords = mapRef.current.getCenter()
                setSelectedPosition([coords.lat, coords.lng])
                setIsSidebarOpen(true)
              }
            }}
          >
            <Plus />
          </Button>
        </div>
      </div>
      <div className="flex-grow flex relative h-full z-0">
        <div className="absolute z-20 mx-auto flex w-full h-full pointer-events-none">
          <div className=" mx-auto  pointer-events-auto mt-auto">
            {/* <MapFloatingDock /> */}
          </div>
        </div>

        <MapContainer
          ref={mapRef}
          center={[28.7041, 77.1025]} // Center at Delhi
          zoom={10}
          style={{ height: "100%", width: "100%", zIndex: 0, borderRadius: 5 }}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locationList?.map((business) => (
            <Marker
              key={business.id}
              position={[business.latitude, business.longitude]}
              icon={customIcon}
              shadowPane="true"
            >
              <Popup>
                <strong>{business.name}</strong>
                <br />
                Type: {business.type}
                <br />
                Address: {business.address}
                <br />
                Contact: {business.contact}
              </Popup>
            </Marker>
          ))}
          {selectedPosition && (
            <Marker
              position={selectedPosition}
              icon={newCustomIcon}
              draggable
              eventHandlers={{
                dragend: handleMarkerDrag,
              }}
            >
              <Popup>Drag me to adjust location!</Popup>
            </Marker>
          )}
          <MapClickHandler />
        </MapContainer>
      </div>
      {/* <div className="absolute w-full h-full  flex items-end ">
      
      </div> */}
      {/* <div className="backdrop-blur-sm absolute right-5 top-12 z-30 h-[89vh] w-72 dark:bg-gray-900/20">ds</div> */}

      {/* Sidebar */}
      {isSidebarOpen && (
        <AddNewLocationForm
          // onSubmit={handleAddLocation}
          onCloseSidebar={handleCloseSidebar}
          initialCoordinates={{
            latitude: (selectedPosition as [number, number])[0],
            longitude: (selectedPosition as [number, number])[1],
          }}
        />
      )}
    </div>
  )
}

export default MapComponent
