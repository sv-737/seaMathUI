import type { parsePayload } from 'nuxt/dist/app/composables/payload';
<template>
  <v-dialog
    width="500"
    :model-value="value"
    @update:model-value="$emit('update:modelValue', false)"
  >
    <v-card :title="dialogTitle">
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
          :text="btnCaption"
          @click="onSave"
        />
      </v-card-actions>
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
    teacherChatId: props.student.teacherChatId ?? 588704466,
    studentChatId: props.student.studentChatId ?? 0,
    priceForLesson: props.student.priceForLesson,
    studentName: props.student.studentName,
    status: props.student.status,
    description: props.student.description,
    studentNikName: props.student.studentNikName,
    canStudentCancelLesson: props.student.canStudentCancelLesson,
    canStudentPostponeLesson: props.student.canStudentPostponeLesson,
  })

  async function onSave() {
    try {
      const url = `http://94.241.141.121:80/api/student${
        isNew.value ? '' : '/' + props.student.id
      }`

      const { result } = await $fetch(url, {
        method: isNew.value ? 'POST' : 'PUT',
        headers: {
          Authorization: 'Bearer token',
        },
        body: payload,
      })

      console.log('result :>> ', result)
      emit('changed')
    } catch (e) {
      console.error(e)
    }
  }
</script>
