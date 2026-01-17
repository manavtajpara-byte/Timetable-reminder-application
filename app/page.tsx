"use client"

import { Navbar } from "@/components/layout/Navbar"
import { DailyView } from "@/components/dashboard/DailyView"
import { useAlarm } from "@/hooks/useAlarm"

export default function Home() {
  // Activate alarm system
  useAlarm()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <DailyView />
      </main>
    </div>
  );
}
