"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users, Play, Pause } from "lucide-react"

export function BodyDoubling() {
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [timer, setTimer] = React.useState(0)

    React.useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying) {
            interval = setInterval(() => setTimer(t => t + 1), 1000)
        }
        return () => clearInterval(interval)
    }, [isPlaying])

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60)
        const secs = s % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary">
                    <Users className="h-4 w-4" /> Start Body Doubling
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] bg-black/90 backdrop-blur-3xl border-white/10 text-white overflow-hidden p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Virtual Body Double</DialogTitle>
                    <DialogDescription>Focus with an AI partner to stay productive.</DialogDescription>
                </DialogHeader>
                <div className="relative aspect-video bg-black flex items-center justify-center">
                    {/* Simulated Virtual Buddy Video Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-black overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent animate-pulse" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 animate-pulse">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <Users className="w-10 h-10 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold">Virtual Body Double</h3>
                            <p className="text-xs text-muted-foreground">Level 4 Buddy is focused with you</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-md">
                            <span className="text-4xl font-mono font-black text-primary">{formatTime(timer)}</span>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                variant={isPlaying ? "outline" : "default"}
                                className="rounded-full w-14 h-14 p-0"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                            </Button>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Live Sync Active
                        </div>
                        <div>Study Session #241</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
