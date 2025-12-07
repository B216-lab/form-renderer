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
      ottSentTitle: 'Code sent',
      ottSentDescription:
        'The code has been sent to {email}. Check your inbox and enter the code.',
      ottCountdown: 'Code expires in {time}',
      ottExpired: 'The code has expired.',
      passwordsMismatchTitle: 'Check password',
      passwordsMismatchDescription: 'Passwords do not match.',
      errorTitle: 'Error',
      sendCode: 'Send code',
      sendAgain: 'Send again',
      login: 'Log in',
      register: 'Register',
      consentLabel: 'I agree with the',
      consentLink: 'email address usage terms',
      consentError:
        'You must accept the personal data usage terms to continue.',
    },
    consent: {
      title: 'Personal data and cookies consent',
      intro:
        'This page explains how we use your email address and cookies when you use this questionnaire.',
      emailTitle: 'Email address usage',
      emailText:
        'We use your email address to identify you, send one-time login codes, and communicate about access to this questionnaire. Your email will not be shared with third parties except as required by law.',
      cookiesTitle: 'Cookies usage',
      cookiesText:
        'We use technical cookies to keep you signed in and to remember your basic preferences. These cookies are not used for advertising or tracking across other sites.',
      back: 'Back to login',
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
      ottSentTitle: 'Код отправлен',
      ottSentDescription:
        'Код отправлен на {email}. Проверьте почту и введите код.',
      ottCountdown: 'Код истечёт через {time}',
      ottExpired: 'Срок действия кода истёк.',
      passwordsMismatchTitle: 'Проверьте пароль',
      passwordsMismatchDescription: 'Пароли не совпадают.',
      errorTitle: 'Ошибка',
      sendCode: 'Отправить код',
      sendAgain: 'Отправить снова',
      login: 'Войти',
      register: 'Зарегистрироваться',
      consentLabel: 'Я соглашаюсь с',
      consentLink: 'условиями использования персональных данных',
      consentError:
        'Вы должны принять условия использования персональных данных, чтобы продолжить.',
    },
    consent: {
      title: 'Согласие на обработку персональных данных и использование cookie',
      intro:
        'На этой странице описано, как мы используем ваш e-mail адрес и файлы cookie при работе с этой анкетой.',
      emailTitle: 'Использование e-mail адреса',
      emailText:
        'Мы используем ваш e-mail для идентификации, отправки одноразовых кодов входа и связи по вопросам доступа к анкете. Ваш e-mail не передаётся третьим лицам, за исключением случаев, предусмотренных законом.',
      cookiesTitle: 'Использование файлов cookie',
      cookiesText:
        'Мы используем технические cookie, чтобы поддерживать вашу сессию и запоминать базовые настройки. Эти cookie не используются для рекламы или отслеживания на других сайтах.',
      back: 'Назад ко входу',
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
