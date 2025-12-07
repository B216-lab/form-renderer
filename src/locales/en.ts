export default {
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
  forms: {
    errors: {
      defaultTitle: 'Submission error',
      defaultMessage: 'An error occurred while submitting the form.',
      networkTitle: 'Network error',
      networkMessage:
        'Failed to connect to the server. Please check your internet connection.',
      serverTitle: 'Server error',
      invalidData: 'Invalid form data. Please check the filled fields.',
      sessionExpired: 'Session expired. Please log in again.',
      insufficientPermissions:
        'Insufficient permissions to perform the operation.',
      serverUnavailable: 'Server unavailable or endpoint not found.',
      internalError: 'Internal server error. Please try again later.',
    },
  },
} as const;

