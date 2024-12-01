import React, { useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  ZoomControl,
} from "react-leaflet"
import { Icon } from "leaflet"
import { Business, businesses } from "./data"
import AddNewLocationForm from "./AddNewLocationForm"
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
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png", // Replace with your icon URL
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const MapComponent: React.FC = () => {
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
  return (
    <div className="flex flex-1">
      {/* Map */}
      <div className="flex-grow relative h-full">
        <MapContainer
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
              icon={customIcon}
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
