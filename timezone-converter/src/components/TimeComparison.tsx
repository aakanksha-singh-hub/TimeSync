import React from 'react';
import { useStore } from '../store/timeStore';
import TimeCard from './TimeCard';

const TimeComparison: React.FC = () => {
    const { cities, referenceTime } = useStore(state => ({
        cities: state.cities,
        referenceTime: state.referenceTime,
    }));

    return (
        <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-bold">Time Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map(city => (
                    <TimeCard key={city.id} city={city} referenceTime={referenceTime} />
                ))}
            </div>
        </div>
    );
};

export default TimeComparison;