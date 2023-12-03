export type LoginCredentials = {
  login: string
}

export const useUser = () => {
  return useState('user', () => undefined)
}

export const useAuth = () => {
  async function login(credentials: LoginCredentials) {
    const { token, active } = await $mdfetch('/auth/signin', {
      method: 'POST',
      body: credentials,
    })

    return { token, active }
  }

  return {
    login,
  }
}
