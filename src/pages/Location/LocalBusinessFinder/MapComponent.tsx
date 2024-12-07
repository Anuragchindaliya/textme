import { Button } from "@/components/ui/button"
import { Icon } from "leaflet"
import {
  ArrowRight,
  BookPlus,
  Coffee,
  Dumbbell,
  LocateIcon,
  SearchIcon
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
import { Business, businesses } from "./data"
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
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/OOjs_UI_icon_mapPin-progressive.svg", // Replace with your icon URL
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})


const LocationItemConfig = {
  Cafe:<Coffee />,
  Bookstore:<BookPlus />,
  Gym:<Dumbbell />
} as any

const MapComponent: React.FC = () => {
  const mapRef = useRef<any | null>(null)
  const [locationList, setLocationList] = useState<Business[]>(businesses)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null)
  // Map click to add a new marker
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng])
        setIsSidebarOpen(true)
      },
    })
    return null
  }

  // Update marker position dynamically
  const handleMarkerDrag = (event: any) => {
    const { lat, lng } = event.target.getLatLng()
    setSelectedPosition([lat, lng])
  }

  // Handle form submission to add a new location
  const handleAddLocation = (data: Omit<BusinessLocation, "id">) => {
    if (selectedPosition) {
      // setLocationList((prev) => [
      //   ...prev,
      //   {
      //     id: prev.length + 1,
      //     ...data,
      //     latitude: (selectedPosition as [number, number])[0],
      //     longitude: (selectedPosition as [number, number])[1],
      //   },
      // ])
      setSelectedPosition(null) // Reset selected position
    }
  }
  const handleCloseSidebar = () => {
    setSelectedPosition(null)
    setIsSidebarOpen(false)
  }
  const handleLocationClick = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([latitude, longitude], 15) // Adjust zoom level as needed
      setSelectedPosition([latitude, longitude])
    }
  }
  console.log({ mapRef })
  return (
    <div className="flex flex-1 relative">
      {/* Map */}
      <div className="absolute z-20 top-10 left-2 ">
        <Button variant={"secondary"} className="px-2">
          <SearchIcon />
        </Button>
        <ul className="bg-gray-900 p-4 rounded-md shadow divide-y divide-gray-200">
          {locationList.map((location) => (
            <li
              onClick={() =>
                handleLocationClick(location.latitude, location.longitude)
              }
              key={location.id}
              className="p-2 flex gap-2 items-center cursor-pointer"
            >
              {LocationItemConfig?.[location.type as any] || <LocateIcon />}
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
          {locationList.map((business) => (
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
