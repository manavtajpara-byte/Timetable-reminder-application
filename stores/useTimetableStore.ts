import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = 'work' | 'fitness' | 'learning' | 'health';
export type Equipment = 'none' | 'gym' | 'dumbbells' | 'yoga-mat';

export type WorkItem = {
    id: string;
    name: string;
    category: Category;
    intensity: number; // 1-10
    equipment: Equipment[];
    startTime: string; // "HH:mm" 24h format
    durationMinutes: number;
    weight?: number; // 1-5 (Advanced Productivity Math)
    frequencyDays: number[]; // 0=Sun, 1=Mon, ... 6=Sat
    totalDurationDays: number;
    createdAt: number;
    expectedGoalPercent: number;
    isGhost?: boolean; // Optional "filler" task
    isParkingLot?: boolean; // Unscheduled task
    deadline?: string; // "YYYY-MM-DD" for back-casting
};

export type ProgressLog = {
    workId: string;
    date: string; // "YYYY-MM-DD"
    completedPercent: number;
    focusQuality: number; // 1-10 (Advanced Productivity Math)
    mood?: 'tired' | 'neutral' | 'energetic'; // specific to this session
};

export type UserFitnessProfile = {
    level: number;
    xp: number;
    streak: number;
    fitnessGoal: 'weight-loss' | 'muscle' | 'endurance' | 'general';
    availableEquipment: Equipment[];
};

interface TimetableState {
    works: WorkItem[];
    progressLogs: ProgressLog[];
    fitnessProfile: UserFitnessProfile;

    addWork: (work: Omit<WorkItem, 'id' | 'createdAt'>) => void;
    removeWork: (id: string) => void;
    updateWork: (id: string, updates: Partial<WorkItem>) => void;
    logProgress: (workId: string, date: string, percent: number, focusQuality: number) => void;

    // Gamification
    addXp: (amount: number) => void;
    updateFitnessProfile: (updates: Partial<UserFitnessProfile>) => void;

    // Flex Logic
    getWorkForDay: (dayIndex: number) => WorkItem[];
    getParkingLot: () => WorkItem[];
    backcastDeadline: (name: string, deadline: string, intensity: number) => void;
}

export const useTimetableStore = create<TimetableState>()(
    persist(
        (set, get) => ({
            works: [],
            progressLogs: [],
            fitnessProfile: {
                level: 1,
                xp: 0,
                streak: 0,
                fitnessGoal: 'general',
                availableEquipment: ['none'],
            },

            addWork: (work) => set((state) => ({
                works: [
                    ...state.works,
                    {
                        ...work,
                        id: crypto.randomUUID(),
                        createdAt: Date.now(),
                    },
                ],
            })),

            removeWork: (id) => set((state) => ({
                works: state.works.filter((w) => w.id !== id),
            })),

            updateWork: (id, updates) => set((state) => ({
                works: state.works.map((w) =>
                    w.id === id ? { ...w, ...updates } : w
                ),
            })),

            logProgress: (workId, date, percent, focusQuality) => set((state) => {
                const existingLogIndex = state.progressLogs.findIndex(
                    (log) => log.workId === workId && log.date === date
                );

                const newLogs = [...state.progressLogs];
                let xpGained = 0;

                if (existingLogIndex >= 0) {
                    newLogs[existingLogIndex].completedPercent = percent;
                    newLogs[existingLogIndex].focusQuality = focusQuality;
                } else {
                    newLogs.push({ workId, date, completedPercent: percent, focusQuality });
                    // Simple XP reward for logging for the first time today for this item
                    xpGained = 50 + (focusQuality * 5); // Reward higher focus
                }

                // Check for level up logic could go here or in addXp
                const currentXp = state.fitnessProfile.xp + xpGained;
                const currentLevel = Math.floor(currentXp / 1000) + 1; // Simple linear leveling

                return {
                    progressLogs: newLogs,
                    fitnessProfile: {
                        ...state.fitnessProfile,
                        xp: currentXp,
                        level: currentLevel
                    }
                };
            }),

            addXp: (amount) => set((state) => {
                const newXp = state.fitnessProfile.xp + amount;
                return {
                    fitnessProfile: {
                        ...state.fitnessProfile,
                        xp: newXp,
                        level: Math.floor(newXp / 1000) + 1
                    }
                };
            }),

            updateFitnessProfile: (updates) => set((state) => ({
                fitnessProfile: { ...state.fitnessProfile, ...updates }
            })),

            getWorkForDay: (dayIndex) => {
                return get().works.filter((w) => w.frequencyDays.includes(dayIndex) && !w.isParkingLot);
            },

            getParkingLot: () => {
                return get().works.filter((w) => w.isParkingLot);
            },

            backcastDeadline: (name, deadline, intensity) => set((state) => {
                const deadlineDate = new Date(deadline);
                const today = new Date();
                const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays <= 0) return state;

                const newWorks: WorkItem[] = [];
                for (let i = 0; i < diffDays; i++) {
                    const currentDay = new Date();
                    currentDay.setDate(today.getDate() + i);

                    newWorks.push({
                        id: crypto.randomUUID(),
                        name: `${name} (Day ${i + 1}/${diffDays})`,
                        category: 'learning',
                        intensity: Math.min(10, intensity + Math.floor(i / 2)), // Ramp up intensity
                        equipment: ['none'],
                        startTime: "10:00", // Default start time
                        durationMinutes: 60 + (i * 15), // Ramp up duration
                        frequencyDays: [currentDay.getDay()],
                        totalDurationDays: 1,
                        createdAt: Date.now(),
                        expectedGoalPercent: 100,
                        deadline: deadline
                    });
                }

                return {
                    works: [...state.works, ...newWorks]
                };
            }),
        }),
        {
            name: 'timetable-storage',
            // Migrations could be handled here if we were using a real DB, 
            // but for localStorage we might need to be careful about versioning or just clear it.
            // For this prototype, we assume fresh start or compatible fields.
        }
    )
);
