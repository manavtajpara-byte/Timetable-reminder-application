"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Coffee, Smartphone, Wifi, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function IoTControl() {
    const [connecting, setConnecting] = React.useState<string | null>(null)
    const [devices, setDevices] = React.useState({
        lights: false,
        coffee: false,
        ambient: true
    })

    const toggleDevice = (device: keyof typeof devices) => {
        setConnecting(device)
        setTimeout(() => {
            setDevices(prev => ({ ...prev, [device]: !prev[device] }))
            setConnecting(null)
            toast.success(`${device.charAt(0).toUpperCase() + device.slice(1)} updated`, {
                description: `Sent IoT command via Simulated Smart Bridge.`
            })
        }, 800)
    }

    return (
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-blue-400" />
                    Physical World Sync (IoT)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => toggleDevice('lights')}
                        className={`flex-col h-20 gap-2 border-white/5 transition-all ${devices.lights ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'hover:bg-white/5'}`}
                        disabled={connecting === 'lights'}
                    >
                        {connecting === 'lights' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lightbulb className="h-5 w-5" />}
                        <span className="text-[10px] uppercase font-bold">Lights</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => toggleDevice('coffee')}
                        className={`flex-col h-20 gap-2 border-white/5 transition-all ${devices.coffee ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'hover:bg-white/5'}`}
                        disabled={connecting === 'coffee'}
                    >
                        {connecting === 'coffee' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Coffee className="h-5 w-5" />}
                        <span className="text-[10px] uppercase font-bold">Coffee</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => toggleDevice('ambient')}
                        className={`flex-col h-20 gap-2 border-white/5 transition-all ${devices.ambient ? 'bg-primary/10 border-primary/20 text-primary' : 'hover:bg-white/5'}`}
                        disabled={connecting === 'ambient'}
                    >
                        {connecting === 'ambient' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Smartphone className="h-5 w-5" />}
                        <span className="text-[10px] uppercase font-bold">Ambient</span>
                    </Button>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                        <Wifi className="h-3 w-3" /> Smart Hub Online
                    </div>
                    <span className="text-[9px] text-muted-foreground italic">v2.4.0-Stable</span>
                </div>
            </CardContent>
        </Card>
    )
}
