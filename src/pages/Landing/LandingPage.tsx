import React, { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import {
  Share2,
  QrCode,
  MousePointer,
  Users,
  TextCursorInput,
  Edit3,
  Calendar,
  MapPin,
  Calculator,
  ScanLine,
  FileSpreadsheet,
  ShoppingBag,
  CheckSquare,
  Link as LinkIcon,
  Workflow,
  CloudRain,
  Sparkles,
  FileSignature,
  LogIn,
  ArrowRight,
  Search,
  Check,
  ChevronDown
} from "lucide-react"
import { theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  // Ref for the scroll showcase section
  const showcaseRef = useRef<HTMLDivElement>(null)
  
  // Scroll driven animation values for scroll progress indicator
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Tool definitions
  const tools = [
    {
      title: "Share Content",
      description: "Quickly broadcast notes, files, or copy links to colleagues instantly.",
      icon: Share2,
      link: "/share-content",
      category: "Utility",
      badge: "Fast Share",
    },
    {
      title: "QR Code Suite",
      description: "Generate static/dynamic QR codes, scan via webcam, or upload QR images.",
      icon: QrCode,
      link: "/qrcode",
      category: "Utility",
      badge: "Dynamic QR",
    },
    {
      title: "Draw & Sketch",
      description: "Infinite vector whiteboard canvas to sketch mockups, draw flowcharts, or export layouts.",
      icon: MousePointer,
      link: "/draw",
      category: "Creative",
      badge: "Whiteboard",
    },
    {
      title: "Family Tree",
      description: "Visualize family lineages and hierarchies using customizable nodes.",
      icon: Users,
      link: "/family-tree",
      category: "Visualization",
      badge: "Tree Graph",
    },
    {
      title: "Form Builder",
      description: "Drag-and-drop form creator to build, preview, and collect responses.",
      icon: TextCursorInput,
      link: "/form-list",
      category: "Productivity",
      badge: "No-Code Forms",
    },
    {
      title: "Rich Text Editor",
      description: "Markdown-capable text editor with code highlight blocks and checklist structures.",
      icon: Edit3,
      link: "/editor",
      category: "Creative",
      badge: "Rich Doc",
    },
    {
      title: "Event Calendar",
      description: "Manage milestones, tasks, and scheduling inside an interactive monthly grid.",
      icon: Calendar,
      link: "/calendar",
      category: "Productivity",
      badge: "Scheduler",
    },
    {
      title: "Map & Location",
      description: "Plot custom coordinates, view map tiles, and track navigation parameters.",
      icon: MapPin,
      link: "/location",
      category: "Visualization",
      badge: "Geospatial",
    },
    {
      title: "Plan Tax",
      description: "Financial modeling workspace to calculate tax margins and log plans.",
      icon: Calculator,
      link: "/calculate-tax",
      category: "Productivity",
      badge: "Finance",
    },
    {
      title: "Scan Image Text (OCR)",
      description: "Extract txt data from local images or documents in seconds using optical characters.",
      icon: ScanLine,
      link: "/ocr",
      category: "Utility",
      badge: "OCR Engine",
    },
    {
      title: "Invoice Generator",
      description: "Create premium billing invoices and export compliant PDF layouts directly.",
      icon: FileSpreadsheet,
      link: "/invoice-pdf",
      category: "Utility",
      badge: "Billing PDF",
    },
    {
      title: "Product Catalog",
      description: "Browse commercial items, manage shopping carts, and structure product catalogs.",
      icon: ShoppingBag,
      link: "/products",
      category: "Productivity",
      badge: "Catalog",
    },
    {
      title: "Task Manager",
      description: "Organize workflows, track to-dos, and change tasks statuses via status checkboards.",
      icon: CheckSquare,
      link: "/task",
      category: "Productivity",
      badge: "Tasks List",
    },
    {
      title: "Gov Services Link",
      description: "Direct shortcuts and unified directory mapping for active government portals.",
      icon: LinkIcon,
      link: "/gov-link",
      category: "Utility",
      badge: "Directory",
    },
    {
      title: "Dependency Box",
      description: "Visual node flows using React Flow to plan component dependency graphs.",
      icon: Workflow,
      link: "/react-flow",
      category: "Visualization",
      badge: "Flow Canvas",
    },
    {
      title: "Weather App",
      description: "Track weather metrics, view city temperatures, and check rain forecasts.",
      icon: CloudRain,
      link: "/weather",
      category: "Utility",
      badge: "Live Forecast",
    },
    {
      title: "AI Playground",
      description: "Test prompt generation and check autonomous LLM responses side-by-side.",
      icon: Sparkles,
      link: "/ai-playground",
      category: "AI & Innovation",
      badge: "Generative AI",
    },
    {
      title: "PDF Editor",
      description: "Upload PDFs, edit text contents, rearrange layouts, and export final revisions.",
      icon: FileSignature,
      link: "/pdf-editor",
      category: "Creative",
      badge: "PDF Annotator",
    },
  ]

  // Unique categories list
  const categories = ["All", "Utility", "Creative", "Productivity", "Visualization", "AI & Innovation"]

  // Filter tools
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Feature story showcases for scroll interactions
  const showcaseStories = [
    {
      id: "draw",
      title: "Whiteboard Drawing & Sketching",
      headline: "Unleash visual concepts with our freehand vector canvas",
      description: "Designed for architects, designer leads, and software developers. The drawing workspace enables vector shapes, freehand brushes, path alignments, and high-quality image exports in one click. Fully integrated with state-persistence so you never lose your draft notes.",
      features: ["Infinite canvas grid panning", "Vector shapes & brushes", "PNG/SVG export modules", "Auto-saves canvas history"],
      color: "from-purple-500/20 to-indigo-500/20 dark:from-purple-900/10 dark:to-indigo-950/10",
      border: "border-purple-500/20 dark:border-purple-400/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      accentBg: "bg-purple-100 dark:bg-purple-950/40",
      icon: MousePointer,
    },
    {
      id: "editor",
      title: "Collaborative Rich Text Workspace",
      headline: "Write notes, create documents, structure code blocks",
      description: "A premium document composer right inside your browser. Write in formatted markdown, inject collapsible checklists, structure technical code syntaxes with syntax-highlight highlights, and export clean TXT files for your local workspace.",
      features: ["Inline block formatting", "Code syntax rendering", "Toggle checklists & lists", "Zero external database delays"],
      color: "from-blue-500/20 to-cyan-500/20 dark:from-blue-900/10 dark:to-cyan-950/10",
      border: "border-blue-500/20 dark:border-blue-400/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      accentBg: "bg-blue-100 dark:bg-blue-950/40",
      icon: Edit3,
    },
    {
      id: "forms",
      title: "Visual No-Code Form Builder",
      headline: "Design validation forms, collect analytics, compile lists",
      description: "An intuitive builder workspace. Drag and drop form controls (inputs, checkboxes, radio selections, dates), construct custom label elements, preview generated form instances in real time, and easily download compiled JSON response lists.",
      features: ["Drag-and-drop form creator", "Schema validator generator", "Response database summaries", "Interactive preview modes"],
      color: "from-emerald-500/20 to-teal-500/20 dark:from-emerald-900/10 dark:to-teal-950/10",
      border: "border-emerald-500/20 dark:border-emerald-400/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      accentBg: "bg-emerald-100 dark:bg-emerald-950/40",
      icon: TextCursorInput,
    },
    {
      id: "ai",
      title: "Generative AI Sandbox",
      headline: "Prompt engineering playground for rapid modeling",
      description: "Unifies modern large language prompts in a responsive testing window. Draft prompts, customize parameters, log AI response logs side-by-side, and immediately isolate results to copy to notes worksheets.",
      features: ["Prompt templates library", "Interactive response boxes", "Redux parameter caching", "One-click copy exports"],
      color: "from-amber-500/20 to-orange-500/20 dark:from-amber-900/10 dark:to-orange-950/10",
      border: "border-amber-500/20 dark:border-amber-400/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      accentBg: "bg-amber-100 dark:bg-amber-950/40",
      icon: Sparkles,
    }
  ]

  return (
    <div className="relative min-h-screen pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-50 origin-[0%]"
        style={{ scaleX }}
      />

      {/* Floating abstract decorative background items */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-gradient-to-br from-indigo-200/20 via-violet-200/10 to-transparent dark:from-indigo-900/10 dark:via-violet-900/5 dark:to-transparent blur-3xl" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[70%] rounded-full bg-gradient-to-bl from-indigo-200/20 via-sky-200/15 to-transparent dark:from-indigo-900/10 dark:via-sky-950/5 dark:to-transparent blur-3xl" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 backdrop-blur-sm"
          >
            <Sparkles className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Unified Web Tool suite</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={theme.typography.heroTitle}
          >
            All-in-One Utility Work Workspace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Simplify your workflow with a unified layout. Create notes, compose docs, plan events, draw vectors, scan OCR layers, generate invoices, and sandbox AI inputs.
          </motion.p>

          {/* Search bar inside Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="max-w-lg mx-auto pt-4 relative"
          >
            <div className="relative group shadow-lg shadow-slate-200/30 dark:shadow-none rounded-xl">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Find a utility tool (e.g. Draw, QR Code, PDF)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200"
              />
            </div>
          </motion.div>
        </div>

        {/* Floating anchor scroll indicator */}
        <div className="pt-12 flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors"
            onClick={() => showcaseRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </div>
      </section>

      {/* UTILITIES HUB SECTION */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 border-b border-slate-200/40 dark:border-slate-800/40 pb-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200",
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Grid Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTools.map((tool, idx) => {
            const ToolIcon = tool.icon

            return (
              <motion.div
                key={tool.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative"
              >
                <Link
                  to={tool.link}
                  className={theme.classes.cardInteractive}
                  style={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                  {/* Subtle hovered HSL glow border */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-indigo-500/20 rounded-xl pointer-events-none transition-all duration-300" />
                  
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top row: Icon & Badge */}
                      <div className="flex items-start justify-between">
                        <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          <ToolIcon className="h-6 w-6" />
                        </div>
                        <span className={theme.classes.badgeIndigo}>{tool.badge}</span>
                      </div>

                      {/* Header & Body */}
                      <div className="space-y-2 mt-4">
                        <h3 className={theme.typography.cardTitle}>{tool.title}</h3>
                        <p className={cn(theme.typography.body, "text-xs line-clamp-3")}>
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Callout */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-auto">
                      <span className={theme.classes.badgeMuted}>{tool.category}</span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                        Launch <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="text-slate-400 dark:text-slate-600 text-sm">No utility tools match your search criteria.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* SCROLL BASED INTERACTIVE SHOWCASE SECTION */}
      <section
        ref={showcaseRef}
        className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-24 border-t border-slate-200/50 dark:border-slate-900/50 mt-16 space-y-24"
      >
        <div className="text-center space-y-3 max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Deep Dive Features</span>
          <h2 className={theme.typography.sectionTitle}>Discover Feature Stories</h2>
          <p className={theme.typography.body}>
            Scroll down to review the core utility tools, designed with high-efficiency layout blocks and reactive states.
          </p>
        </div>

        {/* SCROLL REVEALS */}
        {showcaseStories.map((story, index) => {
          const StoryIcon = story.icon
          const isEven = index % 2 === 0

          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br p-8 md:p-12 rounded-2xl border backdrop-blur-sm",
                story.color,
                story.border,
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              {/* Left/Right Text Details */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-lg", story.accentBg, story.iconColor)}>
                    <StoryIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">{story.title}</h3>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {story.headline}
                  </h4>
                  <p className={theme.typography.body}>
                    {story.description}
                  </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {story.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <Link
                    to={tools.find(t => t.title.toLowerCase().includes(story.id))?.link || "/"}
                    className={theme.classes.buttonPrimary}
                  >
                    Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Decorative Story Visual Representation */}
              <div className="flex-1 w-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent blur-2xl rounded-full" />
                <motion.div
                  whileHover={{ scale: 1.02, rotate: isEven ? 1 : -1 }}
                  className="relative p-8 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur shadow-lg w-full max-w-sm aspect-[4/3] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Simulated App Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2 text-[10px] text-slate-400 font-mono">
                      <span>workspace_draft.json</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>

                    {/* Simulated layout sketch blocks */}
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="h-8 bg-slate-100 dark:bg-slate-800/50 border border-slate-200/30 dark:border-slate-700/30 rounded" />
                        <div className="h-8 bg-slate-100 dark:bg-slate-800/50 border border-slate-200/30 dark:border-slate-700/30 rounded" />
                        <div className="h-8 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/30 dark:border-indigo-700/30 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Micro-interaction stats */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                    <span>Active workspace</span>
                    <span className="font-mono text-indigo-500">100% Client-Side</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </section>

      {/* SAAS CALLOUT FOOTER */}
      <footer className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-16 mt-16 border-t border-slate-200/40 dark:border-slate-900/40">
        <p className="text-xs text-slate-400 dark:text-slate-600 font-mono">
          Designed and engineered as a Premium Web Work suite. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
