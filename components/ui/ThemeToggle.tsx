'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Only show the theme toggle once component is mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center space-x-1 bg-secondary/60 rounded-lg p-1">
            <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md ${theme === 'light'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:bg-secondary/80'
                    }`}
                aria-label="Light mode"
                title="Light mode"
            >
                <FiSun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md ${theme === 'dark'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:bg-secondary/80'
                    }`}
                aria-label="Dark mode"
                title="Dark mode"
            >
                <FiMoon className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-md ${theme === 'system'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:bg-secondary/80'
                    }`}
                aria-label="System preference"
                title="System preference"
            >
                <FiMonitor className="w-4 h-4" />
            </button>
        </div>
    );
}