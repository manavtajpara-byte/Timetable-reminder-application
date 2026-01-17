"use client"

import * as React from "react"
import { useTimetableStore, type WorkItem } from "@/stores/useTimetableStore"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { WorkoutCamera } from "@/components/fitness/WorkoutCamera"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, CheckCircle2, ChevronRight } from "lucide-react"
import { TaskBreakdown } from "@/lib/taskBreakdown"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter as DialogFooterContent
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function WorkCard({ work }: { work: WorkItem }) {
    const logProgress = useTimetableStore((state) => state.logProgress)
    const progressLogs = useTimetableStore((state) => state.progressLogs)

    // Hydration fix: Only render date-dependent data after mount or use robust checking
    // Using today's date is usually safe for SSR vs Client if timezone matches, but
    // to be safe we can suppress hydration warning on specific elements or allow re-render.
    // Ideally, use a client-side only wrapper, OR ensure the server renders safe default.

    const [isMounted, setIsMounted] = React.useState(false)
    const [progressInput, setProgressInput] = React.useState("")
    const [focusInput, setFocusInput] = React.useState("8")
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [breakdown, setBreakdown] = React.useState<string[]>([])
    const [isBreakingDown, setIsBreakingDown] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const todayStr = new Date().toISOString().split('T')[0]

    // Safe access to store data
    const todayLog = isMounted ? progressLogs.find(l => l.workId === work.id && l.date === todayStr) : null
    const completed = todayLog?.completedPercent || 0

    const isDone = completed >= work.expectedGoalPercent

    const handleBreakdown = async () => {
        setIsBreakingDown(true)
        const steps = await TaskBreakdown.breakdown(work.name)
        setBreakdown(steps)
        setIsBreakingDown(false)
    }

    const handleSubmitProgress = (e: React.FormEvent) => {
        e.preventDefault()
        const val = parseInt(progressInput)
        const focusVal = parseInt(focusInput)
        if (!isNaN(val)) {
            logProgress(work.id, todayStr, val, isNaN(focusVal) ? 8 : focusVal)
            if (val >= work.expectedGoalPercent) {
                toast.success("Dopamine Hit! 🎯", {
                    description: `You've crushed "${work.name}"! +${50 + (focusVal * 5)} Focus points earned.`,
                    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
                })
            }
            setDialogOpen(false)
            setProgressInput("")
        }
    }

    const getCategoryStyles = (cat: string) => {
        switch (cat) {
            case 'work': return 'border-l-[#06b6d4] shadow-[#06b6d4]/5 bg-gradient-to-br from-[#06b6d4]/5 to-transparent'
            case 'fitness': return 'border-l-[#10b981] shadow-[#10b981]/5 bg-gradient-to-br from-[#10b981]/5 to-transparent'
            case 'learning': return 'border-l-[#f59e0b] shadow-[#f59e0b]/5 bg-gradient-to-br from-[#f59e0b]/5 to-transparent'
            case 'health': return 'border-l-[#f43f5e] shadow-[#f43f5e]/5 bg-gradient-to-br from-[#f43f5e]/5 to-transparent'
            default: return 'border-l-primary shadow-primary/5'
        }
    }

    const getProgColor = (cat: string) => {
        switch (cat) {
            case 'work': return 'bg-[#06b6d4]'
            case 'fitness': return 'bg-[#10b981]'
            case 'learning': return 'bg-[#f59e0b]'
            case 'health': return 'bg-[#f43f5e]'
            default: return 'bg-primary'
        }
    }

    if (!isMounted) {
        return (
            <Card className="opacity-50 animate-pulse bg-white/5 border-white/10">
                <CardHeader><CardTitle>{work.name}</CardTitle></CardHeader>
                <CardContent>Loading...</CardContent>
            </Card>
        )
    }

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border-l-4 group glass",
            isDone ? "border-l-green-500 shadow-green-500/20" : getCategoryStyles(work.category || 'work')
        )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-black tracking-tight truncate pr-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    {work.name}
                </CardTitle>
                <div className={cn(
                    "flex items-center text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap border backdrop-blur-md",
                    work.category === 'fitness' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" :
                        work.category === 'learning' ? "text-amber-400 border-amber-400/20 bg-amber-400/10" :
                            work.category === 'health' ? "text-rose-400 border-rose-400/20 bg-rose-400/10" :
                                "text-cyan-400 border-cyan-400/20 bg-cyan-400/10"
                )}>
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {work.startTime}
                </div>
            </CardHeader>

            <CardContent className="pb-2">
                {/* Real-time Session Progress (ADHD-Friendly "Time Blindness" Mode) */}
                {isMounted && ((() => {
                    const now = new Date();
                    const [startH, startM] = work.startTime.split(':').map(Number);
                    const startDate = new Date();
                    startDate.setHours(startH, startM, 0, 0);
                    const endDate = new Date(startDate.getTime() + work.durationMinutes * 60000);

                    const isActive = now >= startDate && now <= endDate;
                    if (!isActive) return null;

                    const elapsed = (now.getTime() - startDate.getTime()) / (work.durationMinutes * 60000);
                    const percent = Math.min(100, Math.max(0, elapsed * 100));

                    return (
                        <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-top-1">
                            <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-primary mb-1">
                                <span>Current Session</span>
                                <span>{Math.round(percent)}% Elapsed</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]", getProgColor(work.category || 'work'))}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <p className="text-[9px] text-muted-foreground mt-1 italic">
                                Time blindness mode active: Stay focused!
                            </p>
                        </div>
                    );
                })())}

                <div className="mt-4 space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-primary h-auto p-0 hover:bg-transparent"
                        onClick={handleBreakdown}
                        disabled={isBreakingDown}
                    >
                        {isBreakingDown ? "Analyzing..." : "AI Breakdown: Split into small steps"}
                        <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>

                    {breakdown.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 animate-in slide-in-from-left-2">
                            {breakdown.map((step, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground group">
                                    <div className="mt-1 w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary" />
                                    {step}
                                </div>
                            ))}
                            <Button
                                variant="link"
                                className="h-auto p-0 text-[10px] text-muted-foreground hover:text-white"
                                onClick={() => setBreakdown([])}
                            >
                                Clear Breakdown
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex justify-between text-sm mb-2 font-medium mt-4">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={isDone ? "text-green-600" : "text-primary"}>{completed}% / {work.expectedGoalPercent}%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                        className={cn("h-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative", isDone ? "bg-green-500 shadow-[0_0_15px_#22c55e]" : getProgColor(work.category || 'work'))}
                        style={{ width: `${Math.min(100, (completed / work.expectedGoalPercent) * 100)}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 gap-2">
                {work.category === 'fitness' && (
                    <WorkoutCamera workName={work.name} />
                )}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant={isDone ? "outline" : "default"}
                            size="sm"
                            className={cn("w-full transition-all", isDone ? "border-green-500 text-green-600 hover:bg-green-50" : "bg-primary text-white hover:bg-blue-700")}
                        >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            {isDone ? "Update Progress" : "Log Progress"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Log Progress for {work.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmitProgress} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Percentage Completed Today</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="e.g. 50"
                                    value={progressInput}
                                    onChange={(e) => setProgressInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Focus Quality (1-10)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={focusInput}
                                    onChange={(e) => setFocusInput(e.target.value)}
                                    className="h-8 text-xs"
                                />
                                <p className="text-[9px] text-muted-foreground italic">How deep was your flow state?</p>
                            </div>
                            <DialogFooterContent className="pt-2">
                                <Button type="submit" size="sm" className="w-full">Save Progress & Earn XP</Button>
                            </DialogFooterContent>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card >
    )
}
