"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Zap } from "lucide-react"

const QUOTES = [
    "Believe you can and you're halfway there.",
    "Your time is limited, don't waste it living someone else's life.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Everything you've ever wanted is on the other side of fear.",
    "Success usually comes to those who are too busy to be looking for it."
];

export function MotivationSection() {
    const [open, setOpen] = React.useState(false)
    const [quote, setQuote] = React.useState("")

    const showQuote = () => {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
        setQuote(randomQuote)
        setOpen(true)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex justify-center my-6">
                <Button
                    onClick={showQuote}
                    className="bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold py-6 px-8 rounded-full shadow-xl hover:scale-105 transition-transform text-lg border-2 border-white/20 animate-pulse"
                >
                    <Zap className="mr-2 h-6 w-6 fill-yellow-300 text-yellow-300" />
                    Boost Me!
                </Button>
            </div>

            <DialogContent className="sm:max-w-md border-4 border-primary">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-center text-primary">Daily Motivation</DialogTitle>
                </DialogHeader>
                <div className="py-8 text-center">
                    <p className="text-xl italic font-serif text-foreground/80">
                        &quot;{quote}&quot;
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
