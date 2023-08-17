import React, { ComponentProps } from "react"
import { UserAuthForm } from "./user-auth-form"
import { RegisterScreenType } from "@/pages/authentication/page"
import { Link } from "react-router-dom"
type RegisterEmailProps = {
  setOtpScreen: React.Dispatch<React.SetStateAction<RegisterScreenType>>
}
const RegisterEmail = ({ setOtpScreen }: RegisterEmailProps) => {
  return (
    <>
      <div className="flex flex-col ">
        <p className="mb-2 text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
        <UserAuthForm setOtpScreen={setOtpScreen} />
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          to="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </>
  )
}

export default RegisterEmail
