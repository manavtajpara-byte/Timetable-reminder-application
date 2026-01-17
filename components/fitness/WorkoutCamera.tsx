"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, ScanFace } from "lucide-react"

export function WorkoutCamera({ workName }: { workName: string }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [feedback, setFeedback] = React.useState("Aligning body...")
    const videoRef = React.useRef<HTMLVideoElement>(null)

    React.useEffect(() => {
        let stream: MediaStream | null = null;

        if (isOpen) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(s => {
                    stream = s
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream
                    }
                })
                .catch(err => console.error("Camera error:", err)) // Handle permission denial gracefully

            // Simulate AI Feedback loop
            const messages = [
                "Keep your back straight",
                "Good depth!",
                "Control the eccentric",
                "Breathe out on exertion",
                "Perfect form, hold it!",
                "Scanning reps: 1...",
                "Scanning reps: 2...",
            ]

            const interval = setInterval(() => {
                setFeedback(messages[Math.floor(Math.random() * messages.length)])
            }, 3000)

            return () => {
                clearInterval(interval)
                if (stream) stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary">
                    <Camera className="h-4 w-4" /> AI Coach
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[80vh] p-0 overflow-hidden bg-black border-white/10 flex flex-col">
                <DialogHeader className="sr-only">
                    <DialogTitle>AI Workout Coach</DialogTitle>
                    <DialogDescription>AI Vision analysis for real-time form coaching.</DialogDescription>
                </DialogHeader>
                <div className="relative flex-1 bg-black w-full h-full flex items-center justify-center">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        style={{ transform: 'scaleX(-1)' }} // Mirror effect
                    />

                    {/* UI Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Scanning Grid */}
                        <div className="w-full h-full bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 animate-pulse" />

                        {/* Target Box */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] border-2 border-primary/50 rounded-2xl flex items-center justify-center">
                            <ScanFace className="w-12 h-12 text-primary/50 animate-bounce" />
                        </div>

                        {/* HUD */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/10">
                            <h3 className="font-bold text-lg">{workName}</h3>
                            <div className="flex items-center gap-2 text-green-400 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                AI Vision Active
                            </div>
                        </div>

                        {/* Feedback Badge */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                            <div className="bg-primary/90 text-white px-6 py-3 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(10,132,255,0.6)] animate-in fade-in slide-in-from-bottom-4">
                                {feedback}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
