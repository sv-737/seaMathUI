<template>
  <div class="pa-5">
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="text-h5">Ученики</div>
      <v-btn color="primary" :loading="pending" @click="onChange({})">
        Создать ученика
      </v-btn>
    </div>

    <v-data-table :headers="headers" :items="data.result" :loading="pending">
      <template #item.actions="{ item }">
        <v-btn color="primary" variant="tonal" @click="onChange(item)">
          Редактировать
        </v-btn>
        <v-btn color="red" variant="tonal" @click="onDelete(item.id)">
          Удалить
        </v-btn>
      </template>
    </v-data-table>

    <students-create-update-dialog
      v-if="isDialog"
      v-model="isDialog"
      :student="currentStudent"
      @changed="onUpdate"
    />
    <!-- <pre>{{ data }}</pre> -->
  </div>
</template>

<script setup>
  const currentStudent = ref({})

  function onChange(student) {
    currentStudent.value = student
    isDialog.value = true
  }

  const isDialog = ref(false)

  const headers = [
    { title: 'Имя', key: 'studentName' },
    { title: 'Nickname', key: 'studentNikName' },
    { title: 'Цена за урок', key: 'priceForLesson' },
    { title: 'Описание', key: 'description', sortable: false },
    {
      title: 'Отмена уроков',
      key: 'canStudentCancelLesson',
      sortable: false,
    },
    {
      title: 'Перенос уроков',
      key: 'canStudentPostponeLesson',
      sortable: false,
    },
    {
      key: 'actions',
      sortable: false,
    },
  ]

  const { data, pending, refresh } = useFetch(
    'http://seamath.online/api/students',
    {
      headers: {
        Authorization: 'Bearer token',
      },
      params: {
        userName: 'victor_sergienko',
      },
      lazy: true,
    }
  )

  async function onUpdate() {
    await refresh()
    isDialog.value = false
  }

  async function onDelete(id) {
    try {
      await $fetch(`http://94.241.141.121:80/api/student/${id}`, {
        method: 'DELETE',
      })

      await refresh()
    } catch (e) {
      console.error(e)
    }
  }
</script>
