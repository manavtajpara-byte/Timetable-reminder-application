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
import { ArrowRight, Lock, Mail } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const login = useAuthStore((state) => state.login)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate network delay
        setTimeout(() => {
            if (email && password) {
                // Mock name generation
                const name = email.split('@')[0]
                login(name, email)
                toast.success("Welcome back!", { description: "You successfully logged in." })
                router.push("/")
            } else {
                toast.error("Invalid credentials", { description: "Please enter any email and password." })
            }
            setIsLoading(false)
        }, 1000)
    }

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Sign In</h1>
                    <p className="text-muted-foreground">Enter your credentials to access your schedule</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <Link href="#" className="text-xs text-primary hover:text-primary/80">Forgot password?</Link>
                        </div>
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
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity" size="lg" disabled={isLoading}>
                        {isLoading ? "Signing in..." : (
                            <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Don&apos;t have an account? </span>
                    <Link href="/register" className="font-semibold text-primary hover:text-primary/80">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}
