"use client"

import * as React from "react"
import { useTimetableStore } from "@/stores/useTimetableStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ghost, Plus, Rocket, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function FlexScheduler() {
    const { getParkingLot, backcastDeadline, removeWork, addWork } = useTimetableStore()
    const parkingLot = getParkingLot()

    const [backcastName, setBackcastName] = React.useState("")
    const [backcastDate, setBackcastDate] = React.useState("")
    const [parkingName, setParkingName] = React.useState("")

    const handleBackcast = () => {
        if (!backcastName || !backcastDate) return
        backcastDeadline(backcastName, backcastDate, 2)
        toast.success("Deadline Back-casted!", {
            description: `Generated a study plan leading up to ${backcastDate}.`
        })
        setBackcastName("")
        setBackcastDate("")
    }

    const addToParkingLot = () => {
        if (!parkingName) return
        addWork({
            name: parkingName,
            category: 'work',
            intensity: 1,
            equipment: ['none'],
            startTime: "00:00",
            durationMinutes: 30,
            frequencyDays: [],
            totalDurationDays: 1,
            expectedGoalPercent: 100,
            isParkingLot: true
        })
        setParkingName("")
        toast.info("Task added to Parking Lot")
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* The Parking Lot */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Ghost className="h-4 w-4 text-primary" />
                        The Parking Lot
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a 'someday' task..."
                            value={parkingName}
                            onChange={(e) => setParkingName(e.target.value)}
                            className="bg-white/5 border-white/10"
                        />
                        <Button size="sm" onClick={addToParkingLot}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                        {parkingLot.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic text-center py-4">
                                No tasks in the lot.
                            </p>
                        ) : (
                            parkingLot.map(work => (
                                <div key={work.id} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 group">
                                    <span className="text-xs">{work.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                        onClick={() => removeWork(work.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Deadline Back-casting */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl border-dashed">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-secondary" />
                        Deadline Back-casting
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Goal / Exam Name</Label>
                        <Input
                            value={backcastName}
                            onChange={(e) => setBackcastName(e.target.value)}
                            placeholder="e.g. Finals Week"
                            className="bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Deadline Date</Label>
                        <Input
                            type="date"
                            value={backcastDate}
                            onChange={(e) => setBackcastDate(e.target.value)}
                            className="bg-white/5 border-white/10 text-white scheme-dark"
                        />
                    </div>
                    <Button
                        className="w-full bg-gradient-to-r from-primary to-secondary"
                        onClick={handleBackcast}
                    >
                        Generate Study Plan
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
