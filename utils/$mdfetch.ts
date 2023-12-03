import { $fetch } from 'ofetch'

export const $mdfetch = $fetch.create({
  // credentials: 'include',

  onRequest({ options }) {
    const token = useCookie('session').value
    const { apiUrl } = useRuntimeConfig().public
    // const event = process.nitro ? useEvent() : null
    const headers: any = {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    }

    options.headers = headers
    options.baseURL = apiUrl
  },

  onResponseError({ response }) {
    const status = response.status
    if ([500].includes(status)) {
      console.error('[Error]', response.statusText, response._data)
    }
    if ([401, 419].includes(status)) {
      useCookie('session').value = null
      navigateTo('/lc/login', { replace: true })
    }
  },
})
