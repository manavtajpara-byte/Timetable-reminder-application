"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Moon, BrainCircuit, type LucideIcon } from "lucide-react"

// Simple custom slider since we might not have it installed
function RangeSlider({ value, onChange, max = 10, icon: Icon }: { value: number, onChange: (v: number) => void, max?: number, icon: LucideIcon }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4" /> Low</div>
                <span className="font-bold text-primary text-lg">{value}</span>
                <div className="text-muted-foreground">High</div>
            </div>
            <input
                type="range"
                min="1"
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
    )
}

export function DailyCheckIn() {
    const [open, setOpen] = React.useState(false)
    const [sleep, setSleep] = React.useState(5)
    const [stress, setStress] = React.useState(5)

    // In a real app, we'd check if we already did this today
    // For demo, we trigger on mount once per session or manually

    React.useEffect(() => {
        const lastCheckIn = localStorage.getItem('last-check-in')
        const today = new Date().toISOString().split('T')[0]

        if (lastCheckIn !== today) {
            const timer = setTimeout(() => setOpen(true), 2000) // Delay popup slightly
            return () => clearTimeout(timer)
        }
    }, [])

    const handleSubmit = () => {
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem('last-check-in', today)

        // AI Logic would go here
        // For now, simpler heuristic
        let message = "Schedule updated!"
        let desc = "Your plan looks good."

        if (sleep < 5 || stress > 7) {
            message = "Take it easy today."
            desc = "We've adjusted your intensity down to prevent burnout."
            // In a real implementation: call a re-calibrate function in store
        } else if (sleep > 7 && stress < 5) {
            message = "You're primed to crush it!"
            desc = "Consider increasing intensity today."
        }

        toast(message, { description: desc })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[400px] bg-black/80 backdrop-blur-xl border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Daily Check-in</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Help your AI Coach optimize your schedule.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-8">
                    <div className="space-y-2">
                        <Label className="text-base">How did you sleep?</Label>
                        <RangeSlider value={sleep} onChange={setSleep} icon={Moon} />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base">Stress Level?</Label>
                        <RangeSlider value={stress} onChange={setStress} icon={BrainCircuit} />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-primary to-secondary">
                        Generate Daily Plan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
