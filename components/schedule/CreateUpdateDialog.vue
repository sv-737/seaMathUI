import type { parsePayload } from 'nuxt/dist/app/composables/payload';
<template>
  <v-dialog
    width="500"
    :model-value="value"
    @update:model-value="$emit('update:modelValue', false)"
  >
    <v-card :title="dialogTitle">
      <v-form @submit.prevent="onSave">
        <v-card-text>
          <v-combobox
            v-model="payload.studentId"
            :items="students"
            :loading="pending"
            :return-object="false"
            label="Ученик"
          />
          <v-select
            v-model="payload.weekDay"
            :items="daysOfWeek"
            label="День недели"
          />
          <v-text-field
            v-model="payload.lessonStartTime"
            label="Начало урока"
            readonly
          >
            <v-menu activator="parent">
              <v-card>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-list :selected="selectedHour">
                        <v-list-subheader title="Часы" />
                        <v-list-item
                          v-for="hh in hours"
                          :key="`hh-${hh}`"
                          :value="hh"
                          @click="onChangeStartTimeLesson({ hh })"
                        >
                          <v-list-item-title>{{ hh }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col>
                      <v-list :selected="selectedMinute">
                        <v-list-subheader title="Минуты" />
                        <v-list-item
                          v-for="mm in minutes"
                          :key="`mm-${mm}`"
                          :value="mm"
                          @click="onChangeStartTimeLesson({ mm })"
                        >
                          <v-list-item-title>{{ mm }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-menu>
          </v-text-field>
          <v-textarea v-model="payload.description" label="Описание" />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="deep-purple-lighten-2"
            variant="text"
            type="submit"
            :text="btnCaption"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
  const emit = defineEmits(['update:modelValue', 'changed'])
  const props = defineProps({
    value: {
      type: Boolean,
      default: false,
    },
    lesson: {
      type: Object,
      default: () => ({}),
    },
  })

  const isNew = computed(() => !props.lesson.id)
  const btnCaption = computed(() => (isNew.value ? 'Создать' : 'Сохранить'))

  const daysOfWeek = [
    { title: 'Понедельник', value: 1 },
    { title: 'Вторник', value: 2 },
    { title: 'Среда', value: 3 },
    { title: 'Четверг', value: 4 },
    { title: 'Пятница', value: 5 },
    { title: 'Суббота', value: 6 },
    { title: 'Воскресенье', value: 7 },
  ]

  const dialogTitle = computed(() =>
    isNew.value ? 'Новый урок' : `Редактирование урока ${props.lesson.id}`
  )

  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = String(i)
    return h.length < 2 ? `0${h}` : h
  })

  const selectedHour = computed(() => [payload.lessonStartTime.split(':')[0]])

  const minutes = ['00', '15', '30']

  const selectedMinute = computed(() => [payload.lessonStartTime.split(':')[1]])

  const { data: students, pending } = useMdfetch('/students', {
    transform: (res) => {
      return res.result.map((i) => ({
        value: i.id,
        title: i.studentName,
      }))
    },
    default: () => [],
    lazy: true,
  })

  const payload = reactive({
    // id ??
    // teacherChatId ??
    // groupId: 0, // ??
    studentId: null,
    weekDay: 1,
    lessonStartTime: '12:00',
    status: 1, // ??
    description: '',
  })

  function onChangeStartTimeLesson({ hh = null, mm = null }) {
    const currentTime = payload.lessonStartTime.split(':')
    payload.lessonStartTime = `${hh ?? currentTime[0]}:${mm ?? currentTime[1]}`
  }

  async function onSave() {
    try {
      const url = `/lessons/schedule${isNew.value ? '' : '/' + props.lesson.id}`

      const { result } = await $mdfetch(url, {
        method: isNew.value ? 'POST' : 'PUT',
        body: payload,
      })

      console.log('result :>> ', result)
      emit('changed')
    } catch (e) {
      console.error(e)
    }
  }
</script>
