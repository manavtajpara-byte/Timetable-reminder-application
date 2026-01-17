import { type WorkItem } from "@/stores/useTimetableStore"

export const TaskBreakdown = {
    breakdown: async (task: string): Promise<string[]> => {
        // AI Simulation: Real-world would use an LLM API
        const lowerTask = task.toLowerCase()

        if (lowerTask.includes('study') || lowerTask.includes('read')) {
            return [
                "Open your materials/textbook",
                "Review the table of contents/chapter headings",
                "Summarize the first 3 key points",
                "Do 2 practice problems or self-quiz",
                "Check answers and note down murky areas"
            ]
        }

        if (lowerTask.includes('exercise') || lowerTask.includes('workout') || lowerTask.includes('gym')) {
            return [
                "Change into workout clothes",
                "Fill water bottle and grab a towel",
                "5-minute dynamic warmup",
                "Focus on the main routine (3 sets)",
                "Post-workout stretch and cooldown"
            ]
        }

        if (lowerTask.includes('clean') || lowerTask.includes('organize')) {
            return [
                "Set a 10-minute timer",
                "Clear all flat surfaces",
                "Put away items belonging in other rooms",
                "Wipe down high-touch areas",
                "Take out any trash/recycling"
            ]
        }

        return [
            "Set clear intention for the next 25 minutes",
            "Remove digital distractions (phone away)",
            "Get first tangible output created",
            "Review progress against initial goal",
            "Deep focus check-in"
        ]
    }
}
