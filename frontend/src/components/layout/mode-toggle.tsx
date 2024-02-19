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
  const sysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  useEffect(() => {
    const localTheme = localStorage.getItem('theme') as Theme;
    if (!localTheme && theme === 'system') {
      // console.log('no local theme and on initial load');
      document.documentElement.className = sysTheme;
    } else if (!localTheme) {
      // console.log('theme set', theme, sysTheme, localTheme);
      document.documentElement.className = theme;
    } else {
      // console.log('last');
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mb-5" asChild>
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
