import type { UseFetchOptions } from 'nuxt/app'
const session = useCookie('session')

export function useMdfetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  return useFetch(url, {
    $fetch: $mdfetch,
    onResponseError({ response }) {
      const status = response.status
      if ([500].includes(status)) {
        console.error('[API Error]', response.statusText, response._data)
      }

      if ([401, 419].includes(status)) {
        session.value = null
        navigateTo('/lc/login', { replace: true })
      }

      if ([409].includes(status)) {
        navigateTo('/verify-email')
      }
    },
    ...options,
  })
}
