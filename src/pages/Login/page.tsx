import React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { UserAuthForm } from "./components/loginForm"
import { Icons } from "@/components/icons"
import { theme } from "@/lib/theme"

export const LoginPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-950 dark:via-indigo-950/10 dark:to-slate-900 p-4 overflow-hidden">
      {/* Decorative ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Link
        to="/"
        className={cn(
          theme.classes.buttonGhost,
          "absolute left-4 top-4 md:left-8 md:top-8 gap-2 z-10",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div
        className={cn(
          theme.classes.cardGlass,
          "relative w-full max-w-[420px] p-8 md:p-10 shadow-2xl rounded-2xl flex flex-col space-y-6 border border-white/20 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl",
        )}
      >
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto bg-indigo-600/10 dark:bg-indigo-400/10 p-3 rounded-2xl w-fit mb-2 border border-indigo-500/20">
            <Icons.logo className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access your workspace
          </p>
        </div>

        <UserAuthForm />

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline underline-offset-4 transition-colors"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
