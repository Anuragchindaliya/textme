import { Copy, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CopyButton } from "./CopyButton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { useState } from "react"

export function PresetShare() {
  const [isVisible, setVisible] = useState(false)
  return (
    <Popover
      onOpenChange={(state) => {
        setVisible(state)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="p-0 w-10"
          onClick={() => setVisible((b) => !b)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Share2
                // className="block lg:hidden"
                className="w-full h-full p-2"
              />
              {/* <span className="hidden lg:block">Share</span> */}
            </TooltipTrigger>
            {!isVisible && (
              <TooltipContent>
                <p>Add to library</p>
              </TooltipContent>
            )}
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          // event.target.focus()
        }}
        align="end"
        className="w-[520px]"
      >
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share preset</h3>

          <p className="text-sm text-muted-foreground">
            Anyone who has this link and an OpenAI account will be able to view
            this.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              // defaultValue="https://platform.openai.com/playground/p/7bbKYQvsVkNmVb8NGcdUOLae?model=text-davinci-003"
              defaultValue={window.location.href}
              readOnly
              className="h-9"
            />
          </div>
          {/* <Tooltip>
            <TooltipTrigger asChild> */}
          <CopyButton
            value={window.location.href}
            className="px-1"
            title="Copy"
          />
          {/* </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip> */}
          {/* <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button> */}
        </div>
      </PopoverContent>
    </Popover>
  )
}
