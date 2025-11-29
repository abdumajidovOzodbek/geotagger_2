import { MapPin, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/hooks/use-language';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8 mx-auto max-w-screen-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight" data-testid="text-app-title">
              {t('appTitle')}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t('appSubtitle')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={(val: any) => setLanguage(val)} data-testid="select-language">
            <SelectTrigger className="w-[160px]">
              <span className="text-xl">
                {language === 'en' && '🇺🇸'}
                {language === 'uz' && '🇺🇿'}
                {language === 'ru' && '🇷🇺'}
              </span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en"><span className="text-lg">🇺🇸</span> {t('english')}</SelectItem>
              <SelectItem value="uz"><span className="text-lg">🇺🇿</span> {t('uzbek')}</SelectItem>
              <SelectItem value="ru"><span className="text-lg">🇷🇺</span> {t('russian')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            data-testid="button-theme-toggle"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
