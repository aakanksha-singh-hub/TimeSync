import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
=======
import { Sun, Moon } from 'lucide-react';
>>>>>>> 560aac6 (UI fixes: theme toggle, card alignment, icon sizing, header improvements, and git setup)

const ThemeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            setIsDarkMode(currentTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <button
            onClick={toggleTheme}
<<<<<<< HEAD
            className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors"
        >
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
=======
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow transition-colors hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
        >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
>>>>>>> 560aac6 (UI fixes: theme toggle, card alignment, icon sizing, header improvements, and git setup)
        </button>
    );
};

export default ThemeToggle;