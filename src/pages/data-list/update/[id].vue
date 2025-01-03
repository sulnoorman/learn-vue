<script setup>
import { showAlert } from '@/helpers'
import { useTodoListStore } from '@/store/todolist/useTodoList'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const router = useRouter()
const store = useTodoListStore()

watchEffect(() => {
  const payload = {
    token: '632411e20581750298f3078c',
    project: 'todolist_redux',
    collection: 'todolist',
    appid: '6344f77599b6c11c094bd4cf',
    id: props.id,
  }

  store.fetchDetailTodo(payload, 'edit')
})

function handleClose(param = 0) {
  if (param == 0) {
    store.detail[props.id].notes = ''
  } else {
    var payload = new URLSearchParams()
    payload.append('token', '632411e20581750298f3078c')
    payload.append('project', 'todolist_redux')
    payload.append('collection', 'todolist')
    payload.append('appid', '6344f77599b6c11c094bd4cf')
    payload.append('id', props.id)
    payload.append('update_field', 'notes~create_date~create_time')
    payload.append('update_value', `${store.detail[props.id].notes}~${store.detail[props.id].create_date}~${store.detail[props.id].create_time}`)

    store.updateTodo(payload)
      .then(data => {
        store.detail.notes = ''
        if(Array.isArray(data)) {
          router.push('/data-list')
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
</script>

<template>
  <div>
    <VCard>
      <VCardText class="text-center">
        Update Todo
      </VCardText>    

      <VDivider />  

      <VCardText v-if="store.loading">
        Loading...
      </VCardText>
      <VCardText v-if="!store.loading && store.error">
        {{ store.errorMsg }}
      </VCardText>
      <VCardText v-if="!store.loading && !store.error && store.detail[props.id]">
        <VTextField
          v-model="store.detail[props.id].notes"
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
          Cancel
        </VBtn>
        <VBtn
          :disabled="store.loading || store.detail[props.id]?.notes === ''"
          @click="handleClose(1)"
        >
          Update
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>
