import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, Language } from "@/lib/translations";

const useStore = create(
  persist(
    (set, get) => ({
      // Authentication state
      isAuthenticated: false,
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }), 
      clearUser: () => set({ user: null, isAuthenticated: false }),

      // Theme state
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === "dark" ? "light" : "dark"
      })),

      // Language state
      language: Language.EN,
      setLanguage: (language) => {
        if (language === Language.EN || language === Language.VI) {
          set({ language, t: translations[language] });
          localStorage.setItem("language", language);
        }
      },
      t: translations[Language.EN],
    }),
    {
      name: "app-storage",
      partialize: (state) => ({ theme: state.theme, language: state.language, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useAppStore = () => {
  const { theme, toggleTheme, setTheme, language, setLanguage, t, isAuthenticated, user, setUser, setIsAuthenticated, clearUser } = useStore();
  return { theme, toggleTheme, setTheme, language, setLanguage, t, isAuthenticated, user, setUser, setIsAuthenticated, clearUser };
};

export default useStore;