import React, { useState, useRef } from "react"
import { toPng, toJpeg, toCanvas } from "html-to-image"
import beautify from "js-beautify"
import SyntaxHighlighter from "react-syntax-highlighter"
import { Download, Sparkles, Wand2, RefreshCw } from "lucide-react"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  syntaxStyleName,
  themeOptionsConfig,
} from "../../ReactFlow/stylesthemeCode"
import { cn } from "@/lib/utils"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
})

interface CodeScreenshotGeneratorProps {
  code: string
  language: string
  onCodeChange: (value: string) => void
  onLanguageChange: (lang: string) => void
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
]

const PRESET_GRADIENTS = [
  { name: "Sunset Glow", value: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)" },
  { name: "Ocean Breeze", value: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)" },
  { name: "Aurora", value: "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)" },
  { name: "Hyper Purple", value: "linear-gradient(135deg, #8a2387 0%, #e94057 50%, #f27121 100%)" },
  { name: "Cotton Candy", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { name: "Midnight Ash", value: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
  { name: "Cyber Neon", value: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
  { name: "Glassy Violet", value: "linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)" },
]

const PRESET_SOLIDS = [
  { name: "Dark Charcoal", value: "#1e293b" },
  { name: "Slate Blue", value: "#3b82f6" },
  { name: "Emerald Green", value: "#10b981" },
  { name: "Soft Coral", value: "#f43f5e" },
  { name: "Deep Violet", value: "#8b5cf6" },
  { name: "Amber Orange", value: "#f59e0b" },
  { name: "Pure White", value: "#ffffff" },
  { name: "Charcoal Black", value: "#0f172a" },
]

export default function CodeScreenshotGenerator({
  code,
  language,
  onCodeChange,
  onLanguageChange,
}: CodeScreenshotGeneratorProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  // Customization States
  const [theme, setTheme] = useState<string>("atomOneDark")
  const [bgType, setBgType] = useState<"none" | "solid" | "gradient">("gradient")
  const [solidColor, setSolidColor] = useState<string>("#1e293b")
  const [gradientVal, setGradientVal] = useState<string>(PRESET_GRADIENTS[0].value)
  const [customGrad1, setCustomGrad1] = useState<string>("#ff7e5f")
  const [customGrad2, setCustomGrad2] = useState<string>("#feb47b")
  
  const [paddingSize, setPaddingSize] = useState<string>("48")
  const [borderRadius, setBorderRadius] = useState<string>("xl")
  const [shadowStyle, setShadowStyle] = useState<string>("glow")
  const [showMacControls, setShowMacControls] = useState<boolean>(true)
  const [fileName, setFileName] = useState<string>("index.js")
  
  // Export States
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "webp">("png")
  const [exportQuality, setExportQuality] = useState<"hd" | "2k" | "4k">("2k")
  const [isExporting, setIsExporting] = useState<boolean>(false)

  // Format Code Function
  const handleFormatCode = () => {
    if (!code) return
    const options = {
      indent_size: 2,
      space_in_empty_paren: true,
      preserve_newlines: true,
    }
    
    try {
      let formatted = code
      const lang = language.toLowerCase()
      if (lang === "javascript" || lang === "typescript" || lang === "json") {
        formatted = beautify.js(code, options)
      } else if (lang === "html") {
        formatted = beautify.html(code, options)
      } else if (lang === "css") {
        formatted = beautify.css(code, options)
      }
      onCodeChange(formatted)
    } catch (e) {
      console.error("Failed to format code: ", e)
    }
  }

  // Calculate Background Style
  const getBackgroundStyle = () => {
    if (bgType === "none") return { background: "transparent" }
    if (bgType === "solid") return { background: solidColor }
    if (bgType === "gradient") {
      if (gradientVal === "custom") {
        return { background: `linear-gradient(135deg, ${customGrad1} 0%, ${customGrad2} 100%)` }
      }
      return { background: gradientVal }
    }
    return {}
  }

  // Padding Classes
  const getPaddingClass = () => {
    switch (paddingSize) {
      case "16": return "p-4"
      case "32": return "p-8"
      case "48": return "p-12"
      case "64": return "p-16"
      default: return "p-12"
    }
  }

  // Rounded Corner Classes
  const getRoundedClass = () => {
    switch (borderRadius) {
      case "none": return "rounded-none"
      case "sm": return "rounded-sm"
      case "md": return "rounded-md"
      case "lg": return "rounded-lg"
      case "xl": return "rounded-xl"
      case "2xl": return "rounded-2xl"
      default: return "rounded-xl"
    }
  }

  // Shadow Classes
  const getShadowClass = () => {
    switch (shadowStyle) {
      case "none": return "shadow-none"
      case "soft": return "shadow-lg shadow-black/10"
      case "hard": return "shadow-2xl shadow-black/40"
      case "glow": return "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10"
      default: return "shadow-xl shadow-black/20"
    }
  }

  // Export Action
  const handleExport = async () => {
    const node = previewRef.current
    if (!node) return

    setIsExporting(true)
    
    // Set Target Resolution
    let targetWidth = 1920
    if (exportQuality === "2k") targetWidth = 2560
    if (exportQuality === "4k") targetWidth = 3840

    const currentWidth = node.offsetWidth
    const scaleFactor = targetWidth / currentWidth

    const options = {
      pixelRatio: scaleFactor,
      cacheBust: true,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
        width: `${node.offsetWidth}px`,
        height: `${node.offsetHeight}px`,
      },
    }

    try {
      let dataUrl = ""
      const cleanFileName = fileName.replace(/\.[^/.]+$/, "") || "code-screenshot"

      if (exportFormat === "png") {
        dataUrl = await toPng(node, options)
      } else if (exportFormat === "jpeg") {
        dataUrl = await toJpeg(node, { ...options, quality: 0.95 })
      } else if (exportFormat === "webp") {
        const canvas = await toCanvas(node, options)
        dataUrl = canvas.toDataURL("image/webp", 0.95)
      }

      const link = document.createElement("a")
      link.download = `${cleanFileName}.${exportFormat}`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Export failed:", err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      {/* Settings Panel */}
      <div className="lg:col-span-3 bg-card border rounded-xl p-5 flex flex-col gap-6 select-none h-fit">
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="font-semibold flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            Screenshot Customizer
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFormatCode}
            className="h-8 gap-1.5"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Format Code
          </Button>
        </div>

        {/* Theme and File Name */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ss-theme">Editor Syntax Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="ss-theme" className="w-full">
                <SelectValue placeholder="Select syntax theme" />
              </SelectTrigger>
              <SelectContent>
                {syntaxStyleName.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ss-filename">Window Title / File Name</Label>
            <Input
              id="ss-filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. index.js"
            />
          </div>
        </div>

        {/* Background Tab */}
        <div className="space-y-2">
          <Label>Background Type</Label>
          <Tabs
            value={bgType}
            onValueChange={(val: any) => setBgType(val)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="none">None</TabsTrigger>
              <TabsTrigger value="solid">Solid</TabsTrigger>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
            </TabsList>

            <TabsContent value="solid" className="pt-3 space-y-3">
              <div className="grid grid-cols-8 gap-2">
                {PRESET_SOLIDS.map((solid) => (
                  <button
                    key={solid.name}
                    type="button"
                    onClick={() => setSolidColor(solid.value)}
                    style={{ backgroundColor: solid.value }}
                    className={cn(
                      "h-7 w-7 rounded-md border border-input focus:outline-none transition-all",
                      solidColor === solid.value ? "ring-2 ring-primary ring-offset-2 scale-110" : "hover:scale-105"
                    )}
                    title={solid.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="custom-solid" className="text-xs text-muted-foreground whitespace-nowrap">
                  Custom Solid Color:
                </Label>
                <Input
                  type="color"
                  id="custom-solid"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  className="w-12 h-8 p-0 border rounded cursor-pointer"
                />
              </div>
            </TabsContent>

            <TabsContent value="gradient" className="pt-3 space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {PRESET_GRADIENTS.map((grad) => (
                  <button
                    key={grad.name}
                    type="button"
                    onClick={() => setGradientVal(grad.value)}
                    style={{ background: grad.value }}
                    className={cn(
                      "h-8 w-full rounded-md border border-input focus:outline-none transition-all",
                      gradientVal === grad.value ? "ring-2 ring-primary ring-offset-1 scale-105" : "hover:scale-102"
                    )}
                    title={grad.name}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setGradientVal("custom")}
                  className={cn(
                    "h-8 w-full rounded-md border border-dashed border-input focus:outline-none text-xs flex items-center justify-center font-medium transition-all bg-muted hover:bg-muted/80",
                    gradientVal === "custom" ? "ring-2 ring-primary ring-offset-1" : ""
                  )}
                >
                  Custom
                </button>
              </div>

              {gradientVal === "custom" && (
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="grad-1" className="text-xs text-muted-foreground">Color 1</Label>
                    <Input
                      type="color"
                      id="grad-1"
                      value={customGrad1}
                      onChange={(e) => setCustomGrad1(e.target.value)}
                      className="w-10 h-7 p-0 border rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="grad-2" className="text-xs text-muted-foreground">Color 2</Label>
                    <Input
                      type="color"
                      id="grad-2"
                      value={customGrad2}
                      onChange={(e) => setCustomGrad2(e.target.value)}
                      className="w-10 h-7 p-0 border rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Layout Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-mac" className="cursor-pointer">macOS Window Style</Label>
            <Switch
              id="show-mac"
              checked={showMacControls}
              onCheckedChange={setShowMacControls}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Wrapper Padding</Label>
            <div className="grid grid-cols-4 gap-2">
              {["16", "32", "48", "64"].map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={paddingSize === size ? "default" : "outline"}
                  onClick={() => setPaddingSize(size)}
                  className="h-8 text-xs"
                >
                  {size}px
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Card Border Radius</Label>
            <div className="grid grid-cols-6 gap-1">
              {["none", "sm", "md", "lg", "xl", "2xl"].map((rad) => (
                <Button
                  key={rad}
                  type="button"
                  variant={borderRadius === rad ? "default" : "outline"}
                  onClick={() => setBorderRadius(rad)}
                  className="h-8 text-xs p-0"
                >
                  {rad}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Card Shadow Intensity</Label>
            <div className="grid grid-cols-4 gap-2">
              {["none", "soft", "hard", "glow"].map((sh) => (
                <Button
                  key={sh}
                  type="button"
                  variant={shadowStyle === sh ? "default" : "outline"}
                  onClick={() => setShadowStyle(sh)}
                  className="h-8 text-xs capitalize"
                >
                  {sh}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Export Settings */}
        <div className="space-y-4 pt-2 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="export-fmt">Format</Label>
              <Select
                value={exportFormat}
                onValueChange={(val: any) => setExportFormat(val)}
              >
                <SelectTrigger id="export-fmt">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="export-ql">Resolution Quality</Label>
              <Select
                value={exportQuality}
                onValueChange={(val: any) => setExportQuality(val)}
              >
                <SelectTrigger id="export-ql">
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hd">HD (1080p)</SelectItem>
                  <SelectItem value="2k">2K (QHD)</SelectItem>
                  <SelectItem value="4k">4K (UHD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            className="w-full gap-2 mt-2"
            disabled={isExporting || !code}
            onClick={handleExport}
          >
            {isExporting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? "Exporting..." : "Download Screenshot"}
          </Button>
        </div>
      </div>

      {/* Code Editor Column */}
      <div className="lg:col-span-4 bg-card border rounded-xl p-5 flex flex-col gap-4 min-h-[500px]">
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="font-semibold flex items-center gap-2 text-primary">
            Source Code Editor
          </h3>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 border rounded-lg overflow-hidden shadow bg-slate-950 min-h-[400px]">
          <MonacoEditor
            height="100%"
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => onCodeChange(value || "")}
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>

      {/* Live Preview Area */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center border rounded-xl bg-slate-900/50 p-6 overflow-hidden min-h-[500px]">
        <div className="w-full overflow-auto flex items-center justify-center p-4">
          <div
            ref={previewRef}
            id="code-screenshot-card"
            style={getBackgroundStyle()}
            className={cn(
              "transition-all duration-300 w-full max-w-2xl flex items-center justify-center select-none",
              getPaddingClass()
            )}
          >
            <div
              className={cn(
                "bg-slate-950/95 w-full border border-slate-800/80 backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col",
                getRoundedClass(),
                getShadowClass()
              )}
            >
              {/* Card Window Title Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-900/50 bg-slate-950/80">
                <div className="flex items-center gap-1.5">
                  {showMacControls && (
                    <>
                      <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium font-sans">
                  {fileName}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                  {language}
                </span>
              </div>

              {/* Code Container */}
              <div className="p-5 font-mono text-sm leading-relaxed overflow-x-auto select-text">
                <SyntaxHighlighter
                  language={language.toLowerCase()}
                  style={themeOptionsConfig[theme]}
                  customStyle={{
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  }}
                  codeTagProps={{
                    style: {
                      background: "transparent",
                      fontFamily: "inherit",
                    },
                  }}
                >
                  {code || "// Write code to preview..."}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
