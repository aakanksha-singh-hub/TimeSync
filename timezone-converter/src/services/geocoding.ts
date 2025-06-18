import axios from 'axios';
import { GeoCoordinates } from '../types';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';

export const getCoordinatesByCity = async (city: string): Promise<GeoCoordinates | null> => {
    try {
        const response = await axios.get(`${BASE_URL}?q=${encodeURIComponent(city)}&key=${API_KEY}`);
        const results = response.data.results;

        if (results.length > 0) {
            const { geometry } = results[0];
            return {
                latitude: geometry.lat,
                longitude: geometry.lng,
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
};