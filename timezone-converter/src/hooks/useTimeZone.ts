import { useEffect, useState } from 'react';
import { fetchTimeZone } from '../services/timezoneApi';
import { TimeZoneData } from '../types';

const useTimeZone = (city: string) => {
    const [timeZoneData, setTimeZoneData] = useState<TimeZoneData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTimeZone = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchTimeZone(city);
                setTimeZoneData(data);
            } catch (err) {
                setError('Failed to fetch time zone data');
            } finally {
                setLoading(false);
            }
        };

        if (city) {
            getTimeZone();
        }
    }, [city]);

    return { timeZoneData, loading, error };
};

export default useTimeZone;