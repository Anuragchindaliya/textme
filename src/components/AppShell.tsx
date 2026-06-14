import React, { useState, useEffect } from "react"
import { NavLink, Link, useLocation, Outlet } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { selectCurrentEmail, removeAuth } from "@/features/auth/authSlice"
import { motion, AnimatePresence } from "framer-motion"
import {
  Share2,
  QrCode,
  MousePointerClick,
  Users2,
  TextCursorInput,
  Edit,
  CalendarCheck,
  Map,
  Calculator,
  TextCursor,
  FileText,
  ShoppingCart,
  CheckSquare,
  Link2,
  Box,
  CloudDrizzle,
  FileEdit,
  LogIn,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  Search,
  Bell,
  User,
  ExternalLink,
  Laptop,
  ChevronDown,
  ChevronUp,
  Scan,
  Upload,
  ScanLine
} from "lucide-react"
import { AiOutlineAntDesign } from "react-icons/ai"
import { ROUTES } from "@/Router"
import { theme } from "@/lib/theme"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/pages/Notes/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const AppShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const location = useLocation()

  // State for QR code dropdown expansion
  const [isQrExpanded, setIsQrExpanded] = useState(false)
  const dispatch = useAppDispatch()
  const email = useAppSelector(selectCurrentEmail)

  // Auto-expand QR menu if any QR page is active
  const qrPaths = ["/qrcode", "/qrscan", "/qrupload", "/qrl"]
  const isQrPageActive = qrPaths.some(path => location.pathname.startsWith(path))

  useEffect(() => {
    if (isQrPageActive) {
      setIsQrExpanded(true)
    } else {
      setIsQrExpanded(false)
    }
  }, [location.pathname, isQrPageActive])

  // Full list of utility features
  const sidebarLinks = [
    { title: "Dashboard", icon: LayoutGrid, link: "/" },
    { title: "Notes Playground", icon: Edit, link: "/notes" },
    { title: "Share Content", icon: Share2, link: ROUTES.SHARE_CONTENT },
    {
      title: "QR Code",
      icon: QrCode,
      link: ROUTES.QR_CODE,
      isDropdown: true,
      children: [
        { title: "Generate QR", icon: QrCode, link: ROUTES.QR_CODE },
        { title: "Scan QR", icon: Scan, link: ROUTES.QR_SCAN },
        { title: "Upload QR", icon: Upload, link: ROUTES.QR_UPLOAD },
        { title: "Dynamic QRL", icon: ScanLine, link: ROUTES.QRL_DYNAMIC },
      ]
    },
    { title: "Draw & Sketch", icon: MousePointerClick, link: ROUTES.DRAW },
    { title: "Family Tree", icon: Users2, link: ROUTES.FAMILY_TREE },
    { title: "Form Builder", icon: TextCursorInput, link: ROUTES.FORMS },
    { title: "Rich Text Editor", icon: FileEdit, link: ROUTES.EDITOR },
    { title: "Event Calendar", icon: CalendarCheck, link: ROUTES.CALENDAR },
    { title: "Map & Location", icon: Map, link: ROUTES.LOCATION },
    { title: "Plan Tax", icon: Calculator, link: ROUTES.TAX_CALCULATOR },
    { title: "Scan Image Text (OCR)", icon: TextCursor, link: ROUTES.OCR },
    { title: "Invoice Generator", icon: FileText, link: ROUTES.PDF },
    { title: "Product Catalog", icon: ShoppingCart, link: ROUTES.PRODUCTS },
    { title: "Task Manager", icon: CheckSquare, link: ROUTES.TASK },
    { title: "Government Services", icon: Link2, link: ROUTES.GOV_LINK },
    { title: "Dependency Box", icon: Box, link: ROUTES.REACT_FLOW },
    { title: "Weather App", icon: CloudDrizzle, link: ROUTES.WEATHER },
    { title: "AI Playground", icon: Sparkles, link: ROUTES.AI_PLAYGROUND },
    { title: "PDF Editor", icon: FileEdit, link: ROUTES.PDF_EDITOR },
  ]

  // Filter links based on search query in the sidebar
  const filteredLinks = sidebarLinks.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Find current tool for Breadcrumb/Navbar Title
  // Look in parent links and sub-children too
  const findActiveTool = () => {
    for (const link of sidebarLinks) {
      if (link.link === location.pathname) return link
      if (link.children) {
        const activeChild = link.children.find(c => c.link === location.pathname)
        if (activeChild) return activeChild
      }
    }
    return null
  }
  const activeTool = findActiveTool()
  const activeTitle = activeTool ? activeTool.title : "Suite Tool"

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* 1. DESKTOP SIDEBAR - Animated width */}
      <motion.aside
        animate={{ width: isCollapsed ? 76 : 260 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 border-r border-slate-200/50 dark:border-slate-900/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-30 overflow-hidden"
        )}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/40 dark:border-slate-900/40">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-100 dark:to-slate-300"
              >
                TextMe Suite
              </motion.span>
            )}
          </Link>
        </div>

        {/* Sidebar Search - only visible when expanded */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-600" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation Link Area */}
        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="space-y-1.5">
            {filteredLinks.map((item, index) => {
              const IconComponent = item.icon

              if (item.isDropdown) {
                const isChildActive = item.children?.some(child => location.pathname.startsWith(child.link))
                const isActive = isChildActive || location.pathname.startsWith(item.link)

                return (
                  <div key={index} className="space-y-1.5">
                    {/* Collapsible Trigger Row */}
                    <div
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group relative duration-200",
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200"
                      )}
                    >
                      <Link
                        to={item.link}
                        className="flex items-center gap-3 flex-1 overflow-hidden"
                      >
                        <IconComponent className={cn(
                          "h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                          isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                        )} />
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </Link>

                      {!isCollapsed && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsQrExpanded(!isQrExpanded)
                          }}
                          className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        >
                          {isQrExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}

                      {/* Icon tooltips when sidebar is collapsed */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-md font-sans whitespace-nowrap">
                          {item.title}
                        </div>
                      )}
                    </div>

                    {/* Expandable Child Sub-links */}
                    {!isCollapsed && isQrExpanded && item.children && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-7 space-y-1 overflow-hidden border-l border-slate-200 dark:border-slate-800 ml-5"
                      >
                        {item.children.map((child, cIndex) => {
                          const ChildIcon = child.icon
                          const isChildPageActive = location.pathname === child.link

                          return (
                            <NavLink
                              key={cIndex}
                              to={child.link}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                                isChildPageActive
                                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 font-semibold"
                                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/30"
                              )}
                            >
                              <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                              <span>{child.title}</span>
                            </NavLink>
                          )
                        })}
                      </motion.div>
                    )}
                  </div>
                )
              }

              const isActive =
                item.link === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.link)

              return (
                <NavLink
                  key={index}
                  to={item.link}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative duration-200",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-l-2 border-indigo-600 dark:border-indigo-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <IconComponent className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                  )} />
                  
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.title}
                    </motion.span>
                  )}

                  {/* Icon tooltips when sidebar is collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-md font-sans whitespace-nowrap">
                      {item.title}
                    </div>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </ScrollArea>


        {/* Collapse Toggle Footer */}
        <div className="p-3 border-t border-slate-200/40 dark:border-slate-900/40 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          {!isCollapsed && (
            <div className="text-[10px] text-slate-400 font-mono">v1.2.0-SaaS</div>
          )}
        </div>
      </motion.aside>

      {/* 2. MAIN LAYOUT SHELL CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOP HEADER / NAVBAR */}
        <header className={theme.classes.glassNav}>
          <div className="h-16 flex items-center justify-between px-4 sm:px-6">
            
            {/* Left: Mobile Navigation Trigger + Breadcrumbs */}
            <div className="flex items-center gap-3">
              {/* Mobile Drawer Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 flex flex-col h-full bg-white dark:bg-slate-950">
                  <SheetHeader className="p-5 border-b border-slate-100 dark:border-slate-900">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-bold text-base text-slate-900 dark:text-white">ShareText Tools</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  {/* Mobile Search */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-900">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search all utilities..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <ScrollArea className="flex-1 px-3 py-2">
                    <nav className="space-y-1">
                      {filteredLinks.map((item, index) => {
                        const IconComponent = item.icon

                        if (item.isDropdown) {
                          const isChildActive = item.children?.some(child => location.pathname.startsWith(child.link))
                          const isActive = isChildActive || location.pathname.startsWith(item.link)

                          return (
                            <div key={index} className="space-y-1">
                              <div
                                className={cn(
                                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                  isActive
                                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900"
                                )}
                              >
                                <SheetTrigger asChild>
                                  <Link to={item.link} className="flex items-center gap-3 flex-1">
                                    <IconComponent className="h-5 w-5 text-slate-400" />
                                    <span>{item.title}</span>
                                  </Link>
                                </SheetTrigger>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setIsQrExpanded(!isQrExpanded)
                                  }}
                                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-400"
                                >
                                  {isQrExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              {isQrExpanded && item.children && (
                                <div className="pl-7 space-y-1 border-l border-slate-150 dark:border-slate-800 ml-5">
                                  {item.children.map((child, cIdx) => {
                                    const ChildIcon = child.icon
                                    const isChildPageActive = location.pathname === child.link

                                    return (
                                      <SheetTrigger asChild key={cIdx}>
                                        <NavLink
                                          to={child.link}
                                          className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all",
                                            isChildPageActive
                                              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20 font-semibold"
                                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                                          )}
                                        >
                                          <ChildIcon className="h-3.5 w-3.5" />
                                          <span>{child.title}</span>
                                        </NavLink>
                                      </SheetTrigger>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        }

                        const isActive =
                          item.link === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(item.link)

                        return (
                          <SheetTrigger asChild key={index}>
                            <NavLink
                              to={item.link}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-l-2 border-indigo-600 dark:border-indigo-400"
                                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                              )}
                            >
                              <IconComponent className="h-5 w-5 text-slate-400" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SheetTrigger>
                        )
                      })}

                    </nav>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Breadcrumbs */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 font-sans">
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Suite</Link>
                <span>/</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{activeTitle}</span>
              </div>
            </div>

            {/* Right Side: Global actions, theme toggle, profile drop menu */}
            <div className="flex items-center gap-3">
              {/* Theme Selector */}
              <ModeToggle />

              {/* Notifications Mock */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full"
              >
                <Bell className="h-4 w-4" />
              </Button>

              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

              {/* Profile Avatar Dropdown */}
              {email ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                      <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-800">
                        <AvatarImage src="" alt="User profile" />
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                          {email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">User Account</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings/appearance" className="w-full flex items-center cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>Appearance Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => dispatch(removeAuth())}
                      className="w-full flex items-center cursor-pointer text-red-600 dark:text-red-400"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs py-1.5 px-3 rounded-lg font-medium">
                  <Link to={ROUTES.LOGIN}>
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>


        {/* WORKSPACE & TRANSITIONAL OUTLET PAGE */}
        <main className="flex-1 overflow-y-auto flex flex-col relative bg-slate-50 dark:bg-slate-950">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default AppShell
