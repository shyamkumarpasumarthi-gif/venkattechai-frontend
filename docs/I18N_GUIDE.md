/**
 * I18n (Internationalization) Guide
 */

# VenkatAI Studio - Internationalization Guide

Complete guide to adding and managing translations.

## Supported Languages

- **en**: English
- **de**: Deutsch (German)
- **ka**: ქართული (Georgian)

## File Structure

```
messages/
├── en.json         # English translations (base language)
├── de.json         # German translations
└── ka.json         # Georgian translations
```

## Adding New Translations

### Step 1: Update Translation Files

Each file follows this structure:

```json
{
  "section": {
    "key": "Translation text",
    "another_key": "Another translation"
  }
}
```

### Step 2: Register Language in Configuration

Update `lib/constants.ts`:

```typescript
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
  // Add new language here
];
```

### Step 3: Create Translation File

Create `messages/[locale].json`:

```json
{
  "nav": {
    "dashboard": "Translated text"
  },
  "auth": {
    "login": "Translated text"
  }
}
```

## Using Translations in Components

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations();
  
  return <h1>{t('page.title')}</h1>;
}
```

### Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations();
  
  return <button>{t('common.submit')}</button>;
}
```

## Key Naming Convention

```
section.subsection.key

Examples:
- nav.dashboard
- auth.login
- dashboard.welcome
- common.loading
```

## Translation Key Categories

### Navigation (`nav.*`)
```json
"nav": {
  "dashboard": "Dashboard",
  "studio": "AI Studio",
  "jobs": "Jobs"
}
```

### Authentication (`auth.*`)
```json
"auth": {
  "login": "Login",
  "register": "Register",
  "logout": "Logout"
}
```

### Sections (`dashboard.*`, `studio.*`, etc)
```json
"dashboard": {
  "welcome": "Welcome to VenkatAI",
  "stats": "Statistics"
}
```

### Common (`common.*`)
```json
"common": {
  "loading": "Loading...",
  "error": "Error",
  "success": "Success"
}
```

## Translation Guidelines

### Do's ✅

- Use consistent terminology
- Key names should be lowercase
- Use underscores for multi-word keys
- Keep translations concise
- Test in all languages
- Update all languages when adding keys

### Don'ts ❌

- Don't hardcode strings in components
- Don't use uppercase in keys
- Don't use spaces in key names
- Don't mix languages in one file
- Don't commit incomplete translations

## Pluralization

For plural forms, use separate keys:

```json
{
  "jobs_one": "1 job",
  "jobs_many": "{count} jobs"
}
```

Use in component:

```typescript
t('jobs', { count: jobCount })
```

## Numbers and Dates

### Number Formatting

```typescript
const t = useTranslations();
const locale = useLocale();

new Intl.NumberFormat(locale).format(1234.56)
// en: 1,234.56
// de: 1.234,56
```

### Date Formatting

```typescript
new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(new Date())
// en: March 16, 2024
// de: 16. März 2024
```

## Locale-Specific Formatting

```typescript
import { useLocale } from 'next-intl';

export function FormattedNumber({ value }: { value: number }) {
  const locale = useLocale();
  
  return new Intl.NumberFormat(locale).format(value);
}
```

## Adding New Language

### Step 1: Create Translation File

Create `messages/fr.json`:

```json
{
  "nav": {
    "dashboard": "Tableau de bord",
    "studio": "Studio IA"
  }
  // ... add all keys
}
```

### Step 2: Update Routing

Ensure Next.js includes new locale in routing:
```typescript
// next.config.js
export const SUPPORTED_LOCALES = ['en', 'de', 'ka', 'fr'];
```

### Step 3: Update Constants

Add to `lib/constants.ts`:
```typescript
export const SUPPORTED_LANGUAGES = [
  // ... existing
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];
```

## Testing Translations

### Check Missing Keys

```bash
# In development, missing keys show as [key.path]
# Check console for warnings
```

### Test All Languages

1. Visit `localhost:3000/en/dashboard`
2. Visit `localhost:3000/de/dashboard`
3. Visit `localhost:3000/ka/dashboard`
4. Verify all text displays correctly

### Validate JSON

```bash
npm run lint
# Checks for JSON syntax errors
```

## Translation Workflow

1. **Developer adds new feature with i18n keys**
   ```typescript
   const t = useTranslations();
   return <h1>{t('newFeature.title')}</h1>;
   ```

2. **Add key to base language** (`en.json`)
   ```json
   "newFeature": {
     "title": "New Feature Title"
   }
   ```

3. **Update all other languages**
   - Add same keys with translated text
   - Keep key structure identical
   - Test in each language

4. **Deploy with all languages**
   - Ensure all languages complete
   - Deploy atomically
   - Monitor for missing translations

## Performance Tips

- Translations are loaded per-locale
- No extra bundle size for unused languages
- Static generation per locale
- CDN caching by locale

## Resources

- Next-intl Docs: https://next-intl-docs.vercel.app/
- CLDR Data: https://cldr.unicode.org/
- Translation Tools: https://www.crowdin.com/

## Support

For translation help or new language requests:
- GitHub Issues: https://github.com/venkattech/venkatai-studio/issues
- Discussions: https://github.com/venkattech/venkatai-studio/discussions
