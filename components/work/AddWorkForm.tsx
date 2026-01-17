"use client"

import * as React from "react"
import { useTimetableStore, type Category, type Equipment } from "@/stores/useTimetableStore"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react" // Ensure lucide-react is installed, yes it is.
import { toast } from "sonner"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const frequencyAll = [0, 1, 2, 3, 4, 5, 6]

export function AddWorkForm() {
    const [open, setOpen] = React.useState(false)
    const addWork = useTimetableStore((state) => state.addWork)

    const [name, setName] = React.useState("")
    const [startTime, setStartTime] = React.useState("")
    const [duration, setDuration] = React.useState("")
    const [goal, setGoal] = React.useState("100")
    const [totalDays, setTotalDays] = React.useState("7")
    const [weight, setWeight] = React.useState("2")
    const [frequency, setFrequency] = React.useState<number[]>(frequencyAll)

    // New Fields
    const [category, setCategory] = React.useState<string>("work")
    const [intensity, setIntensity] = React.useState("5")
    const [equipment, setEquipment] = React.useState<string[]>([])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !startTime || !duration) {
            toast.error("Please fill in all required fields")
            return
        }

        addWork({
            name,
            startTime,
            durationMinutes: parseInt(duration),
            expectedGoalPercent: parseInt(goal),
            totalDurationDays: parseInt(totalDays),
            frequencyDays: frequency,
            category: category as Category,
            intensity: parseInt(intensity),
            equipment: equipment as Equipment[],
            weight: parseInt(weight)
        })

        toast.success("Work added successfully")
        setOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setName("")
        setStartTime("")
        setDuration("")
        setGoal("100")
        setTotalDays("7")
        setFrequency(frequencyAll)
        setCategory("work")
        setIntensity("5")
        setWeight("2")
        setEquipment([])
    }

    const toggleDay = (dayIndex: number) => {
        setFrequency(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex].sort()
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="premium" className="gap-2">
                    <Plus className="h-4 w-4" /> Add Activity
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Activity</DialogTitle>
                    <DialogDescription>
                        Schedule a new task or workout.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="work">Work / Study</option>
                            <option value="fitness">Fitness</option>
                            <option value="learning">Learning</option>
                            <option value="health">Health</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. HIIT Workout"
                            required
                        />
                    </div>

                    {category === 'fitness' && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="intensity" className="text-right">Intensity (1-10)</Label>
                                <Input
                                    id="intensity"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={intensity}
                                    onChange={(e) => setIntensity(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Equipment</Label>
                                <div className="col-span-3 flex flex-wrap gap-2">
                                    {['gym', 'dumbbells', 'yoga-mat'].map((eq) => (
                                        <button
                                            key={eq}
                                            type="button"
                                            onClick={() => setEquipment(prev => prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq])}
                                            className={`px-2 py-1 text-xs rounded-full border ${equipment.includes(eq) ? 'bg-primary text-white' : 'bg-secondary/20'}`}
                                        >
                                            {eq}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">Start Time</Label>
                        <Input
                            id="time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="weight" className="text-right text-xs">Priority Weight</Label>
                        <select
                            id="weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="col-span-3 flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="1">1 - Low (Admin/Email)</option>
                            <option value="2">2 - Normal (Routine)</option>
                            <option value="3">3 - Important (Core Work)</option>
                            <option value="4">4 - High (Deadlines)</option>
                            <option value="5">5 - Critical (Deep Work)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">Duration (m)</Label>
                        <Input
                            id="duration"
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Frequency</Label>
                        <div className="col-span-3 flex flex-wrap gap-1">
                            {DAYS.map((day, index) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(index)}
                                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${frequency.includes(index)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-muted-foreground border-input hover:bg-accent"
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit" className="w-full">Save Schedule</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
