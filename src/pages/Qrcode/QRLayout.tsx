import { SidebarProvider, SidebarTrigger } from "@/components/AppSidebar"
import QRSidebar from "./QRSidebar"

export default function QRLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <QRSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  )
}
