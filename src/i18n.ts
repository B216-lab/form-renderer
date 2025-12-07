import { createI18n } from 'vue-i18n';
import en from './locales/en';
import ru from './locales/ru';

export const SUPPORTED_LOCALES = ['en', 'ru'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

const isAppLocale = (value: string | null): value is AppLocale =>
  SUPPORTED_LOCALES.includes(value as AppLocale);

const detectInitialLocale = (): AppLocale => {
  if (typeof window === 'undefined') {
    return 'ru';
  }

  const stored = window.localStorage.getItem('locale');
  if (stored && isAppLocale(stored)) {
    return stored;
  }

  // По умолчанию используем русский язык
  return 'ru';
};

export const messages = {
  en,
  ru,
} satisfies Record<AppLocale, Record<string, unknown>>;

export const createI18nInstance = () =>
  createI18n({
    legacy: false,
    locale: detectInitialLocale(),
    fallbackLocale: 'ru',
    messages,
  });
