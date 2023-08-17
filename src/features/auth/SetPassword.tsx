import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateAccountMutation } from "./authAPI"
import { useAppSelector } from "@/app/hooks"
import { selectCurrentEmail } from "./authSlice"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/Router"
import PasswordInput from "./components/PasswordInput"

const setPasswordSchema = z
  .object({
    name: z.string().nonempty(),
    password: z
      .string()
      .nonempty("Password required")
      .regex(
        /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: "Password is weak" },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
export type SetPasswordType = z.infer<typeof setPasswordSchema>

const SetPassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SetPasswordType>({
    resolver: zodResolver(setPasswordSchema),
  })
  const [createAccount, { isLoading }] = useCreateAccountMutation()
  const email = useAppSelector(selectCurrentEmail)
  const { toast } = useToast()
  const navigate = useNavigate()
  const onSubmit = async (data: SetPasswordType) => {
    try {
      const result = await createAccount({ ...data, email }).unwrap()
      if (result.statusCode === 201) {
        console.log(result.message)
        navigate(ROUTES.LOGIN)
        toast({
          title: result.message,
        })
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
    // console.log({ data })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className={"text-sm font-medium text-destructive"}>
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" {...register("password")} />
          {errors.password && (
            <p className={"text-sm font-medium text-destructive"}>
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className={"text-sm font-medium text-destructive"}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit">Save changes</Button>
      </CardFooter>
    </form>
  )
}

export default SetPassword
