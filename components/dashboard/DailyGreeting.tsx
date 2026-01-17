"use client"

import * as React from "react"
import { Sparkles, Sun, Moon, Coffee } from "lucide-react"

export function DailyGreeting({ worksCount }: { worksCount: number }) {
    const [time, setTime] = React.useState(new Date())

    React.useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    const hours = time.getHours()
    let greeting = "Good Morning"
    let Icon = Sun
    let colorClass = "from-amber-400 to-orange-500"

    if (hours >= 12 && hours < 17) {
        greeting = "Good Afternoon"
        Icon = Coffee
        colorClass = "from-orange-400 to-rose-500"
    } else if (hours >= 17 || hours < 5) {
        greeting = "Good Evening"
        Icon = Moon
        colorClass = "from-indigo-400 to-purple-600"
    }

    return (
        <div className="relative p-8 rounded-[2.5rem] overflow-hidden glass border-primary/10 transition-all hover:scale-[1.01] duration-500">
            {/* Inner Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-20 blur-3xl -z-10`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClass} shadow-lg shadow-orange-500/20`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white">
                            {greeting}, Hero.
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        You have <span className="text-white font-bold">{worksCount} sessions</span> mapped out for today.
                    </p>
                </div>

                <div className="hidden lg:block text-right">
                    <div className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Current Focus Window</div>
                    <div className="text-2xl font-black text-white px-6 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </div>
    )
}
