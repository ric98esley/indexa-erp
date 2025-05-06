import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'

export async function useApi<T>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
  const authStore = useAuthStore()
  const defaults: UseFetchOptions<T> = {
    baseURL: useRuntimeConfig().public.apiUrl,
    key: url,
    headers: authStore.getToken
      ? { Authorization: `Bearer ${authStore.getToken}` }
      : {},
    onResponse: async ({ response, options: options2 }) => {
      if (response.status === 401) {
        try {
          const data = await useRefreshToken();

          authStore.setAuthState(data)

          options2.headers = { Authorization: `Bearer ${authStore.getToken}` };

          const params = defu(options2, options);

          useFetch(url, params as UseFetchOptions<T>);
        } catch (error: any) {
          const { $errorHandler } = useNuxtApp();
          if( error.statusCode === 401) {
            authStore.reset();
            navigateTo('/login');
          }
          $errorHandler(error);
        }
      }
    },
  };

  const params = defu(options, defaults);

  return useFetch(url, params);
}