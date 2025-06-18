import React from 'react';
import CitySearch from './components/CitySearch';
import TimeComparison from './components/TimeComparison';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Global Time Zone Converter</h1>
        <ThemeToggle />
      </header>
      <main className="flex flex-col items-center">
        <CitySearch />
        <TimeComparison />
      </main>
    </div>
  );
};

export default App;