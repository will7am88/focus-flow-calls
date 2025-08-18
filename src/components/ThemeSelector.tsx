import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSelectorProps {
  onThemeChange?: (theme: Theme) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Get initial theme from localStorage or default to light
    const savedTheme = localStorage.getItem('bidnes-theme') as Theme || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'system') {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
    
    // Save to localStorage
    localStorage.setItem('bidnes-theme', newTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return 'Professional';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return 'System';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 left-4 z-40 bg-card border border-border shadow-medium hover:bg-surface-hover"
        >
          {getThemeIcon(theme)}
          <span className="ml-2 hidden sm:inline">{getThemeLabel(theme)}</span>
          <ChevronDown className="h-3 w-3 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-48 bg-card border border-border shadow-large"
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className="flex items-center gap-2 cursor-pointer hover:bg-surface"
        >
          <Sun className="h-4 w-4" />
          <span>Professional</span>
          {theme === 'light' && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className="flex items-center gap-2 cursor-pointer hover:bg-surface"
        >
          <Moon className="h-4 w-4" />
          <span>Dark Mode</span>
          {theme === 'dark' && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className="flex items-center gap-2 cursor-pointer hover:bg-surface"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}