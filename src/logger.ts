/**
 * Простой логгер с уровнями логирования, настраиваемыми через переменную окружения VITE_LOG_LEVEL
 *
 * Поддерживаемые уровни: 'none' | 'error' | 'warn' | 'info' | 'debug' | 'verbose'
 * Значение по умолчанию: 'debug' в режиме разработки, 'warn' в продакшене
 */

type LogLevelName = 'none' | 'error' | 'warn' | 'info' | 'debug' | 'verbose'

enum LogLevel {
  None = 0,
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4,
  Verbose = 5,
}

function mapLevel(name: string | undefined): LogLevel {
  switch ((name || '').toLowerCase()) {
    case 'none':
      return LogLevel.None
    case 'error':
      return LogLevel.Error
    case 'warn':
      return LogLevel.Warn
    case 'info':
      return LogLevel.Info
    case 'debug':
      return LogLevel.Debug
    case 'verbose':
      return LogLevel.Verbose
    default:
      return import.meta.env.DEV ? LogLevel.Debug : LogLevel.Warn
  }
}

let currentLevel: LogLevel = mapLevel(import.meta.env.VITE_LOG_LEVEL as string | undefined)

function isEnabled(level: LogLevel): boolean {
  return currentLevel >= level
}

export const logger = {
  /**
   * Установить уровень логирования во время выполнения
   */
  setLevel(level: LogLevelName) {
    currentLevel = mapLevel(level)
  },

  /**
   * Получить текущий уровень логирования
   */
  getLevel(): LogLevelName {
    switch (currentLevel) {
      case LogLevel.None:
        return 'none'
      case LogLevel.Error:
        return 'error'
      case LogLevel.Warn:
        return 'warn'
      case LogLevel.Info:
        return 'info'
      case LogLevel.Debug:
        return 'debug'
      case LogLevel.Verbose:
        return 'verbose'
      default:
        return 'warn'
    }
  },

  error(...args: unknown[]) {
    if (isEnabled(LogLevel.Error)) console.error(...args)
  },
  warn(...args: unknown[]) {
    if (isEnabled(LogLevel.Warn)) console.warn(...args)
  },
  info(...args: unknown[]) {
    if (isEnabled(LogLevel.Info)) console.info(...args)
  },
  debug(...args: unknown[]) {
    if (isEnabled(LogLevel.Debug)) console.debug(...args)
  },
  verbose(...args: unknown[]) {
    if (isEnabled(LogLevel.Verbose)) console.log(...args)
  },
}


