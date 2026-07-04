import React from "react"
import { BarChart3, ChevronRight, Settings, Sparkles, TrendingUp } from "lucide-react"
import { UsageStats } from "./types"

interface UsageDashboardProps {
  stats: UsageStats
  onCeilingChange: (ceiling: number) => void
  isOpen: boolean
  onToggle: () => void
}

export const UsageDashboard: React.FC<UsageDashboardProps> = ({
  stats,
  onCeilingChange,
  isOpen,
  onToggle,
}) => {
  const percentage = Math.min(
    100,
    Math.round((stats.totalTokens / stats.ceiling) * 100) || 0,
  )

  // Circle properties for SVG gauge
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const [isEditingCeiling, setIsEditingCeiling] = React.useState(false)
  const [tempCeiling, setTempCeiling] = React.useState(stats.ceiling.toString())

  const handleSaveCeiling = () => {
    const val = parseInt(tempCeiling, 10)
    if (!isNaN(val) && val > 0) {
      onCeilingChange(val)
      setIsEditingCeiling(false)
    }
  }

  return (
    <>
      {/* Collapsed floating launcher - Hidden on mobile to prevent overlapping */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden xl:flex fixed right-4 bottom-24 z-40 items-center gap-2 p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group border border-white/10"
          title="Open Usage Analytics"
        >
          <BarChart3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm font-semibold pr-1 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap">
            Usage Stats
          </span>
        </button>
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-[64px] right-0 bottom-0 z-40 w-80 bg-slate-50/95 dark:bg-slate-950/80 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col transition-all duration-500 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-800 dark:text-white tracking-wide">
                Usage Analytics
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-400">Real-time token metrics</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Analytics Info */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
          {/* Gauge display */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/50 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-50/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-800/80 fill-none"
                  strokeWidth="8"
                />
                {/* Indicator circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-indigo-500 fill-none transition-all duration-500 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Label */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                  {percentage}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  Capacity
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-650 dark:text-slate-300 text-center">
              {stats.totalTokens.toLocaleString()} /{" "}
              {stats.ceiling.toLocaleString()} tokens used
            </p>
          </div>

          {/* Individual counters */}
          <div className="space-y-3">
            {/* Prompt tokens */}
            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/35 border border-slate-200 dark:border-slate-800/60 rounded-xl flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Prompt
                </span>
                <h3 className="text-xl font-bold text-slate-855 dark:text-white mt-0.5">
                  {stats.promptTokens.toLocaleString()}
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-200/50 dark:bg-slate-800/40 px-2 py-1 rounded-md border border-slate-250 dark:border-slate-800/60">
                Input Tokens
              </span>
            </div>

            {/* Response tokens */}
            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/35 border border-slate-200 dark:border-slate-800/60 rounded-xl flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Response
                </span>
                <h3 className="text-xl font-bold text-slate-855 dark:text-white mt-0.5">
                  {stats.responseTokens.toLocaleString()}
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-200/50 dark:bg-slate-800/40 px-2 py-1 rounded-md border border-slate-250 dark:border-slate-800/60">
                Output Chunks
              </span>
            </div>

            {/* Total tokens */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 dark:from-indigo-950/20 to-slate-100/50 dark:to-slate-900/35 border border-indigo-200 dark:border-indigo-900/30 rounded-xl flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-800/40 transition-all duration-300">
              <div>
                <span className="text-[11px] font-bold text-slate-750 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  Total <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400 inline" />
                </span>
                <h3 className="text-xl font-black text-slate-855 dark:text-white mt-0.5">
                  {stats.totalTokens.toLocaleString()}
                </h3>
              </div>
              <span className="text-xs text-indigo-655 dark:text-indigo-300 font-medium bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-500/20">
                Cumulative
              </span>
            </div>
          </div>

          {/* Ceiling Configuration */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-850">
            {isEditingCeiling ? (
              <div className="space-y-3 bg-slate-100/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800/40">
                <label className="block text-xs font-semibold text-slate-650 dark:text-slate-300">
                  Custom Daily Token Limit:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tempCeiling}
                    onChange={(e) => setTempCeiling(e.target.value)}
                    className="flex-1 p-2 text-sm bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-white font-mono"
                    placeholder="50000"
                  />
                  <button
                    onClick={handleSaveCeiling}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setTempCeiling(stats.ceiling.toString())
                      setIsEditingCeiling(false)
                    }}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-655 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingCeiling(true)}
                className="w-full py-2.5 px-4 bg-slate-100/55 hover:bg-slate-150 dark:bg-slate-900/40 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold hover:text-slate-800 hover:dark:text-white transition-all duration-300 group"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-45 transition-transform duration-300" />
                  Adjust Daily Ceiling
                </span>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/10">
                  {stats.ceiling.toLocaleString()}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/80 text-[10px] text-slate-500 leading-normal text-center">
          Adjust token ceilings based on your API tier. Free tier has a 50,000
          tokens/day baseline.
        </div>
      </div>
    </>
  )
}
