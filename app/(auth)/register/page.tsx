"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/stores/useAuthStore"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowRight, Lock, Mail, User } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const register = useAuthStore((state) => state.register)
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate network delay
        setTimeout(() => {
            if (name && email && password.length >= 6) {
                register(name, email)
                toast.success("Account created!", { description: "Welcome to Timetable Master." })
                router.push("/")
            } else {
                if (password.length < 6) {
                    toast.error("Weak password", { description: "Password must be at least 6 characters." })
                } else {
                    toast.error("Invalid details", { description: "Please fill in all fields." })
                }
            }
            setIsLoading(false)
        }, 1200)
    }

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Create Account</h1>
                    <p className="text-muted-foreground">Get started with your productive journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="hello@example.com"
                                className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-muted-foreground/50 focus-visible:ring-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity" size="lg" disabled={isLoading}>
                        {isLoading ? "Creating account..." : (
                            <>Sign Up <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
                        Sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}
