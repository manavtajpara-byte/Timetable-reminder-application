import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
    name: string;
    email: string;
    avatar?: string;
};

export type AppSettings = {
    viewMode: 'grid' | 'list';
    showMotivation: boolean;
};

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    settings: AppSettings;

    login: (name: string, email: string) => void;
    register: (name: string, email: string) => void;
    logout: () => void;

    updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            settings: {
                viewMode: 'grid',
                showMotivation: true,
            },

            login: (name, email) => set({
                user: { name, email },
                isAuthenticated: true
            }),

            register: (name, email) => set({
                user: { name, email },
                isAuthenticated: true
            }),

            logout: () => set({
                user: null,
                isAuthenticated: false
            }),

            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            })),
        }),
        {
            name: 'timetable-auth-storage',
        }
    )
);
