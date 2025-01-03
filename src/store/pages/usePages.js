import { defineStore } from "pinia"

export const usePagesStore = defineStore('Pages', {
  state: () => ({
    isShowAlert: false,
    alertData: {
      type: 'success', // success || info || warning || error,
      message: 'Todo created successfully!',
    },
    tabs: {
      'index': {
        path: '/',
        name: 'Home',
      },
    },
    currentTab: 'index',
  }),
  actions: {
    showAlert(params) {
      this.isShowAlert = true
      if (params) this.alertData = params
    },
    setTabsState(item) {
      this.tabs[item.to.name] = {
        path: item.to.name === 'index' ? '/' : !item.to.name.startsWith('/') ? `/`+item.to.name : item.to.name,
        name: item.title,
      }
      this.currentTab = item.to.name

      localStorage.setItem('last-tab', JSON.stringify(this.tabs[this.currentTab]))
    },
    deleteTab(key) {
      delete this.tabs[key]
    },
  },
})
