import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
// import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { FcGoogle } from "react-icons/fc"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GithubIcon, Loader } from "lucide-react"
import { userLoginSchema } from "../userAuthSchema"
import {
  GoogleLogin,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google"
import { ROUTES } from "@/Router"
import { useLoginApiMutation, useLoginMutation } from "@/features/auth/authAPI"
import PasswordInput from "@/features/auth/components/PasswordInput"
import { useAppDispatch } from "@/app/hooks"
import { setEmail } from "@/features/auth/authSlice"
import { theme } from "@/lib/theme"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export type UserLoginType = z.infer<typeof userLoginSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginType>({
    resolver: zodResolver(userLoginSchema),
  })
  // const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse)

      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialResponse.access_token}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${credentialResponse.access_token}`,
            Accept: "application/json",
          },
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error)
        })
    },
    onError: () => {
      console.log("Login Failed")
    },
  })
  const dispatch = useAppDispatch()

  const navigate = useNavigate()
  const [loginManual, { isLoading }] = useLoginApiMutation();
  const onSubmit = async (data: UserLoginType) => {
    // setIsLoading(true)
    console.log({ data })
    try {
      const result = await loginManual(data).unwrap();
      console.log({result})

      if (result?.statusCode === 200) {
        const userInfo = {email:result.data?.user?.email,id:result.data?.user?.id}
        dispatch(setEmail(userInfo))
        localStorage.setItem("userInfo",JSON.stringify(userInfo))
        navigate(ROUTES.DASHBOARD)
        return
      } else {
        return toast({
          title: "Login failed",
          description: result.message || "Please check credentials",
        })
      }
    } catch (error: any) {
      console.log({ error })
      toast({
        title: "Login error",
        description: error?.data?.error || "An unexpected error occurred.",
      })
      // return toast({
      //   title: "Login error",
      //   description: (
      //     <ul>
      //       {error.message 
      //       // || error.data.map((el: any) => {
      //       //     return <li>{el.message}</li>
      //       //   })
      //         }
      //     </ul>
      //   ),
      // })
    }

    // const signInResult = await signIn("email", {
    //     email: data.email.toLowerCase(),
    //     redirect: false,
    //     callbackUrl: searchParams?.get("from") || "/dashboard",
    // })

    // setIsLoading(false)

    // if (!signInResult?.ok) {
    //     return toast({
    //         title: "Something went wrong.",
    //         description: "Your sign in request failed. Please try again.",
    //         variant: "destructive",
    //     })
    // }

    // return toast({
    //   title: "Check your email",
    //   description: "We sent you a login link. Be sure to check your spam too.",
    // })
  }
  // const responseMessage = (response) => {
  //   console.log(response)
  // }
  // const errorMessage = (error) => {
  //   console.log(error)
  // }

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label className={theme.classes.label} htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className={theme.classes.input}
              disabled={isLoading || isGitHubLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-500 font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className={theme.classes.label} htmlFor="Password">
              Password
            </Label>
            <PasswordInput
              id="Password"
              placeholder="••••••••"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              className={theme.classes.input}
              disabled={isLoading || isGitHubLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-500 font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className={cn(theme.classes.buttonPrimary, "w-full mt-2 py-2.5")} disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </button>
        </div>
      </form>
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className={cn(theme.classes.buttonOutline, "w-full gap-2 py-2.5")}
          onClick={() => {
            setIsGitHubLoading(true)
          }}
          disabled={isLoading || isGitHubLoading}
        >
          {isGitHubLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <GithubIcon className="h-4 w-4 text-slate-800 dark:text-slate-200" />
          )}{" "}
          Github
        </button>
        <button
          type="button"
          className={cn(theme.classes.buttonOutline, "w-full gap-2 py-2.5")}
          onClick={() => {
            login()
          }}
          disabled={isLoading || isGitHubLoading}
        >
          <FcGoogle className="h-4 w-4" />{" "}
          Google
        </button>
      </div>
    </div>
  )
}
