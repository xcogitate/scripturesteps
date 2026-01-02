"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { SessionStore } from "@/lib/session-store"
import type { ChildProfile } from "@/lib/types"
import { useRouter } from "next/navigation"

export function ChildSwitcher() {
  const router = useRouter()
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null)

  useEffect(() => {
    loadChildren()
  }, [])

  const loadChildren = () => {
    const allChildren = SessionStore.getAllChildren()
    const current = SessionStore.getCurrentChild()
    setChildren(allChildren)
    setActiveChild(current)
  }

  const handleSwitch = (childId: string) => {
    SessionStore.switchChild(childId)
    // Reload page to update with new child's data
    window.location.reload()
  }

  if (children.length <= 1) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between bg-transparent">
          <span className="truncate">{activeChild?.name || "Select child"}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        {children.map((child) => (
          <DropdownMenuItem key={child.id} onClick={() => handleSwitch(child.id)}>
            <Check className={`mr-2 h-4 w-4 ${activeChild?.id === child.id ? "opacity-100" : "opacity-0"}`} />
            {child.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/add-child")}>
          <Plus className="mr-2 h-4 w-4" />
          Add child
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
