"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, Lock, Unlock, Timer } from "lucide-react"
import { toast } from "sonner"

export function ProcrastinationBlocker() {
    const [isEnabled, setIsEnabled] = React.useState(false)
    const [timeLeft, setTimeLeft] = React.useState(25 * 60)

    React.useEffect(() => {
        let timer: NodeJS.Timeout
        if (isEnabled && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
        }
        return () => clearInterval(timer)
    }, [isEnabled, timeLeft])

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${m}:${sec.toString().padStart(2, '0')}`
    }

    const toggleBlocker = () => {
        setIsEnabled(!isEnabled)
        if (!isEnabled) {
            toast.warning("Distraction Blockade Active", {
                description: "Social media and entertainment apps are now 'self-destructing' on this device.",
                icon: <ShieldAlert className="h-5 w-5 text-red-500" />
            })
        } else {
            toast.success("Distraction Blockade Lifted", {
                icon: <ShieldCheck className="h-5 w-5 text-green-500" />
            })
        }
    }

    return (
        <Card className={`transition-all duration-500 ${isEnabled ? 'bg-red-950/20 border-red-500/30' : 'bg-black/40 border-white/10'} backdrop-blur-xl`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {isEnabled ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
                        Distraction Blockade
                    </span>
                    {isEnabled && <span className="flex items-center gap-1 text-red-500 text-[10px] animate-pulse font-mono tracking-tighter">
                        <Timer className="h-3 w-3" /> {formatTime(timeLeft)}
                    </span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-xs font-medium">Self-Destructing Distractions</p>
                        <p className="text-[10px] text-muted-foreground">Force blocks non-productive apps during work.</p>
                    </div>
                    <Button
                        size="sm"
                        variant={isEnabled ? "destructive" : "outline"}
                        className="rounded-full px-6 h-8 text-[10px] font-bold uppercase transition-all"
                        onClick={toggleBlocker}
                    >
                        {isEnabled ? "Disarm" : "Activate"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
