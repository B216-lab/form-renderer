import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import type { DaDataAddress, DaDataSuggestion } from 'react-dadata';
import { getEnvValue, EnvKey } from '@/utils';

const API_KEY = getEnvValue(EnvKey.ApiKey);
const API_URL = getEnvValue(EnvKey.ApiUrl);

export const apiDaDataInstance = axios.create({
  baseURL: API_URL as string,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: ('Token ' + API_KEY) as string,
  },
});

export const createDaDataInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  try {
    const mergedConfig = {
      ...config,
      ...options,
    };
    const response: AxiosResponse = await apiDaDataInstance(mergedConfig);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = 'Dadata Request failed';
      console.error('[DaDataAPI] Request error', {
        message,
        status: error.response?.status,
        url: error.config?.url,
      });
      throw new AxiosError(
        message,
        error.response?.status.toString(),
        error.config,
        error.request,
        error.response
      );
    }
    throw error;
  }
};

interface IDaDataSuggestionsAddressResponse {
  suggestions: DaDataSuggestion<DaDataAddress>[] | undefined;
}

export const fetchDaDataSuggestionsAddress = (
  signal: AbortSignal,
  params: { query: string }
): Promise<IDaDataSuggestionsAddressResponse> => {
  return createDaDataInstance({
    method: 'GET',
    signal,
    params,
  });
};
