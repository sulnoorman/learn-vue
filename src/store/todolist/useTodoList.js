import { api } from '@/store/todolist/api'
import { defineStore } from 'pinia'

export const useTodoListStore = defineStore('TodoList', {
  state: () => ({
    list: [],
    detail: {},
    loading: false,
    error: false,
    errorMsg: null,
  }),
  actions: {
    fetchTodos(params) {
      this.loading = true
      api.getListTodos(params)
        .then(response => {
          setTimeout(() => {
            this.loading = false
          }, 1000)
          this.list = response.data
        })
        .catch(error => {
          if (error?.name !== 'CanceledError' || error?.name !== 'AbortError') {
            this.error = false
            this.errorMsg = error
            setTimeout(() => {
              this.loading = false
            }, 1000)
          }
        })
    },
    fetchDetailTodo(params, from = '') {
      if (from !== 'edit') this.loading = true
      api.getDetailTodos(params)
        .then(response => {
          this.detail[params.id] = response.data[0]
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }).catch(error => {
          this.error = true
          this.errorMsg = error
          setTimeout(() => {
            this.loading = false
          }, 1000)
        })
    },
    async addTodo(params) {
      try {
        this.loading = true

        const response = await api.addTodo(params) 

        if (response.status == 200) {
          setTimeout(() => {
            this.loading = false
          }, 1000)
          
          return response.json()
        }
        else {
          this.loading = false
          this.error = true

          return response.json()
        }
      } catch (error) {
        this.loading = false
        this.error = true
        
        return error
      }
    },
    async updateTodo(params) {
      try {
        this.loading = true

        const response = await api.updateTodo(params)

        if (response.status == 200) {
          setTimeout(() => {
            this.loading = false
          }, 1000)
          
          return [await response.json()]
        } else {
          this.loading = false
          this.error = true
          
          return response.json()
        }
      } catch (error) {
        this.loading = false
        this.error = true
        
        return error
      }
    },
    async deleteTodo(params) {
      try {
        const response = await api.deleteTodo(params)

        if (response.status == 200) return response
        else {
          return {
            message: response.data.message,
            status: response.data.status,
          }
        }
      } catch (error) {
        return error
      }
    },
  },
})
