export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  timezone: string;
  continent: string;
  population?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  aliases?: string[];
}

export const cities: City[] = [
  // North America
  {
    id: "new-york",
    name: "New York",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    timezone: "America/New_York",
    continent: "North America",
    population: 8336817,
    coordinates: { lat: 40.7128, lng: -74.006 },
    aliases: ["NYC", "New York City", "Manhattan"],
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    timezone: "America/Los_Angeles",
    continent: "North America",
    population: 3979576,
    coordinates: { lat: 34.0522, lng: -118.2437 },
    aliases: ["LA", "Los Angeles", "City of Angels"],
  },
  {
    id: "chicago",
    name: "Chicago",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    timezone: "America/Chicago",
    continent: "North America",
    population: 2693976,
    coordinates: { lat: 41.8781, lng: -87.6298 },
    aliases: ["Chi-town", "Windy City"],
  },
  {
    id: "toronto",
    name: "Toronto",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    timezone: "America/Toronto",
    continent: "North America",
    population: 2930000,
    coordinates: { lat: 43.6532, lng: -79.3832 },
  },
  {
    id: "vancouver",
    name: "Vancouver",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    timezone: "America/Vancouver",
    continent: "North America",
    population: 675218,
    coordinates: { lat: 49.2827, lng: -123.1207 },
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    timezone: "America/Mexico_City",
    continent: "North America",
    population: 9209944,
    coordinates: { lat: 19.4326, lng: -99.1332 },
    aliases: ["Ciudad de México", "CDMX"],
  },

  // South America
  {
    id: "sao-paulo",
    name: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    timezone: "America/Sao_Paulo",
    continent: "South America",
    population: 12325232,
    coordinates: { lat: -23.5505, lng: -46.6333 },
    aliases: ["Sao Paulo"],
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    flag: "🇦🇷",
    timezone: "America/Argentina/Buenos_Aires",
    continent: "South America",
    population: 2890151,
    coordinates: { lat: -34.6037, lng: -58.3816 },
  },
  {
    id: "bogota",
    name: "Bogotá",
    country: "Colombia",
    countryCode: "CO",
    flag: "🇨🇴",
    timezone: "America/Bogota",
    continent: "South America",
    population: 7412566,
    coordinates: { lat: 4.711, lng: -74.0721 },
    aliases: ["Bogota"],
  },
  {
    id: "lima",
    name: "Lima",
    country: "Peru",
    countryCode: "PE",
    flag: "🇵🇪",
    timezone: "America/Lima",
    continent: "South America",
    population: 9674755,
    coordinates: { lat: -12.0464, lng: -77.0428 },
  },

  // Europe
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    timezone: "Europe/London",
    continent: "Europe",
    population: 9648110,
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    timezone: "Europe/Paris",
    continent: "Europe",
    population: 2165423,
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    timezone: "Europe/Berlin",
    continent: "Europe",
    population: 3669491,
    coordinates: { lat: 52.52, lng: 13.405 },
  },
  {
    id: "madrid",
    name: "Madrid",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    timezone: "Europe/Madrid",
    continent: "Europe",
    population: 3223334,
    coordinates: { lat: 40.4168, lng: -3.7038 },
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    timezone: "Europe/Rome",
    continent: "Europe",
    population: 2872800,
    coordinates: { lat: 41.9028, lng: 12.4964 },
    aliases: ["Roma"],
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    timezone: "Europe/Amsterdam",
    continent: "Europe",
    population: 873338,
    coordinates: { lat: 52.3676, lng: 4.9041 },
  },
  {
    id: "moscow",
    name: "Moscow",
    country: "Russia",
    countryCode: "RU",
    flag: "🇷🇺",
    timezone: "Europe/Moscow",
    continent: "Europe",
    population: 12506468,
    coordinates: { lat: 55.7558, lng: 37.6173 },
    aliases: ["Moskva"],
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    timezone: "Europe/Istanbul",
    continent: "Europe",
    population: 15462452,
    coordinates: { lat: 41.0082, lng: 28.9784 },
  },

  // Asia
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    timezone: "Asia/Tokyo",
    continent: "Asia",
    population: 13960000,
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    id: "shanghai",
    name: "Shanghai",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    timezone: "Asia/Shanghai",
    continent: "Asia",
    population: 24870000,
    coordinates: { lat: 31.2304, lng: 121.4737 },
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    timezone: "Asia/Shanghai",
    continent: "Asia",
    population: 21540000,
    coordinates: { lat: 39.9042, lng: 116.4074 },
    aliases: ["Peking"],
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    timezone: "Asia/Singapore",
    continent: "Asia",
    population: 5685807,
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    id: "hong-kong",
    name: "Hong Kong",
    country: "Hong Kong",
    countryCode: "HK",
    flag: "🇭🇰",
    timezone: "Asia/Hong_Kong",
    continent: "Asia",
    population: 7496981,
    coordinates: { lat: 22.3193, lng: 114.1694 },
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    timezone: "Asia/Seoul",
    continent: "Asia",
    population: 9720846,
    coordinates: { lat: 37.5665, lng: 126.978 },
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    continent: "Asia",
    population: 12478447,
    coordinates: { lat: 19.076, lng: 72.8777 },
    aliases: ["Bombay"],
  },
  {
    id: "delhi",
    name: "New Delhi",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    continent: "Asia",
    population: 29399141,
    coordinates: { lat: 28.6139, lng: 77.209 },
    aliases: ["Delhi"],
  },
  {
    id: "bangalore",
    name: "Bangalore",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    timezone: "Asia/Kolkata",
    continent: "Asia",
    population: 12326532,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    aliases: ["Bengaluru"],
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    timezone: "Asia/Dubai",
    continent: "Asia",
    population: 3331420,
    coordinates: { lat: 25.2048, lng: 55.2708 },
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    flag: "🇹🇭",
    timezone: "Asia/Bangkok",
    continent: "Asia",
    population: 10539415,
    coordinates: { lat: 13.7563, lng: 100.5018 },
    aliases: ["Krung Thep"],
  },
  {
    id: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    countryCode: "ID",
    flag: "🇮🇩",
    timezone: "Asia/Jakarta",
    continent: "Asia",
    population: 10770487,
    coordinates: { lat: -6.2088, lng: 106.8456 },
  },

  // Africa
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    countryCode: "EG",
    flag: "🇪🇬",
    timezone: "Africa/Cairo",
    continent: "Africa",
    population: 9500000,
    coordinates: { lat: 30.0444, lng: 31.2357 },
    aliases: ["Al Qāhirah"],
  },
  {
    id: "johannesburg",
    name: "Johannesburg",
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    timezone: "Africa/Johannesburg",
    continent: "Africa",
    population: 4434827,
    coordinates: { lat: -26.2041, lng: 28.0473 },
    aliases: ["Joburg", "Jo'burg"],
  },
  {
    id: "lagos",
    name: "Lagos",
    country: "Nigeria",
    countryCode: "NG",
    flag: "🇳🇬",
    timezone: "Africa/Lagos",
    continent: "Africa",
    population: 14368332,
    coordinates: { lat: 6.5244, lng: 3.3792 },
  },
  {
    id: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    timezone: "Africa/Nairobi",
    continent: "Africa",
    population: 4397073,
    coordinates: { lat: -1.2921, lng: 36.8219 },
  },

  // Oceania
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    timezone: "Australia/Sydney",
    continent: "Oceania",
    population: 5312163,
    coordinates: { lat: -33.8688, lng: 151.2093 },
  },
  {
    id: "melbourne",
    name: "Melbourne",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    timezone: "Australia/Melbourne",
    continent: "Oceania",
    population: 5159211,
    coordinates: { lat: -37.8136, lng: 144.9631 },
  },
  {
    id: "auckland",
    name: "Auckland",
    country: "New Zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    timezone: "Pacific/Auckland",
    continent: "Oceania",
    population: 1695200,
    coordinates: { lat: -36.8485, lng: 174.7633 },
  },
];

export const findCitiesByQuery = (query: string): City[] => {
  if (!query.trim()) return cities;

  const lowercaseQuery = query.toLowerCase();

  return cities.filter(
    (city) =>
      city.name.toLowerCase().includes(lowercaseQuery) ||
      city.country.toLowerCase().includes(lowercaseQuery) ||
      city.countryCode.toLowerCase().includes(lowercaseQuery) ||
      city.timezone.toLowerCase().includes(lowercaseQuery) ||
      city.aliases?.some((alias) =>
        alias.toLowerCase().includes(lowercaseQuery)
      )
  );
};

export const getCityById = (id: string): City | undefined => {
  return cities.find((city) => city.id === id);
};

export const getCityByTimezone = (timezone: string): City | undefined => {
  return cities.find((city) => city.timezone === timezone);
};

export const getCitiesByContinent = (): Record<string, City[]> => {
  return cities.reduce((acc, city) => {
    if (!acc[city.continent]) {
      acc[city.continent] = [];
    }
    acc[city.continent].push(city);
    return acc;
  }, {} as Record<string, City[]>);
};
