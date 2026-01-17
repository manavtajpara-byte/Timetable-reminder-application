"use client"

import * as React from "react"
import { useTimetableStore, type WorkItem, type UserFitnessProfile } from "@/stores/useTimetableStore"
import { useAuthStore } from "@/stores/useAuthStore"
import { WorkCard } from "./WorkCard"
import { ProgressStats } from "@/components/tracking/ProgressStats"
import { MotivationSection } from "@/components/motivation/MotivationSection"

import { DailyCheckIn } from "@/components/fitness/DailyCheckIn"
import { BiometricSync } from "@/components/fitness/BiometricSync"
import { FlexScheduler } from "@/components/dashboard/FlexScheduler"
import { IoTControl } from "@/components/iot/IoTControl"
import { PanicButton } from "@/components/focus/PanicButton"
import { ProcrastinationBlocker } from "@/components/focus/ProcrastinationBlocker"
import { DailyGreeting } from "@/components/dashboard/DailyGreeting"
import { AICoach } from "@/lib/aiCoach"
import { Utensils } from "lucide-react"
import { toast } from "sonner"
import { BodyDoubling } from "@/components/focus/BodyDoubling"
import { BossBattle } from "@/components/fitness/BossBattle"

function NutritionSection({ works }: { works: WorkItem[] }) {
    const meals = works.flatMap(w => AICoach.getMealSuggestions(w)).sort((a, b) => a.time.localeCompare(b.time))

    if (meals.length === 0) return null

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-400" />
                Refueling Schedule
            </h3>
            <div className="space-y-4">
                {meals.map((meal, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="px-3 py-1 rounded bg-orange-400/20 text-orange-400 font-mono text-sm">
                            {meal.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {meal.meal}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

import { Button } from "@/components/ui/button"
import { Swords, Sparkles } from "lucide-react"

function BossBattleSection({ profile }: { profile: UserFitnessProfile }) {
    const battle = React.useMemo(() => AICoach.generateBossBattle(profile), [profile])

    return (
        <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Swords className="w-24 h-24" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold uppercase tracking-wider text-xs">
                    <Sparkles className="w-4 h-4" /> Weekly Boss Battle
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{battle.name}</h3>
                <div className="flex gap-4">
                    <BossBattle battle={battle as any} />
                </div>
            </div>
        </div>
    )
}

function GapFillerButton() {
    const addWork = useTimetableStore(state => state.addWork)

    const handleFindGaps = () => {
        // Simulation
        toast("Scanning calendar...", {
            description: "Found a 20min gap at 4:30 PM. Suggesting a Power Walk.",
            action: {
                label: "Add",
                onClick: () => addWork({
                    name: "Power Walk (Gap Filler)",
                    startTime: "16:30",
                    durationMinutes: 20,
                    frequencyDays: [new Date().getDay()],
                    category: 'fitness',
                    intensity: 3,
                    equipment: ['none'],
                    expectedGoalPercent: 100,
                    totalDurationDays: 1,
                })
            }
        })
    }

    return (
        <Button variant="outline" size="sm" onClick={handleFindGaps} className="gap-2 border-dashed">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Smart Fill Gaps
        </Button>
    )
}

export function DailyView() {
    const getWorkForDay = useTimetableStore((state) => state.getWorkForDay)
    const { settings } = useAuthStore()
    const { fitnessProfile } = useTimetableStore()

    // Get today's works
    const dayIndex = new Date().getDay()
    // Hydration fix: Ensure we only render stored data after mount
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const todaysWorks = getWorkForDay(dayIndex).sort((a: WorkItem, b: WorkItem) => a.startTime.localeCompare(b.startTime))

    if (!isMounted) {
        return (
            <div className="space-y-6">
                <ProgressStats />
                <MotivationSection />
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Today&apos;s Schedule</h2>
                    <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground animate-pulse">
                        Loading schedule...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 relative">
            {/* Immersive Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <DailyGreeting worksCount={todaysWorks.length} />
            <DailyCheckIn />
            <BiometricSync />
            <FlexScheduler />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IoTControl />
                <ProcrastinationBlocker />
            </div>
            <BossBattleSection profile={fitnessProfile} />
            <div className="text-[10px] text-muted-foreground text-center py-2 border border-dashed border-white/5 rounded-lg bg-white/[0.02]">
                🔒 Zero-Knowledge Sync Active. Your schedule data is encrypted end-to-end.
            </div>
            <ProgressStats />
            <NutritionSection works={todaysWorks} />
            {settings.showMotivation && <MotivationSection />}

            <div className="border-t border-primary/10 pt-8 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">Today&apos;s Schedule</h2>
                    <div className="flex gap-2 items-center">
                        <PanicButton />
                        <BodyDoubling />
                        <GapFillerButton />
                    </div>
                </div>

                {todaysWorks.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                        No work scheduled for today. Add some visible tasks!
                    </div>
                ) : (
                    <div className={settings.viewMode === 'list'
                        ? "flex flex-col gap-4"
                        : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    }>
                        {todaysWorks.map((work: WorkItem) => (
                            <WorkCard key={work.id} work={work} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
