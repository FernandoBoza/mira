import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Theme, useThemeStore } from '@/stores/theme.store.ts';
import { useEffect } from 'react';

export const ModeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    let sysTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const localTheme = localStorage.getItem('theme') as Theme;

    if (!localTheme && theme === 'system') {
      document.documentElement.className = sysTheme.matches ? 'dark' : 'light';
    } else if (!localTheme) {
      document.documentElement.className = theme;
    }
    const changeColorScheme = () => {
      const newSysTheme = sysTheme.matches ? 'dark' : 'light';
      if (theme === 'system') {
        document.documentElement.className = newSysTheme;
      }
      setTheme(newSysTheme);
    };

    sysTheme.addEventListener('change', changeColorScheme);

    return () => {
      sysTheme.removeEventListener('change', changeColorScheme);
    };
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(sysTheme)}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
