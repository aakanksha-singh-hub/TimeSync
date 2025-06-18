export interface City {
    name: string;
    timezone: string;
    utcOffset: string;
    currentTime: string;
}

export interface TimeComparison {
    referenceTime: string;
    cities: City[];
}

export interface Theme {
    isDarkMode: boolean;
}

export interface TimeZoneResponse {
    timezone: string;
    currentTime: string;
    utcOffset: string;
}

export interface Geolocation {
    latitude: number;
    longitude: number;
}