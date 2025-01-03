<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import { showAlert } from '@/helpers/index'
import { useTodoListStore } from '@/store/todolist/useTodoList'

const store = useTodoListStore()

const todo = ref('')
const isDialogVisible = ref(false)

function getCurrentTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  return `${hours}:${minutes}`
}

function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

function handleClose(param = 0) {
  if (param == 0) {
    todo.value = ''
    isDialogVisible.value = false
  }
  else {
    var payload = new URLSearchParams()

    payload.append('token', '632411e20581750298f3078c')
    payload.append('project', 'todolist_redux')
    payload.append('collection', 'todolist')
    payload.append('appid', '6344f77599b6c11c094bd4cf')
    payload.append('notes', todo.value)
    payload.append('create_date', getCurrentDate())
    payload.append('create_time', getCurrentTime())

    store.addTodo(payload)
      .then(data => {
        todo.value = ''
        if (Array.isArray(data)) {
          isDialogVisible.value = false
          showAlert({ type: 'success', message: 'Todo has been created successfully!' })

          const payload = {
            token: '632411e20581750298f3078c',
            project: 'todolist_redux',
            collection: 'todolist',
            appid: '6344f77599b6c11c094bd4cf',
          }
          
          store.fetchTodos(payload)
        } else if (data.status === 'Failed') showAlert({ type: 'error', message: `Failed Create Todo: ${data.message}` })
      })
      .catch(error => {
        showAlert({ type: 'error', message:`Failed add data with message: ${error}` })
      })
  }
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="600"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props">
        Add Todo
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleClose(0)" />

    <!-- Dialog Content -->
    <VCard title="Add Todo">
      <VCardText>
        <VTextField
          v-model="todo"
          density="comfortable"
          label="Insert Todo"
        />
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="handleClose(0)"
        >
          Close
        </VBtn>
        <VBtn
          :disabled="store.loading || todo === ''"
          @click="handleClose(1)"
        >
          Save
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
