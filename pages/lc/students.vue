<template>
  <div class="pa-5">
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="text-h5">Ученики</div>
      <v-btn color="primary" :loading="pending" @click="onChange({})">
        Создать ученика
      </v-btn>
    </div>

    <v-data-table
      v-if="data?.result"
      :headers="headers"
      :items="data.result"
      :loading="pending"
    >
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

  const { data, pending, refresh } = useMdfetch('/students', {
    params: {
      // userName: 'victor_sergienko',
    },
    lazy: true,
  })

  const { data: user } = useMdfetch('/user')

  console.log('user :>> ', user)

  async function onUpdate() {
    await refresh()
    isDialog.value = false
  }

  async function onDelete(id) {
    try {
      await $mdfetch(`/api/student/${id}`, {
        method: 'DELETE',
      })

      await refresh()
    } catch (e) {
      console.error(e)
    }
  }
</script>
