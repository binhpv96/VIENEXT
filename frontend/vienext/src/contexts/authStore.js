import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    user: null,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;