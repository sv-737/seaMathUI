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
          <v-text-field v-model="payload.studentName" label="Имя ученика" />
          <v-text-field
            v-model="payload.studentNikName"
            label="Nickname ученика"
          />
          <v-text-field v-model="payload.priceForLesson" label="Цена за урок" />
          <v-switch
            v-model="payload.canStudentCancelLesson"
            color="primary"
            label="Отмена уроков"
          />
          <v-switch
            v-model="payload.canStudentPostponeLesson"
            color="primary"
            label="Перенос уроков"
          />
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
    student: {
      type: Object,
      default: () => ({}),
    },
  })

  const isNew = computed(() => !props.student.id)
  const btnCaption = computed(() => (isNew.value ? 'Создать' : 'Сохранить'))
  const dialogTitle = computed(() =>
    isNew.value
      ? 'Новый ученик'
      : `Редактирование ученика ${props.student.studentName}`
  )

  const payload = reactive({
    teacherChatId: props.student.teacherChatId ?? 119535917,
    studentChatId: props.student.studentChatId ?? 0,
    priceForLesson: props.student.priceForLesson ?? '',
    studentName: props.student.studentName ?? '',
    status: props.student.status ?? 1,
    description: props.student.description ?? '',
    studentNikName: props.student.studentNikName ?? '',
    canStudentCancelLesson: props.student.canStudentCancelLesson ?? false,
    canStudentPostponeLesson: props.student.canStudentPostponeLesson ?? false,
  })

  async function onSave() {
    try {
      const url = `/student${isNew.value ? '' : '/' + props.student.id}`

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
