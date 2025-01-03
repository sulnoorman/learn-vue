<script setup>
import { usePagesStore } from '@/store/pages/usePages'
import { useTodoListStore } from '@/store/todolist/useTodoList'
import { watchEffect } from 'vue'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const router = useRouter()
const store = useTodoListStore()
const pagesStore = usePagesStore()

watchEffect(() => {
  const isTabExists = pagesStore.tabs.hasOwnProperty(`data-list/${props.id}`)

  if(isTabExists && !store.detail[props.id]) {
    const payload = {
      token: '632411e20581750298f3078c',
      project: 'todolist_redux',
      collection: 'todolist',
      appid: '6344f77599b6c11c094bd4cf',
      id: props.id,
    }

    store.fetchDetailTodo(payload)
  }
})

function handleBack() {
  router.go(-1)
}
</script>

<template>
  <div>
    <VCard>
      <VCardText class="d-flex gap-5 pb-0">
        <VIcon
          icon="tabler-arrow-left"
          size="24"
          class="cursor-pointer"
          @click="handleBack"
        />
        <p>Detail Page</p>
      </VCardText>    

      <VDivider />  

      <VCardText
        v-if="store.loading"
        class="text-center"
      >
        fetching data...
      </VCardText>

      <VCardText v-if="store.error">
        {{ store.errorMsg }}
      </VCardText>

      <VCardText v-if="!store.loading && !store.error && store.detail[props.id]">
        <VRow dense>
          <VCol
            cols="12"
            md="4"
            xs="5"
          >
            <div class="d-flex justify-space-between">
              <p>Todo Name</p>
              <span>:</span>
            </div>
          </VCol>
          <VCol
            cols="12"
            md="8"
            xs="7"
          >
            {{ store.detail[props.id].notes }}
          </VCol>
          <VCol
            cols="12"
            md="4"
            xs="5"
          >
            <div class="d-flex justify-space-between">
              <p>Created Date</p>
              <span>:</span>
            </div>
          </VCol>
          <VCol
            cols="12"
            md="8"
            xs="5"
          >
            {{ store.detail[props.id].create_date }}
          </VCol>
        </VRow>
      </VCardText>
    </vcard>
  </div>
</template>
