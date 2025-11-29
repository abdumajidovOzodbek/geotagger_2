import { MapPin, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/hooks/use-language';
import 'flag-icons/css/flag-icons.min.css';

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
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('en')}
            data-testid="button-lang-en"
            className="h-10 px-2"
            title="English"
          >
            <span className="fi fi-us w-6 h-6" />
          </Button>
          <Button
            variant={language === 'uz' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('uz')}
            data-testid="button-lang-uz"
            className="h-10 px-2"
            title="Uzbek"
          >
            <span className="fi fi-uz w-6 h-6" />
          </Button>
          <Button
            variant={language === 'ru' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('ru')}
            data-testid="button-lang-ru"
            className="h-10 px-2"
            title="Russian"
          >
            <span className="fi fi-ru w-6 h-6" />
          </Button>
          
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
