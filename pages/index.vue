<script setup lang="ts">
  const route = useRoute()
  const nickname = ref('evgendeveloper')

  async function onLogin() {
    try {
      const { token, active } = await $mdfetch('/auth/signin', {
        method: 'POST',
        body: {
          login: nickname.value,
        },
      })

      const session = useCookie('session')
      session.value = token

      console.log('r :>> ', active)
      console.log('r :>> ', token)
    } catch (e) {
      console.error(e)
    }
  }
</script>

<template>
  <div>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <v-text-field v-model="nickname" />
    <v-btn @click="onLogin">Login</v-btn>
  </div>
</template>
