import { MapPin, Moon, Sun, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/hooks/use-language';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48 border rounded-lg" data-testid="select-language">
              <div className="flex items-center gap-2">
                {language === 'en' && <span className="fi fi-us w-5 h-5" />}
                {language === 'uz' && <span className="fi fi-uz w-5 h-5" />}
                {language === 'ru' && <span className="fi fi-ru w-5 h-5" />}
                <span className="font-medium">
                  {language === 'en' && 'US English'}
                  {language === 'uz' && 'UZ Uzbek'}
                  {language === 'ru' && 'RU Russian'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en" data-testid="option-lang-en">
                <div className="flex items-center gap-2">
                  <span className="fi fi-us w-5 h-5" />
                  <span>US English</span>
                </div>
              </SelectItem>
              <SelectItem value="uz" data-testid="option-lang-uz">
                <div className="flex items-center gap-2">
                  <span className="fi fi-uz w-5 h-5" />
                  <span>UZ Uzbek</span>
                </div>
              </SelectItem>
              <SelectItem value="ru" data-testid="option-lang-ru">
                <div className="flex items-center gap-2">
                  <span className="fi fi-ru w-5 h-5" />
                  <span>RU Russian</span>
                </div>
              </SelectItem>
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
