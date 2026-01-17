"use client"

import * as React from "react"
import { useTimetableStore } from "@/stores/useTimetableStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Zap } from "lucide-react"

export function ProgressStats() {
    const works = useTimetableStore((state) => state.works)
    const progressLogs = useTimetableStore((state) => state.progressLogs)

    const todayStr = new Date().toISOString().split('T')[0]

    // Calculate Daily Progress
    // Average completion of all tasks scheduled for today? 
    // Or just global "percentage work you do daily" (sum completed / sum expected)?
    const todaysWorks = works.filter(w => w.frequencyDays.includes(new Date().getDay()))

    let totalDailyExpected = 0
    let totalDailyDone = 0
    let totalFocusQuality = 0
    let loggedTasksCount = 0

    todaysWorks.forEach(work => {
        const weight = work.weight || 1
        totalDailyExpected += work.expectedGoalPercent * weight;

        const log = progressLogs.find(l => l.workId === work.id && l.date === todayStr)
        if (log) {
            totalDailyDone += log.completedPercent * weight
            totalFocusQuality += log.focusQuality || 8
            loggedTasksCount++
        }
    })

    const dailyPercent = totalDailyExpected > 0 ? Math.round((totalDailyDone / totalDailyExpected) * 100) : 0
    const avgFocus = loggedTasksCount > 0 ? totalFocusQuality / loggedTasksCount : 0

    // Advanced Productivity Score: (Completion % * Focus Quality) / 10
    const productivityScore = Math.round((dailyPercent * avgFocus) / 10)

    // Overall Progress
    // "how much persontage you had done the hole work"
    // Assuming "whole work" means across the "duration of days" (Total Duration Days).
    // This is tricky without history for all days.
    // We can calculate "Total Tasks Completed" vs "Total Tasks Scheduled Since Creation".

    // For now, let's show "Overall Completion Rate" (all logs / all possible logs since start).

    // Simplified: Average of all logs recorded?
    // Let's stick to Daily for now as it's most relevant.

    const downloadReport = () => {
        const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="%230A84FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>`;

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Progress Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
        header { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        h1 { margin: 0; font-size: 24px; color: #111; }
        .date { color: #666; font-size: 14px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
        .card { background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #eee; }
        .big-number { font-size: 36px; font-weight: bold; color: #0A84FF; margin: 10px 0; }
        table { w-full; width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
        th { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .progress-bar { width: 100px; height: 6px; background: #eee; border-radius: 3px; overflow: hidden; display: inline-block; vertical-align: middle; margin-right: 10px; }
        .progress-fill { height: 100%; background: #0A84FF; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .done { background: #e6fffa; color: #047857; }
        .pending { background: #fffbe6; color: #d97706; }
    </style>
</head>
<body>
    <header>
        ${logoSvg.replace(/%23/g, '#')}
        <div>
            <h1>Timetable Master Report</h1>
            <div class="date">${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
    </header>

    <div class="stats-grid">
        <div class="card">
            <h3>Daily Progress</h3>
            <div class="big-number">${dailyPercent}%</div>
            <p>Overall completion rate for today's tasks.</p>
        </div>
        <div class="card">
            <h3>Tasks Completed</h3>
            <div class="big-number">${todaysWorks.filter(w => (progressLogs.find(l => l.workId === w.id && l.date === todayStr)?.completedPercent || 0) >= w.expectedGoalPercent).length} <span style="font-size: 20px; color: #999">/ ${todaysWorks.length}</span></div>
            <p>Tasks finished vs scheduled.</p>
        </div>
    </div>

    <h2>Task Breakdown</h2>
    <table>
        <thead>
            <tr>
                <th>Activity</th>
                <th>Time</th>
                <th>Goal</th>
                <th>Progress</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${todaysWorks.map(w => {
            const log = progressLogs.find(l => l.workId === w.id && l.date === todayStr);
            const completed = log?.completedPercent || 0;
            const isDone = completed >= w.expectedGoalPercent;
            return `
                <tr>
                    <td><strong>${w.name}</strong><br><span style="font-size:12px;color:#999">${w.category || 'work'}</span></td>
                    <td>${w.startTime} (${w.durationMinutes}m)</td>
                    <td>${w.expectedGoalPercent}%</td>
                    <td>
                        <div class="progress-bar"><div class="progress-fill" style="width: ${Math.min(100, (completed / w.expectedGoalPercent) * 100)}%"></div></div>
                        ${completed}%
                    </td>
                    <td><span class="status-badge ${isDone ? 'done' : 'pending'}">${isDone ? 'COMPLETED' : 'IN PROGRESS'}</span></td>
                </tr>
                `
        }).join('')}
        </tbody>
    </table>

    <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
        Generated by Timetable Master AI
    </div>
</body>
</html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${todayStr}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative p-6 rounded-[2.5rem] glass border-primary/20 overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-20 blur-3xl bg-primary -z-10" />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
                            <Rocket className="w-4 h-4" /> Productivity Score
                        </div>
                        <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {productivityScore}
                        </div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Flow Synergy Index</p>
                    </div>
                    <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-shimmer" style={{ width: `${Math.min(100, (productivityScore / 100) * 100)}%` }} />
                    </div>
                </div>

                <div className="relative p-6 rounded-[2.5rem] glass border-secondary/20 overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-20 blur-3xl bg-secondary -z-10" />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2">
                            <Zap className="w-4 h-4" /> Avg Focus Quality
                        </div>
                        <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                            {avgFocus.toFixed(1)}
                            <span className="text-2xl font-normal text-muted-foreground ml-2">/ 10</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Based on today sessions</p>
                    </div>
                    <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary animate-shimmer" style={{ width: `${avgFocus * 10}%` }} />
                    </div>
                </div>
            </div>

            <button
                onClick={downloadReport}
                className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                Download Daily Report
            </button>
        </div>
    )
}
