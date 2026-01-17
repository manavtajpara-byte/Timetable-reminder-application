import { WorkItem, UserFitnessProfile } from "@/stores/useTimetableStore";

export type CheckInResult = {
    action: 'maintain' | 'downgrade' | 'upgrade';
    message: string;
    description: string;
};

export const AICoach = {
    analyzeCheckIn: (sleep: number, stress: number, sleepDebt: number = 0): CheckInResult => {
        // High Sleep Debt or Poor Sleep + High Stress
        if (sleepDebt > 3 || sleep < 5 || stress > 8) {
            return {
                action: 'downgrade',
                message: "Energy Preservation Mode",
                description: `Sleep debt is ${sleepDebt}h. Focusing on restorative activities only.`
            };
        }
        // Peak Performance
        else if (sleep > 7 && stress < 4 && sleepDebt < 1) {
            return {
                action: 'upgrade',
                message: "Flow State Potential",
                description: "Biometrics indicate high readiness. Optimal for 'Deep Work' or High Intensity training."
            };
        }

        return {
            action: 'maintain',
            message: "Rhythm Synced",
            description: "Your internal clock and schedule are in perfect harmony."
        };
    },

    getCircadianAdvice: (hour: number): string => {
        if (hour >= 8 && hour <= 11) return "Peak Alertness: Ideal for complex problem solving.";
        if (hour >= 13 && hour <= 15) return "Post-Lunch Slump: Better for low-cognition admin tasks.";
        if (hour >= 17 && hour <= 19) return "Strength Peak: Best time for heavy lifting or HIIT.";
        if (hour >= 21) return "Melatonin Window: Dim lights and reduce blue light exposure.";
        return "Baseline Focus: Good for steady progress.";
    },

    getMealSuggestions: (work: WorkItem): { time: string, meal: string }[] => {
        if (work.category !== 'fitness') return [];

        const workTime = new Date(`2000-01-01T${work.startTime}`);

        // Pre-workout: 90 mins before
        const preTime = new Date(workTime.getTime() - 90 * 60000);
        const preStr = preTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        // Post-workout: 30 mins after end (approx duration + 30)
        const postTime = new Date(workTime.getTime() + (work.durationMinutes + 30) * 60000);
        const postStr = postTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        return [
            { time: preStr, meal: "Pre-Workout Fuel (Carbs + Light Protein)" },
            { time: postStr, meal: "Recovery Meal (High Protein)" }
        ];
    },

    generateBossBattle: (_profile: UserFitnessProfile) => {
        // In a real app, this would be randomized or based on progress.
        // For this feature, we specifically define the "HIIT Hurricane"
        return {
            name: "HIIT Hurricane",
            totalHp: 1000,
            xpReward: 500,
            type: 'hiit',
            rounds: [
                { name: "Jumping Jacks", duration: 30, damage: 150, description: "Cardio ignition" },
                { name: "Mountain Climbers", duration: 30, damage: 200, description: "Core fire" },
                { name: "Burpees", duration: 45, damage: 400, description: "System overload" },
                { name: "Plank Jacks", duration: 30, damage: 250, description: "Stability finisher" }
            ]
        };
    }
};
