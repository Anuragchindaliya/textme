import { clsx, type ClassValue } from "clsx"
import React, { ReactElement } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type RenderIconProps = {
  icon: ReactElement | string
}

export const RenderIcon: React.FC<RenderIconProps> = ({ icon }) => {
  if (React.isValidElement(icon)) {
    return icon
  }
  if (typeof icon === "string") {
    return <img src={icon} alt="icon" className="w-5 h-5" />
  }
  return null
}
