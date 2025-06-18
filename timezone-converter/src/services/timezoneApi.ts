import axios from 'axios';
import { DateTime } from 'luxon';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const GEOCODING_API_URL = 'https://api.opencagedata.com/geocode/v1/json';
const TIMEZONE_API_URL = 'https://api.ipgeolocation.io/timezone';

export const fetchTimeZoneByCity = async (city: string) => {
    try {
        const geocodingResponse = await axios.get(GEOCODING_API_URL, {
            params: {
                q: city,
                key: API_KEY,
                limit: 1,
            },
        });

        const { lat, lng } = geocodingResponse.data.results[0].geometry;

        const timezoneResponse = await axios.get(TIMEZONE_API_URL, {
            params: {
                apiKey: 'YOUR_TIMEZONE_API_KEY', // Replace with your actual timezone API key
                lat,
                long: lng,
            },
        });

        return {
            timeZone: timezoneResponse.data.timezone,
            currentTime: DateTime.now().setZone(timezoneResponse.data.timezone).toString(),
            utcOffset: timezoneResponse.data.gmt_offset,
        };
    } catch (error) {
        console.error('Error fetching time zone data:', error);
        throw new Error('Could not fetch time zone data');
    }
};