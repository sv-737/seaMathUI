import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: 'http://seamath.online/api/v1/',
    },
  },
  imports: {
    dirs: ['./utils'],
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@formkit/auto-animate/nuxt',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
