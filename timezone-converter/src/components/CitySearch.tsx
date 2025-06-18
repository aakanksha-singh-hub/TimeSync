import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { fetchTimeZone } from '../services/timezoneApi';

const CitySearch: React.FC<{ onCitySelect: (city: string, timeZone: string) => void }> = ({ onCitySelect }) => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedInput] = useDebounce(inputValue, 300);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    React.useEffect(() => {
        if (debouncedInput) {
            fetchTimeZone(debouncedInput).then((results) => {
                setSuggestions(results);
            });
        } else {
            setSuggestions([]);
        }
    }, [debouncedInput]);

    const handleSuggestionClick = (city: string, timeZone: string) => {
        onCitySelect(city, timeZone);
        setInputValue('');
        setSuggestions([]);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter city name..."
                className="border rounded p-2 w-full"
            />
            {suggestions.length > 0 && (
                <ul className="absolute bg-white border rounded mt-1 w-full max-h-60 overflow-auto z-10">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion, suggestion.timeZone)}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CitySearch;