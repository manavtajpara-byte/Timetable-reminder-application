"use client"

import * as React from "react"
import { useTimetableStore } from "@/stores/useTimetableStore"
import { Clock, Activity, Zap, Users } from "lucide-react"

export default function AmbientMode() {
    const { getWorkForDay } = useTimetableStore()
    const [time, setTime] = React.useState(new Date())

    React.useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    const dayIndex = new Date().getDay()
    const works = getWorkForDay(dayIndex)
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

    return (
        <div className="min-h-screen bg-black text-white p-12 flex flex-col items-center justify-center font-sans tracking-tight">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl space-y-24">
                {/* Massive Clock */}
                <div className="text-center space-y-4">
                    <h1 className="text-[16vw] font-black leading-none tracking-tighter tabular-nums drop-shadow-2xl">
                        {timeStr}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-2xl font-medium text-muted-foreground uppercase tracking-[0.5em]">
                        <Clock className="w-8 h-8" />
                        Focus Mode Active
                    </div>
                </div>

                {/* Sub-panels */}
                <div className="grid grid-cols-3 gap-12">
                    <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl transition-transform hover:scale-105">
                        <div className="flex items-center gap-3 text-primary uppercase font-bold tracking-widest text-xs">
                            <Activity className="w-5 h-5" /> Current Intensity
                        </div>
                        <div className="text-6xl font-black">Level 7</div>
                        <p className="text-muted-foreground text-sm uppercase font-bold">Dopamine Baseline</p>
                    </div>

                    <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl transition-transform hover:scale-105">
                        <div className="flex items-center gap-3 text-secondary uppercase font-bold tracking-widest text-xs">
                            <Zap className="w-5 h-5" /> Energy Readiness
                        </div>
                        <div className="text-6xl font-black">92%</div>
                        <p className="text-muted-foreground text-sm uppercase font-bold">Peak Alertness</p>
                    </div>

                    <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl transition-transform hover:scale-105">
                        <div className="flex items-center gap-3 text-green-400 uppercase font-bold tracking-widest text-xs">
                            <Users className="w-5 h-5" /> Body Doubling
                        </div>
                        <div className="text-6xl font-black">ON</div>
                        <p className="text-muted-foreground text-sm uppercase font-bold">Sync Active</p>
                    </div>
                </div>

                {/* Next Task Banner */}
                <div className="p-12 rounded-[3rem] bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 backdrop-blur-3xl text-center">
                    <p className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Coming up Next</p>
                    <h2 className="text-5xl font-black">
                        {works[0]?.name || "Daylight Buffer Session"}
                    </h2>
                    <p className="text-xl text-muted-foreground mt-4">Starting in 14 minutes</p>
                </div>
            </div>
        </div>
    )
}
