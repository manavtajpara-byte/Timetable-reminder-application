"use client"

import Link from "next/link"
import { AddWorkForm } from "@/components/work/AddWorkForm"
import { CalendarClock } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { useTimetableStore } from "@/stores/useTimetableStore"
import { SettingsDialog } from "@/components/settings/SettingsDialog"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const { user } = useAuthStore()
    const { fitnessProfile } = useTimetableStore()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/10">
            <div className="container flex h-14 items-center justify-between mx-auto px-4">
                <div className="flex items-center gap-2">
                    <CalendarClock className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg hidden sm:inline-block">Timetable Master</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter">Lvl {fitnessProfile.level}</span>
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer"
                                style={{ width: `${(fitnessProfile.xp % 1000) / 10}%`, backgroundSize: '200% 100%' } as any}
                            />
                        </div>
                    </div>

                    {user ? (
                        <>
                            <AddWorkForm />
                            <SettingsDialog />
                        </>
                    ) : (
                        <SettingsDialog />
                    )}
                </div>
            </div>
        </header>
    )
}
