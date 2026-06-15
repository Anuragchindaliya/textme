import React from "react"
import { FloatingDock } from "@/components/ui/floating-dock"
import Image from "next/image"
import { Github, Home, LogInIcon, Newspaper, Terminal } from "lucide-react"
import { FcCurrencyExchange, FcFactoryBreakdown, FcHome } from "react-icons/fc"

export function MapFloatingDock() {
  const links = [
    {
      title: "Home",
      icon: (
        <FcHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Products",
      icon: (
        <Terminal className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <Newspaper className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Aceternity UI",
      icon: <LogInIcon />,
      href: "#",
    },
    {
      title: "Changelog",
      icon: (
        <FcCurrencyExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Twitter",
      icon: (
        <FcFactoryBreakdown className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <Github className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ]
  return (
    <div className="flex items-center justify-center h-[8rem] w-full z-30">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  )
}
