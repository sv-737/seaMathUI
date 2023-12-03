export default defineNuxtRouteMiddleware((to) => {
  const paths = to.path.split('/')
  if (!paths.includes('lc') || paths.includes('login')) return

  const session = useCookie('session')
  if (!session.value) return navigateTo('/lc/login', { replace: true })
})
