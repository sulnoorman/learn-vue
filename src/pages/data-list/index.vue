<script setup>
import { usePagesStore } from '@/store/pages/usePages'
import { useTodoListStore } from '@/store/todolist/useTodoList'
import DialogDelete from '@/views/pages/todolist/DialogDelete.vue'

const router = useRouter()
const pagesStore = usePagesStore()
const todoListStore = useTodoListStore()

watchEffect(() => {
  const isTabExists = pagesStore.tabs.hasOwnProperty('data-list')

  if (isTabExists && todoListStore.list.length < 1) {    
    const payload = {
      token: '632411e20581750298f3078c',
      project: 'todolist_redux',
      collection: 'todolist',
      appid: '6344f77599b6c11c094bd4cf',
    }

    todoListStore.fetchTodos(payload)
  }
})

function handleNavigate(url, title) {
  const params = {
    title: title,
    to: { name: url.replace('/', '') },
  }

  pagesStore.setTabsState(params)
  router.push(url)
}
</script> 


<template>
  <div>
    <VCard>
      <VCardText class="d-flex justify-space-between align-center">
        <div style="width: 10px;" />
        <p class="m-0 text-h6 font-weight-medium">
          Todo List
        </p>
        <!-- <DialogAdd /> -->
        <VBtn @click="handleNavigate('/data-list/add-todo', 'Add Todo')">
          Add Todo
        </VBtn>
      </VCardText>

      <VDivider />
      
      <VCardText>
        <VTable class="text-no-wrap invoice-list-table">
          <thead class="text-uppercase">
            <tr>
              <th
                scope="col"
                style="width: 25%;"
              >
                #ID
              </th>
              <th
                scope="col"
                style="width: 40%;"
              >
                Todo
              </th>
              <th
                scope="col"
                style="width: 25%;"
              >
                Create date & time
              </th>
              <th
                scope="col"
                class="text-center"
                style="width: 10%;"
              >
                Action
              </th>
            </tr>
          </thead>
  
          <tbody v-if="!todoListStore.loading && todoListStore.list.length > 0">
            <tr
              v-for="todo in todoListStore.list"
              :key="todo._id"
              style="height: 3.75rem;"
            >
              <td
                style="width: 25%; cursor: pointer; text-decoration: underline;"
                @click="handleNavigate(`/data-list/${todo._id}`, 'Detail Todo')"
              >
                {{ todo._id }}
              </td>
              <td style="width: 40%;">
                {{ todo.notes }}
              </td>
              <td style="width: 25%;">
                {{ todo.create_time }}, {{ todo.create_date }}
              </td>
              <td style="width: 10%;">
                <div class="d-flex align-cente justify-center gap-3">
                  <!-- <DialogUpdate :id="todo._id" />  -->
                  <DialogDelete :id="todo._id" />
                  <VIcon
                    icon="tabler-pencil"
                    size="24"
                    class="cursor-pointer"
                    @click="handleNavigate(`/data-list/update/${todo._id}`, 'Update Todo')"
                  />
                </div>
              </td>
            </tr>  
          </tbody> 
        </VTable>
        <div
          v-if="todoListStore.loading"
          class="text-center"
        >
          <p>Loading</p>
        </div>
        <div
          v-if="!todoListStore.loading && todoListStore.list.length < 1"
          class="text-center"
        >
          <p>Tidak Ada Data</p>
        </div> 
      </VCardText>
    </VCard>
  </div>
</template>
