"use client"

import { useEffect, useRef } from 'react'
import { useTimetableStore } from '@/stores/useTimetableStore'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function useAlarm() {
    const works = useTimetableStore((state) => state.works)
    const lastCheckedMinute = useRef<string>("")

    useEffect(() => {
        // Request notification permission on mount
        if ("Notification" in window) {
            if (Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission()
            }
        }

        const checkAlarms = () => {
            const now = new Date()
            const currentDay = now.getDay()
            const currentTime = format(now, 'HH:mm')

            // Avoid double checks in the same minute
            if (currentTime === lastCheckedMinute.current) return
            lastCheckedMinute.current = currentTime

            // Find works that start now
            const startingWorks = works.filter(work =>
                work.frequencyDays.includes(currentDay) &&
                work.startTime === currentTime
            )

            startingWorks.forEach(work => {
                // Trigger Alarm
                playAlarm(work.name)

                toast.info(`Time for ${work.name}!`, {
                    duration: 10000,
                    action: {
                        label: 'I\'m Ready',
                        onClick: () => console.log('Started'),
                    },
                })

                if (Notification.permission === "granted") {
                    new Notification(`Time for ${work.name}`, {
                        body: `You scheduled ${work.durationMinutes} mins for this task.`,
                        // icon: '/icon.png'
                    })
                }
            })
        }

        const intervalId = setInterval(checkAlarms, 10000) // Check every 10 seconds

        return () => clearInterval(intervalId)
    }, [works])
}

function playAlarm(workName: string) {
    // Use speech synthesis for a clearer "alarm"
    // Or play a beep sound
    const synth = window.speechSynthesis;
    if (synth) {
        const utterance = new SpeechSynthesisUtterance(`It's time for ${workName}`);
        synth.speak(utterance);
    }

    // Also play a sound if possible (fallback)
    // const audio = new Audio('/alarm.mp3');
    // audio.play().catch(e => console.log("Audio play failed", e));
}
