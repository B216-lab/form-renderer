import { createI18n } from 'vue-i18n';

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

  const browser = window.navigator.language?.toLowerCase() ?? 'en';
  if (browser.startsWith('ru')) {
    return 'ru';
  }

  return 'en';
};

export const messages = {
  en: {
    app: {
      title: 'B216 | Questionnaire',
      description: 'B216 questionnaire web form.',
      logout: 'Logout',
      cookieTitle: 'Cookies',
      cookieDescription:
        'This site uses cookies to identify your session. By continuing, you agree to our use of cookies.',
      cookieClose: 'Got it',
    },
    auth: {
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      confirmPassword: 'Repeat password',
      confirmPasswordPlaceholder: 'Repeat password',
      ottLabel: 'Code from email',
      ottPlaceholder: 'Paste or type the code',
      ottSentTitle: 'Code sent',
      ottSentDescription:
        'The code has been sent to {email}. Check your inbox and enter the code.',
      passwordsMismatchTitle: 'Check password',
      passwordsMismatchDescription: 'Passwords do not match.',
      errorTitle: 'Error',
      sendCode: 'Send code',
      login: 'Log in',
      register: 'Register',
      consentLabel: 'I agree with the',
      consentLink: 'email address usage terms',
      consentError:
        'You must accept the personal data usage terms to continue.',
    },
  },
  ru: {
    app: {
      title: 'Б216 | Анкета',
      description: 'Веб-форма анкеты Б216.',
      logout: 'Выйти',
      cookieTitle: 'Файлы cookie',
      cookieDescription:
        'Этот сайт использует файлы cookie для идентификации вашей сессии. Продолжая, вы соглашаетесь с использованием файлов cookie.',
      cookieClose: 'Понятно',
    },
    auth: {
      password: 'Пароль',
      passwordPlaceholder: 'Введите пароль',
      confirmPassword: 'Повторите пароль',
      confirmPasswordPlaceholder: 'Повторите пароль',
      ottLabel: 'Код из письма',
      ottPlaceholder: 'Вставьте или введите код',
      ottSentTitle: 'Код отправлен',
      ottSentDescription:
        'Код отправлен на {email}. Проверьте почту и введите код.',
      passwordsMismatchTitle: 'Проверьте пароль',
      passwordsMismatchDescription: 'Пароли не совпадают.',
      errorTitle: 'Ошибка',
      sendCode: 'Отправить код',
      login: 'Войти',
      register: 'Зарегистрироваться',
      consentLabel: 'Я соглашаюсь с',
      consentLink: 'условиями использования персональных данных',
      consentError:
        'Вы должны принять условия использования персональных данных, чтобы продолжить.',
    },
  },
} satisfies Record<AppLocale, Record<string, unknown>>;

export const createI18nInstance = () =>
  createI18n({
    legacy: false,
    locale: detectInitialLocale(),
    fallbackLocale: 'en',
    messages,
  });
