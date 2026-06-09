import React from "react"
import { motion } from "framer-motion"
import { theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

interface ToolLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  children,
  actions,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={theme.classes.workspace}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Tool Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/50 dark:border-slate-800/40 pb-5">
          <div className="space-y-1">
            <h1 className={theme.typography.sectionTitle}>
              {title}
            </h1>
            {description && (
              <p className={theme.typography.body}>
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-3">
              {actions}
            </div>
          )}
        </div>

        {/* Tool Content Canvas Wrapper */}
        <div
          className={cn(
            theme.classes.card,
            "p-6 md:p-8 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-sm border border-slate-200/55 dark:border-slate-800/60",
            className
          )}
        >
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export default ToolLayout
