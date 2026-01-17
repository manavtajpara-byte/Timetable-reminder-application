import Link from "next/link"
import { CalendarClock } from "lucide-react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background is handled by globals.css body, but we can add an overlay if needed */}

            <div className="w-full max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/20 group-hover:scale-110 transition-transform">
                            <CalendarClock className="h-8 w-8 text-primary" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">Timetable Master</span>
                    </Link>
                </div>

                <div className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-1">
                    <div className="bg-gradient-to-br from-white/10 to-transparent rounded-[20px] p-6 sm:p-8">
                        {children}
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Timetable Master. All rights reserved.
                </div>
            </div>
        </div>
    )
}
