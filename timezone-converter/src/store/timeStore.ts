import create from 'zustand';

interface City {
    name: string;
    timeZone: string;
    currentTime: string;
    utcOffset: string;
}

interface TimeStore {
    cities: City[];
    addCity: (city: City) => void;
    removeCity: (cityName: string) => void;
    updateCityTime: (cityName: string, currentTime: string, utcOffset: string) => void;
}

const useTimeStore = create<TimeStore>((set) => ({
    cities: [],
    addCity: (city) => set((state) => ({ cities: [...state.cities, city] })),
    removeCity: (cityName) => set((state) => ({
        cities: state.cities.filter(city => city.name !== cityName)
    })),
    updateCityTime: (cityName, currentTime, utcOffset) => set((state) => ({
        cities: state.cities.map(city => 
            city.name === cityName ? { ...city, currentTime, utcOffset } : city
        )
    })),
}));

export default useTimeStore;