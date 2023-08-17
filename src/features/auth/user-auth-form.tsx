"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSendOTPMutation } from "@/features/auth/authAPI"
import { useToast } from "@/components/ui/use-toast"
import { selectCurrentEmail, setEmail } from "@/features/auth/authSlice"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  RegisterScreenType,
  registerScreens,
} from "../../pages/authentication/page"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  setOtpScreen: React.Dispatch<React.SetStateAction<RegisterScreenType>>
}
export const userAuthSchema = z.object({
  email: z.string().email(),
})
type FormData = z.infer<typeof userAuthSchema>
export function UserAuthForm({
  setOtpScreen,
  className,
  ...props
}: UserAuthFormProps) {
  const { toast } = useToast()
  const [sendOTP, { isLoading }] = useSendOTPMutation()
  const email = useAppSelector(selectCurrentEmail)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: { email },
  })

  const dispatch = useAppDispatch()

  const onSubmit = async (formData: FormData) => {
    console.log({ formData })
    dispatch(setEmail({ email: formData.email }))
    try {
      const result = await sendOTP(formData).unwrap()
      if (result.statusCode === 200) {
        console.log(result.message)
        toast({
          title: result.message,
        })
        setOtpScreen(registerScreens.OTP)
      } else {
        toast({
          variant: "destructive",
          title: result.message,
        })
      }
    } catch (error: any) {
      console.log({ error })
      toast({
        variant: "destructive",
        title: error.data.message,
        // description: error.data.message,
      })
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            {errors.email && (
              <p className={cn("text-sm font-medium text-destructive")}>
                {errors.email.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button>
    </div>
  )
}
