import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City, getCityById } from "@/data/cities";
import { DateTime } from "luxon";

export interface TimeSyncState {
  sourceCity: City | null;
  targetCities: City[];
  selectedDateTime: DateTime;
  pinnedCities: City[];
  realTimeMode: boolean;

  // UI State
  show24Hour: boolean;
  theme: "light" | "dark" | "system";
  compactView: boolean;

  // Actions
  setSourceCity: (city: City | null) => void;
  addTargetCity: (city: City) => void;
  removeTargetCity: (cityId: string) => void;
  setSelectedDateTime: (dateTime: DateTime) => void;
  swapCities: () => void;

  // Pinned cities
  addPinnedCity: (city: City) => void;
  removePinnedCity: (cityId: string) => void;
  isPinned: (cityId: string) => boolean;

  // Bulk operations
  addMultipleCities: (cities: City[]) => void;
  clearAllTargets: () => void;

  // Settings
  toggleRealTimeMode: () => void;
  toggle24Hour: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleCompactView: () => void;

  // URL handling
  generateShareableUrl: () => string;
  loadFromUrl: (url: string) => void;
  parseUrlParams: () => void;

  // Reset
  reset: () => void;
}

const initialState = {
  sourceCity: getCityById("new-york"),
  targetCities: [getCityById("london"), getCityById("tokyo")].filter(
    Boolean
  ) as City[],
  selectedDateTime: DateTime.now(),
  pinnedCities: [],
  realTimeMode: true,

  // UI defaults
  show24Hour: false,
  theme: "system" as const,
  compactView: false,
};

export const useTimeSyncStore = create<TimeSyncState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSourceCity: (city) => set({ sourceCity: city }),

      addTargetCity: (city) =>
        set((state) => {
          if (state.targetCities.find((c) => c.id === city.id)) return state;
          return { targetCities: [...state.targetCities, city] };
        }),

      removeTargetCity: (cityId) =>
        set((state) => ({
          targetCities: state.targetCities.filter((c) => c.id !== cityId),
        })),

      setSelectedDateTime: (dateTime) => set({ selectedDateTime: dateTime }),

      swapCities: () =>
        set((state) => {
          if (!state.sourceCity || state.targetCities.length === 0)
            return state;

          const newSource = state.targetCities[0];
          const newTargets = [state.sourceCity, ...state.targetCities.slice(1)];

          return {
            sourceCity: newSource,
            targetCities: newTargets,
          };
        }),

      // Pinned cities
      addPinnedCity: (city) =>
        set((state) => {
          if (state.pinnedCities.find((c) => c.id === city.id)) return state;
          return { pinnedCities: [...state.pinnedCities, city] };
        }),

      removePinnedCity: (cityId) =>
        set((state) => ({
          pinnedCities: state.pinnedCities.filter((c) => c.id !== cityId),
        })),

      isPinned: (cityId) => {
        const state = get();
        return state.pinnedCities.some((c) => c.id === cityId);
      },

      // Bulk operations
      addMultipleCities: (cities) =>
        set((state) => {
          const existingIds = new Set(state.targetCities.map((c) => c.id));
          const newCities = cities.filter((city) => !existingIds.has(city.id));
          return { targetCities: [...state.targetCities, ...newCities] };
        }),

      clearAllTargets: () => set({ targetCities: [] }),

      // Settings
      toggleRealTimeMode: () =>
        set((state) => ({ realTimeMode: !state.realTimeMode })),
      toggle24Hour: () => set((state) => ({ show24Hour: !state.show24Hour })),
      setTheme: (theme) => set({ theme }),
      toggleCompactView: () =>
        set((state) => ({ compactView: !state.compactView })),

      // URL handling
      generateShareableUrl: () => {
        const state = get();
        const params = new URLSearchParams();

        if (state.sourceCity) {
          params.set("ref", state.sourceCity.id);
        }

        if (state.targetCities.length > 0) {
          params.set("targets", state.targetCities.map((c) => c.id).join(","));
        }

        if (!state.realTimeMode) {
          params.set("time", state.selectedDateTime.toISO());
        }

        if (state.show24Hour) {
          params.set("format", "24h");
        }

        if (state.theme !== "system") {
          params.set("theme", state.theme);
        }

        return `${window.location.origin}?${params.toString()}`;
      },

      loadFromUrl: (url) => {
        try {
          const urlObj = new URL(url);
          const params = urlObj.searchParams;

          // Load source city
          const refCity = params.get("ref");
          if (refCity) {
            const city = getCityById(refCity);
            if (city) {
              set({ sourceCity: city });
            }
          }

          // Load target cities
          const targets = params.get("targets");
          if (targets) {
            const cityIds = targets.split(",");
            const cities = cityIds
              .map((id) => getCityById(id))
              .filter(Boolean) as City[];
            set({ targetCities: cities });
          }

          // Load time
          const timeParam = params.get("time");
          if (timeParam) {
            const time = DateTime.fromISO(timeParam);
            if (time.isValid) {
              set({
                selectedDateTime: time,
                realTimeMode: false,
              });
            }
          }

          // Load format
          const format = params.get("format");
          if (format === "24h") {
            set({ show24Hour: true });
          }

          // Load theme
          const theme = params.get("theme");
          if (theme === "light" || theme === "dark") {
            set({ theme });
          }
        } catch (error) {
          console.error("Error loading from URL:", error);
        }
      },

      parseUrlParams: () => {
        const params = new URLSearchParams(window.location.search);

        // Parse reference city
        const refCity = params.get("ref");
        if (refCity) {
          const city = getCityById(refCity);
          if (city) {
            set({ sourceCity: city });
          }
        }

        // Parse target cities
        const targets = params.get("targets");
        if (targets) {
          const cityIds = targets.split(",");
          const cities = cityIds
            .map((id) => getCityById(id))
            .filter(Boolean) as City[];
          if (cities.length > 0) {
            set({ targetCities: cities });
          }
        }

        // Parse time
        const timeParam = params.get("time");
        if (timeParam) {
          const time = DateTime.fromISO(timeParam);
          if (time.isValid) {
            set({
              selectedDateTime: time,
              realTimeMode: false,
            });
          }
        }

        // Parse format
        const format = params.get("format");
        if (format === "24h") {
          set({ show24Hour: true });
        }

        // Parse theme
        const theme = params.get("theme");
        if (theme === "light" || theme === "dark") {
          set({ theme });
        }

        // Parse compact mode
        const compact = params.get("compact");
        if (compact === "true") {
          set({ compactView: true });
        }
      },

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: "timesync-storage",
      partialize: (state) => ({
        pinnedCities: state.pinnedCities,
        show24Hour: state.show24Hour,
        theme: state.theme,
        compactView: state.compactView,
      }),
    }
  )
);
