<script setup>
  import { useAuth } from '~/composables/useAuth'

  definePageMeta({
    layout: 'empty',
  })

  const { login } = useAuth()
  const router = useRouter()
  const nickname = ref('evgendeveloper')
  const isLoadedSpline = ref(false)
  const isActivateStep = ref(false)
  const isError = ref(false)
  const errorText = ref('')
  const session = useCookie('session')
  const previewSession = ref(null)
  const timeoutCron = 2 * 60 * 1000
  let cronCheckActiveState
  let timeoutClearCron

  async function onLogin() {
    try {
      const { token, active } = await login({ login: nickname.value })

      previewSession.value = token.split('-').shift()
      session.value = token
      isActivateStep.value = true

      cronCheckActiveState = setInterval(checkActiveState, 2000)
      timeoutClearCron = setTimeout(clearCron, timeoutCron)

      console.log('r :>> ', active)
    } catch (e) {
      console.error(e)
      if (e.response) {
        if (e.response.status === 404) {
          errorText.value = 'Пользователь не найден'
          isError.value = true
        }
      }
    }
  }

  async function checkActiveState() {
    try {
      const res = await $mdfetch('/auth/state', {
        method: 'POST',
        body: {
          token: session.value,
        },
      })

      if (res) {
        clearCron()
        router.replace('/lc/students')
      }
    } catch (e) {
      console.error(e)
    }
  }

  function clearCron() {
    if (cronCheckActiveState) clearInterval(cronCheckActiveState)
    if (timeoutClearCron) clearTimeout(timeoutClearCron)
  }

  function onLoad() {
    isLoadedSpline.value = true
  }
</script>

<template>
  <div class="d-md-flex fill-height flex-grow-1">
    <div class="sidebar">
      <v-sheet class="fill-height" rounded="xl" elevation="6" color="white">
        <div class="d-flex flex-column justify-space-between fill-height">
          <div class="text-h6 font-weight-bold">sea.math.teacher</div>

          <div class="d-flex flex-column ga-16">
            <div class="text-h4 font-weight-bold">Привет 🥳</div>

            <v-alert
              v-model="isError"
              type="error"
              variant="tonal"
              closable
              :text="errorText"
            />

            <div>
              <div v-if="!isActivateStep">
                <v-form
                  class="d-flex flex-column ga-6"
                  @submit.prevent="onLogin"
                >
                  <v-text-field
                    v-model="nickname"
                    label="Имя пользователя telegram"
                    hide-details="auto"
                  />
                  <v-btn
                    block
                    type="submit"
                    class="text-none py-6 mt-6"
                    variant="flat"
                    size="large"
                  >
                    Войти
                  </v-btn>
                  <div class="text-center text-body-2 text-blue-grey-lighten-2">
                    Нажимая кнопку Вы соглашаетесь
                    <br />
                    с политикой конфиденциальности
                  </div>
                </v-form>
              </div>

              <div v-if="isActivateStep">
                <div>
                  <div class="text-body-1 font-weight-bold">
                    Подтвердите личность в Telegram боте
                  </div>
                  <div class="text-body-2 text-blue-grey-lighten-2 mt-2">
                    Сессия:
                    <v-chip color="primary" size="small">
                      {{ previewSession }}
                    </v-chip>
                  </div>
                </div>

                <div class="text-center d-flex flex-column ga-6 mt-8">
                  <v-btn
                    block
                    href="tg://resolve?domain=seaMathTeacherDev_bot"
                    class="text-none py-6"
                    variant="flat"
                    size="large"
                  >
                    Перейти в Telegram бот
                  </v-btn>
                  <div class="text-body-2 text-blue-grey-lighten-2">
                    или отсканируйте QR-code
                  </div>
                  <div class="d-flex justify-center align-center">
                    <v-img src="/qr.png" max-width="200px" />
                  </div>
                  <v-btn
                    class="text-none"
                    variant="text"
                    size="large"
                    @click="isActivateStep = false"
                  >
                    Назад
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <div class="text-body-1 text-blue-grey-lighten-2">
            &copy; {{ new Date().getFullYear() }}
          </div>
        </div>
      </v-sheet>
    </div>
    <div class="flex-grow-1 d-flex align-center justify-center">
      <div class="spline">
        <iframe
          v-show="isLoadedSpline"
          src="https://my.spline.design/chips-babbf669bf7cc5f3a2b8eb871b0fadcb/"
          frameborder="0"
          @load="onLoad"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .sidebar {
    width: 100%;
    max-width: 580px;
    padding: 40px;

    & > div {
      padding: 80px;
    }
  }

  .spline {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32vh;
    width: 38vw;

    iframe {
      width: 50vw;
      height: 42vh;
    }
  }
</style>
