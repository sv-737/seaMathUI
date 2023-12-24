<script setup>
  const headers = [
    { title: 'День недели', key: 'weekDay', sortable: false },
    { title: 'Начало', key: 'startTime', sortable: false },
    { title: 'Окончание', key: 'endTime', sortable: false },
    { title: 'Выходной', key: 'dayOff', sortable: false },
  ]

  const { data: workingHours, pending } = useMdfetch('/working-hours', {
    lazy: true,
    // transform: (res) => {
    //   return res.result.map((i) => ({
    //     id: i.id,
    //     title: i.description,
    //     daysOfWeek: [i.weekDay],
    //     startTime: i.lessonStartTime,
    //     extendedProps: {
    //       student: i.student,
    //     },
    //   }))
    // },
    default: () => ({
      result: [],
    }),
  })

  function onChange() {}

  function onChangeDayOff(event, item) {
    workingHours.value.result.find(({ id }) => id === item.id).dayOff = event
  }
</script>

<template>
  <div class="pa-5">
    <div class="d-flex align-center justify-space-between mb-5">
      <div class="text-h5">Рабочие часы</div>
    </div>

    <v-data-table
      v-if="workingHours?.result"
      :headers="headers"
      :items="workingHours.result"
      :loading="pending"
    >
      <template #item.dayOff="{ value, item }">
        <v-switch
          :model-value="value"
          color="primary"
          inset
          hide-details
          @update:model-value="onChangeDayOff($event, item)"
        />
      </template>
    </v-data-table>
  </div>
</template>
