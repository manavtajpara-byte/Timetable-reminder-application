"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Swords, Zap, Timer, CheckCircle, Flame, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { useTimetableStore } from "@/stores/useTimetableStore"

interface Round {
    name: string
    duration: number
    damage: number
    description: string
}

interface BattleData {
    name: string
    totalHp: number
    xpReward: number
    type: string
    rounds: Round[]
}

export function BossBattle({ battle }: { battle: BattleData }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [currentRoundIndex, setCurrentRoundIndex] = React.useState(0)
    const [timeLeft, setTimeLeft] = React.useState(0)
    const [bossHp, setBossHp] = React.useState(battle.totalHp)
    const [isBattleActive, setIsBattleActive] = React.useState(false)
    const [isVictory, setIsVictory] = React.useState(false)

    const addXp = useTimetableStore(state => state.addXp)
    const currentRound = battle.rounds[currentRoundIndex]

    // Timer logic
    React.useEffect(() => {
        let timer: NodeJS.Timeout
        if (isBattleActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (isBattleActive && timeLeft === 0) {
            // Round complete
            handleRoundComplete()
        }
        return () => clearInterval(timer)
    }, [isBattleActive, timeLeft])

    const startBattle = () => {
        setIsBattleActive(true)
        setTimeLeft(battle.rounds[0].duration)
        setCurrentRoundIndex(0)
        setBossHp(battle.totalHp)
        setIsVictory(false)
    }

    const handleRoundComplete = () => {
        const damage = currentRound.damage
        setBossHp(prev => Math.max(0, prev - damage))

        toast(`Round Complete!`, {
            description: `Dealt ${damage} damage to the Boss!`,
            icon: <Zap className="w-4 h-4 text-yellow-500" />
        })

        if (currentRoundIndex < battle.rounds.length - 1) {
            setCurrentRoundIndex(prev => prev + 1)
            setTimeLeft(battle.rounds[currentRoundIndex + 1].duration)
        } else {
            setIsBattleActive(false)
            setIsVictory(true)
            addXp(battle.xpReward)
            toast.success("Boss Defeated!", {
                description: `You earned ${battle.xpReward} XP!`
            })
        }
    }

    const hpPercent = (bossHp / battle.totalHp) * 100

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white border-none shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                    Accept Challenge (+500 XP)
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-950 border-purple-500/30 text-white overflow-hidden p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>{battle.name}</DialogTitle>
                    <DialogDescription>Weekly Boss Battle interactive session.</DialogDescription>
                </DialogHeader>

                <div className="relative p-6 space-y-8">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 blur-[100px] -z-10 pointer-events-none" />

                    {!isBattleActive && !isVictory ? (
                        <div className="text-center py-12 space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/20 border border-purple-500/50 animate-pulse">
                                <Swords className="w-10 h-10 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">{battle.name}</h2>
                                <p className="text-muted-foreground text-sm px-8">Prepare for 4 rounds of intense HIIT. Defeat the boss by completing all exercises for full XP.</p>
                            </div>
                            <Button onClick={startBattle} size="lg" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none font-bold">
                                START BATTLE
                            </Button>
                        </div>
                    ) : isVictory ? (
                        <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-400/20 border border-yellow-400/50">
                                <CheckCircle className="w-10 h-10 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">VICTORY</h2>
                                <p className="text-muted-foreground text-sm">You survived the {battle.name}!</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                                <span className="text-sm font-medium">REWARD</span>
                                <span className="text-xl font-black text-yellow-400">+{battle.xpReward} XP</span>
                            </div>
                            <Button onClick={() => setIsOpen(false)} variant="outline" className="w-full border-white/20 hover:bg-white/5">
                                GLORY AWAITS
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8 py-4">
                            {/* Boss Header */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/50">
                                            <ShieldAlert className="w-5 h-5 text-red-500" />
                                        </div>
                                        <span className="font-bold tracking-tight text-red-500 uppercase">{battle.name}</span>
                                    </div>
                                    <span className="text-xs font-mono text-muted-foreground">{bossHp} / {battle.totalHp} HP</span>
                                </div>
                                <Progress value={hpPercent} className="h-3 bg-red-950 border border-red-500/20 rounded-full overflow-hidden"
                                    style={{ "--progress-background": "linear-gradient(to right, #ef4444, #991b1b)" } as any} />
                            </div>

                            {/* Active Exercise */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Flame className="w-16 h-16" />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-black tracking-tight">{currentRound.name}</h3>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-400">
                                            <Timer className="w-4 h-4" />
                                            <span className="font-mono font-bold">{timeLeft}s</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{currentRound.description}</p>

                                    <div className="pt-4 flex items-center gap-4">
                                        <Progress value={(timeLeft / currentRound.duration) * 100} className="h-1 flex-1 bg-white/5" />
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">ROUND {currentRoundIndex + 1}/{battle.rounds.length}</span>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleRoundComplete} variant="ghost" className="w-full text-xs text-muted-foreground hover:text-white hover:bg-white/5 uppercase tracking-widest h-8">
                                Dev Skip Round (Simulate Effort)
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
