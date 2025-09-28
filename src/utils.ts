export const devlog = (message: any) => {
  if (import.meta.env.VITE_ENV === "development") {
    console.log(message);
  }
};

/**
 * Перечисление для ключей переменных окружения, связанных с Dadata
 */
export enum EnvKey {
    ApiKey = "VITE_DADATA_KEY",
    ApiUrl = "VITE_DADATA_API"
}

/**
 * Получает значение переменной окружения по ключу из DadataEnvKey
 *
 * :param key: ключ из перечисления DadataEnvKey
 * :raises: Error если переменная не установлена
 * :return: строка с значением переменной окружения
 */
export function getEnvValue(key: EnvKey): string {
    const value = import.meta.env[key];
    if (!value) {
        devlog(`ENV variable "${key}" is not set`);
        throw new Error(`ENV variable "${key}" is not set`);
    }
    return value;
}
