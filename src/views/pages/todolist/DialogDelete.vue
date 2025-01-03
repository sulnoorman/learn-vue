<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import { showAlert } from '@/helpers'
import { useTodoListStore } from '@/store/todolist/useTodoList'

const propsData = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const store = useTodoListStore()

const isDialogVisible = ref(false)

function handleCloseDialog(param) {
  if (param == 0) isDialogVisible.value = false
  else {
    const payload = {
      id: propsData.id,
      collection: 'todolist',
      project: 'todolist_redux',
      token: '632411e20581750298f3078c',
      appid: '6344f77599b6c11c094bd4cf',
    }

    store.deleteTodo(payload)
      .then(data => {
        if (data.status == 200) {
          isDialogVisible.value = false
          showAlert({ type: 'error', message: 'Todo has been deleted successfully!' })

          const newPayload = { ...payload }

          delete newPayload['id']

          store.fetchTodos(newPayload)
        } else if (data.status === 'Failed') showAlert({ type: 'error', message: `Failed delete data with message: ${data.message}` })
      })
      .catch(error => {
        showAlert({ type: 'error', message: `Failed delete data with message: ${error}` })
      })
  }
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VIcon
        v-bind="props"
        icon="tabler-trash"
        size="24"
        color="#ff2825"
        class="cursor-pointer"
      /> 
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="handleCloseDialog(0)" />

    <!-- Dialog Content -->
    <VCard title="Delete Data?">
      <VCardText>
        Do you want to continue delete data with id {{ propsData.id }}?
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          color="secondary"
          variant="tonal"
          @click="handleCloseDialog(0)"
        >
          Cancel 
        </VBtn>
        <VBtn
          color="error"
          @click="handleCloseDialog(1)"
        >
          Delete
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
