<script setup>
  import { Calendar } from '@fullcalendar/core'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import timeGridPlugin from '@fullcalendar/timegrid'

  const isDialog = ref(false)
  const currentLesson = ref({})
  const calendarRef = ref(null)
  let calendar = null

  const { data: schedule, refresh } = useMdfetch('/lessons/schedule', {
    lazy: true,
    transform: (res) => {
      return res.result.map((i) => ({
        id: i.id,
        title: i.description,
        daysOfWeek: [i.weekDay],
        startTime: i.lessonStartTime,
        extendedProps: {
          student: i.student,
        },
      }))
    },
    default: () => ({
      result: [],
    }),
  })

  // TODO:  add a check for schedule changes
  watch(schedule, (newSchedule) => {
    // Work with source events ->
    // const source = calendar.getEventSourceById(1)
    // if (source) source.remove()
    // calendar.addEventSource({
    //   id: 1,
    //   events: newSchedule,
    // })

    calendar.setOption('events', newSchedule)
  })

  const { data: businessHours } = useMdfetch('/working-hours', {
    lazy: true,
    transform: (res) => {
      return res.result.map((i) => ({
        daysOfWeek: [i.weekDay],
        startTime: i.startTime,
        endTime: i.endTime,
      }))
    },
    default: () => [],
  })

  watch(businessHours, (data) => {
    calendar.setOption('businessHours', data)
  })

  function onChangeLesson(student) {
    currentLesson.value = student
    isDialog.value = true
  }

  onMounted(() => {
    if (!calendarRef.value) return

    calendar = new Calendar(calendarRef.value, {
      locale: 'ru',
      plugins: [dayGridPlugin, timeGridPlugin],
      // initialView: 'dayGridWeek',
      initialView: 'timeGridWeek',
      slotDuration: '00:15',
      firstDay: 1,
      allDaySlot: false,
    })

    calendar.render()
  })

  onBeforeUnmount(() => {
    if (!calendarRef.value) return
    calendar.destroy()
  })

  function onUpdate() {
    isDialog.value = false
    refresh()
  }
</script>

<template>
  <div>
    <div>
      <v-btn @click="onChangeLesson">Создать урок</v-btn>
    </div>

    <div id="calendar" ref="calendarRef"></div>

    <schedule-create-update-dialog
      v-if="isDialog"
      v-model="isDialog"
      :lesson="currentLesson"
      @changed="onUpdate"
    />
  </div>
</template>
