"use client"

import * as React from "react"
import {
  ArrowUpWideNarrowIcon,
  BookOpen,
  Bot,
  Command,
  Frame,
  Map,
  PieChart,
  QrCode,
  Scan,
  ScanIcon,
  Settings2,
  SquareAsteriskIcon,
  Upload,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/AppSidebar"
import { NavMain } from "./components/nav-main"
import { FcGallery } from "react-icons/fc"
import { ROUTES } from "@/Router"
export const QR_ROUTES = {
  QR_CODE: "/qrcode",
  QR_SCAN: "/qrscan",
  QR_UPLOAD: "/qrupload",
}
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Generate QR",
      url: QR_ROUTES.QR_CODE,
      icon: QrCode,
    },
    {
      title: "Scan QR",
      url: QR_ROUTES.QR_SCAN,
      icon: Scan,
    },
    {
      title: "Upload QR",
      url: QR_ROUTES.QR_UPLOAD,
      icon: Upload,
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader><TeamSwitcher teams={data.teams} /></SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
