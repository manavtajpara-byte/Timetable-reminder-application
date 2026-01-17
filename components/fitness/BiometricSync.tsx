"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Zap, Moon } from "lucide-react"
import { AICoach } from "@/lib/aiCoach"

export function BiometricSync() {
    const [stats, setStats] = React.useState({
        heartRate: 72,
        stress: 42,
        sleepDebt: 1.5,
        readiness: 85
    })

    // Simulate live data updates
    React.useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                heartRate: prev.heartRate + (Math.random() > 0.5 ? 1 : -1),
                stress: Math.max(10, Math.min(100, prev.stress + (Math.random() > 0.5 ? 2 : -2)))
            }))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const now = new Date()
    const currentAdvice = AICoach.getCircadianAdvice(now.getHours())

    return (
        <Card className="glass border-primary/10 overflow-hidden relative transition-all hover:border-primary/30">
            <div className={`absolute top-0 right-0 p-8 opacity-10 blur-2xl transition-all duration-1000 ${now.getHours() >= 17 || now.getHours() < 5 ? 'bg-indigo-500' : 'bg-amber-500'
                }`}>
                <Activity className="w-32 h-32" />
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    Live Biometric Sync
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2 p-3 rounded-2xl bg-red-500/5 border border-red-500/10 transition-transform hover:scale-105">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-red-400">
                            <Heart className="h-4 w-4 animate-pulse" /> Heart Rate
                        </div>
                        <div className="text-3xl font-black font-mono tracking-tighter">{stats.heartRate}<span className="text-xs ml-1 text-muted-foreground font-sans">BPM</span></div>
                    </div>

                    <div className="space-y-2 p-3 rounded-2xl bg-orange-500/5 border border-orange-500/10 transition-transform hover:scale-105">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-orange-400">
                            <Activity className="h-4 w-4" /> Stress
                        </div>
                        <div className="text-3xl font-black font-mono tracking-tighter">{stats.stress}<span className="text-xs ml-1 text-muted-foreground font-sans">%</span></div>
                    </div>

                    <div className="space-y-2 p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10 transition-transform hover:scale-105">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-blue-400">
                            <Moon className="h-4 w-4" /> Sleep
                        </div>
                        <div className="text-3xl font-black font-mono tracking-tighter">+{stats.sleepDebt}<span className="text-xs ml-1 text-muted-foreground font-sans">h</span></div>
                    </div>

                    <div className="space-y-2 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 transition-transform hover:scale-105">
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                            <Zap className="h-4 w-4" /> Ready
                        </div>
                        <div className="text-3xl font-black font-mono tracking-tighter text-emerald-400">{stats.readiness}<span className="text-xs ml-1 text-muted-foreground font-sans">%</span></div>
                    </div>
                </div>

                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="flex items-center gap-3 text-xs uppercase font-black text-primary mb-2 tracking-[0.2em]">
                        <Zap className="h-4 w-4 animate-bounce" /> Circadian Insight
                    </div>
                    <p className="text-lg font-bold text-white leading-tight">
                        &quot;{currentAdvice}&quot;
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
