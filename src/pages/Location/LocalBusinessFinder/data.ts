export interface Business {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
  contact: string;
}

export const businesses: Business[] = [
  {
    id: 1,
    name: "The Coffee Spot",
    type: "Cafe",
    latitude: 28.7041,
    longitude: 77.1025,
    address: "Connaught Place, Delhi",
    contact: "9876543210",
  },
  {
    id: 2,
    name: "Bookworm Heaven",
    type: "Bookstore",
    latitude: 28.5355,
    longitude: 77.3910,
    address: "Sector 18, Noida",
    contact: "9876543211",
  },
  {
    id: 3,
    name: "Fitness First",
    type: "Gym",
    latitude: 28.4595,
    longitude: 77.0266,
    address: "MG Road, Gurgaon",
    contact: "9876543212",
  },
];
