import { logger } from "@/logger";

/**
 * Перечисление для ключей переменных окружения
 */
export enum EnvKey {
    ApiKey = "VITE_DADATA_KEY",
    ApiUrl = "VITE_DADATA_API"
}

/**
 * Получает значение переменной окружения по ключу из DadataEnvKey
 *
 * @param key ключ из перечисления
 * @throws Error если переменная не установлена
 * @returns строка с значением переменной окружения
 */
export function getEnvValue(key: EnvKey): string | number | boolean {
    const value = import.meta.env[key];
    if (!value) {
        logger.error(`Environment variable "${key}" is not set`);
        throw new Error(`ENV variable "${key}" is not set`);
    }
    return value;
}
