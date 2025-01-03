<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import { showAlert } from '@/helpers'
import { useTodoListStore } from '@/store/todolist/useTodoList'

const dataProps = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const store = useTodoListStore()

const isDialogVisible = ref(false)

function handleClose(param = 0) {
  if (param == 0) {
    store.detail.notes = ''
    isDialogVisible.value = false
  } else {
    var payload = new URLSearchParams()
    payload.append('token', '632411e20581750298f3078c')
    payload.append('project', 'todolist_redux')
    payload.append('collection', 'todolist')
    payload.append('appid', '6344f77599b6c11c094bd4cf')
    payload.append('id', dataProps.id)
    payload.append('update_field', 'notes~create_date~create_time')
    payload.append('update_value', `${store.detail[dataProps.id].notes}~${store.detail[dataProps.id].create_date}~${store.detail[dataProps.id].create_time}`)

    store.updateTodo(payload)
      .then(data => {
        store.detail.notes = ''
        if(Array.isArray(data)) {
          isDialogVisible.value = false
        
          showAlert({ type: 'info', message: 'Todo has been updated successfully!' })

          const payload = {
            token: '632411e20581750298f3078c',
            project: 'todolist_redux',
            collection: 'todolist',
            appid: '6344f77599b6c11c094bd4cf',
          }

          store.fetchTodos(payload)
        } else if(data.status === 'Failed') showAlert({ type: 'error', message: `Failed update data with message: ${data.message}` })
      })
      .catch(error => {
        showAlert({ type: 'error', message: `Failed update data with message: ${error}` })
      })
  }
}

function handleClickIcon() {
  const payload = {
    token: '632411e20581750298f3078c',
    project: 'todolist_redux',
    collection: 'todolist',
    appid: '6344f77599b6c11c094bd4cf',
    id: dataProps.id,
  }

  store.fetchDetailTodo(payload, 'edit')
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="600"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VIcon
        v-bind="props"
        icon="tabler-pencil"
        size="24"
        class="cursor-pointer"
        @click.prevent="handleClickIcon"
      />
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleClose(0)" />

    <!-- Dialog Content -->
    <VCard title="Update Todo">
      <VCardText v-if="store.loading">
        Loading...
      </VCardText>
      <VCardText v-if="!store.loading && store.error">
        {{ store.errorMsg }}
      </VCardText>
      <VCardText v-if="!store.loading && !store.error && store.detail[dataProps.id]">
        <VTextField
          v-model="store.detail[dataProps.id].notes"
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
          :disabled="store.loading || store.detail[dataProps.id]?.notes === ''"
          @click="handleClose(1)"
        >
          Save
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
