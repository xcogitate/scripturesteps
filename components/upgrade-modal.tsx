"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type UpgradeModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  ctaLabel?: string
  onUpgrade: () => void
}

export function UpgradeModal({
  open,
  onOpenChange,
  title = "Unlock Starter",
  description = "Upgrade to Starter to access this feature.",
  ctaLabel = "Upgrade to Starter",
  onUpgrade,
}: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button onClick={onUpgrade}>{ctaLabel}</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
