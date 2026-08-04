// components/CodeEditor.tsx
"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSearchParams } from "react-router-dom"
import CodeScreenshotGenerator from "./CodeScreenshotGenerator"

// Monaco editor must be dynamically loaded
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
})

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
]
type CodeEditorProps = {
  initialText?: string
  initialTab?: string
  setValue?: any
}

export default function CodeEditor({
  initialText = "",
  initialTab = "text",
  setValue,
}: CodeEditorProps) {
  console.log("CodeEditor props:", { setValue })
  const [searchParams, setSearchParams] = useSearchParams()
  const urlTab = searchParams.get("tab")
  const [tab, setTab] = useState(urlTab || initialTab || "text")
  const [language, setLanguage] = useState("javascript")
  const [textContent, setTextContent] = useState(initialText)
  // const [codeContent, setCodeContent] = useState("// Write your code here");
  const handleTextChange = (value: string) => {
    setTextContent(value || "")
    setValue?.("content", value || "", { shouldDirty: true })
  }
  const handleTabChange = (newTab: string) => {
    setTab(newTab)
    setValue?.("tab", newTab || "text", {
      shouldDirty: true,
      shouldTouch: true,
    })
    const newParams = new URLSearchParams(window.location.search)
    newParams.set("tab", newTab)
    setSearchParams(newParams, { replace: true })
  }

  return (
    <div className=" w-full  mx-auto space-y-4">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="screenshot">Screenshot Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Textarea
            className="h-[65vh] resize-none"
            value={textContent}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your message or notes..."
          />
        </TabsContent>

        <TabsContent value="code">
          <div className="mb-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[60vh] border rounded-xl overflow-hidden shadow">
            <MonacoEditor
              height="100%"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={textContent}
              onChange={(value) => handleTextChange(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="screenshot">
          <CodeScreenshotGenerator
            code={textContent}
            language={language}
            onCodeChange={handleTextChange}
            onLanguageChange={setLanguage}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
