/**
 * Language Switcher Component
 * Switch between supported languages
 */

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en';
  const currentLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLocale);

  const switchLanguage = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        <span className="hidden md:inline">{currentLanguage?.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-secondary-200 bg-white shadow-lg"
            role="listbox"
            aria-label="Language selection"
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-secondary-50 ${
                  language.code === currentLocale ? 'bg-primary-50 text-primary-700' : 'text-secondary-700'
                }`}
                role="option"
                aria-selected={language.code === currentLocale}
              >
                <span>{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {language.code === currentLocale && (
                  <span className="ml-auto text-primary-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export { LanguageSwitcher };