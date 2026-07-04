export interface Product {
  id: string
  name: string
  price: number
  description: string
}

export interface MapData {
  coordinates: {
    lat: number
    lng: number
  }
  locationName: string
}

export interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: number
  tokens?: number
  type?: "text" | "code" | "product" | "map" | "error"
  language?: string
  products?: Product[]
  mapData?: MapData
}

export interface UserSession {
  isLoggedIn: boolean
  email?: string
  token?: string
  id?: string
}

export interface UsageStats {
  promptTokens: number
  responseTokens: number
  totalTokens: number
  ceiling: number
}
