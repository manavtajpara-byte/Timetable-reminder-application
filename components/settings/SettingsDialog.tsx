"use client"

import * as React from "react"
import { useAuthStore } from "@/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, LayoutGrid, List as ListIcon, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useTimetableStore, type Equipment, type UserFitnessProfile } from "@/stores/useTimetableStore"

function FitnessSettings() {
    const { fitnessProfile, updateFitnessProfile } = useTimetableStore()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Fitness Goal</Label>
                <select
                    value={fitnessProfile.fitnessGoal}
                    onChange={(e) => updateFitnessProfile({ fitnessGoal: e.target.value as UserFitnessProfile['fitnessGoal'] })}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="general">General Fitness</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label>Available Equipment</Label>
                <div className="grid grid-cols-2 gap-2">
                    {['gym', 'dumbbells', 'yoga-mat', 'none'].map((eq) => (
                        <Button
                            key={eq}
                            variant={fitnessProfile.availableEquipment.includes(eq as Equipment) ? 'default' : 'outline'}
                            onClick={() => {
                                const newEq = fitnessProfile.availableEquipment.includes(eq as Equipment)
                                    ? fitnessProfile.availableEquipment.filter(e => e !== eq)
                                    : [...fitnessProfile.availableEquipment, eq as Equipment]
                                updateFitnessProfile({ availableEquipment: newEq })
                            }}
                            className="justify-start border-white/10"
                        >
                            {eq.charAt(0).toUpperCase() + eq.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-white">Current Level</p>
                        <h3 className="text-2xl font-bold text-primary">{fitnessProfile.level}</h3>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">XP</p>
                        <h3 className="text-2xl font-bold text-secondary">{fitnessProfile.xp}</h3>
                    </div>
                </div>
                <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${(fitnessProfile.xp % 1000) / 10}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                    {1000 - (fitnessProfile.xp % 1000)} XP to next level
                </p>
            </div>
        </div>
    )
}

export function SettingsDialog() {
    const { user, logout, settings, updateSettings } = useAuthStore()
    const [open, setOpen] = React.useState(false)

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary/20 text-primary-foreground">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] backdrop-blur-xl bg-black/60 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Manage your account and application preferences.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="fitness">Fitness</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="account" className="space-y-4 py-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl">
                                    {user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                    <Label>Notifications</Label>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <Button
                                variant="destructive"
                                className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                onClick={() => {
                                    logout()
                                    setOpen(false)
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="fitness" className="space-y-6 py-4">
                        <FitnessSettings />
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Layout View</Label>
                                    <p className="text-xs text-muted-foreground">Choose how your schedule is displayed</p>
                                </div>
                                <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
                                    <Button
                                        variant={settings.viewMode === 'grid' ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className={`h-8 px-2 ${settings.viewMode === 'grid' ? "bg-primary text-white" : ""}`}
                                        onClick={() => updateSettings({ viewMode: 'grid' })}
                                    >
                                        <LayoutGrid className="h-4 w-4 mr-1" /> Grid
                                    </Button>
                                    <Button
                                        variant={settings.viewMode === 'list' ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className={`h-8 px-2 ${settings.viewMode === 'list' ? "bg-primary text-white" : ""}`}
                                        onClick={() => updateSettings({ viewMode: 'list' })}
                                    >
                                        <ListIcon className="h-4 w-4 mr-1" /> List
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Motivation</Label>
                                    <p className="text-xs text-muted-foreground">Show &quot;Boost Me&quot; section on dashboard</p>
                                </div>
                                <Switch
                                    checked={settings.showMotivation}
                                    onCheckedChange={(checked) => updateSettings({ showMotivation: checked })}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
