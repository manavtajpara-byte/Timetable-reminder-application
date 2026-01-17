"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"

export function PanicButton() {
    const [isPanicMode, setIsPanicMode] = React.useState(false)

    if (isPanicMode) {
        return (
            <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                        <div className="relative flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full border border-primary/20">
                            <AlertCircle className="w-12 h-12 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-white">Breathe.</h2>
                        <p className="text-muted-foreground">Everything else is hidden. Focus only on this.</p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-2">Current Critical Task</p>
                        <h3 className="text-2xl font-bold text-white">Complete the immediate next 15 minutes of work.</h3>
                    </div>

                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-white"
                        onClick={() => setIsPanicMode(false)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> I feel better now (Exit Mode)
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            className="rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20"
            onClick={() => setIsPanicMode(true)}
        >
            <AlertCircle className="h-4 w-4" /> I&apos;m Overwhelmed
        </Button>
    )
}
