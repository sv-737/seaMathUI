export type LoginCredentials = {
  login: string
}

export const useUser = () => {
  return useState('user', () => null)
}

export const useAuth = () => {
  const user = useUser()
  const session = useCookie('session')

  async function login(credentials: LoginCredentials) {
    const { token, active } = await $mdfetch('/auth/signin', {
      method: 'POST',
      body: credentials,
    })

    session.value = token

    return { token, active }
  }

  async function activateSession(token: string) {
    try {
      const isOk = await $mdfetch('/auth/state', {
        method: 'POST',
        body: { token },
      })

      if (isOk) await refreshUser()

      return isOk
    } catch (error: any) {
      console.error(error)
      return false
    }
  }

  async function refreshUser() {
    try {
      user.value = await fetchCurrentUser()
    } catch (error) {
      user.value = null
    }
  }

  return {
    login,
    activateSession,
    refreshUser,
  }
}

export const fetchCurrentUser = async () => {
  try {
    const { result } = await $mdfetch('/user')
    return result
  } catch (error: any) {
    console.error(error)
    if ([401, 419].includes(error?.response?.status)) return null
    throw error
  }
}
