import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { FieldError } from "react-hook-form"
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  defaultType?: "password" | "text"
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ defaultType, ...props }, ref) => {
    const [type, setType] = useState<"password" | "text">(
      defaultType || "password",
    )
    const togglePasswordVisibility = () => {
      setType((t) => (t === "password" ? "text" : "password"))
    }
    return (
      <div className="relative mb-3">
        <Input type={type} ref={ref} {...props} />
        <button
          type="button"
          className="absolute right-4 top-3 text-gray-500 w-5 h-5"
          onClick={togglePasswordVisibility}
        >
          {type === "password" ? (
            <AiOutlineEye className="w-full h-full" title="View" />
          ) : (
            <AiOutlineEyeInvisible className="w-full h-full" title="Hide" />
          )}
        </button>
      </div>
    )
  },
)
export default PasswordInput
