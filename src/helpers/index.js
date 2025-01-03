import { usePagesStore } from "@/store/pages/usePages"
import { useTodoListStore } from "@/store/todolist/useTodoList"

const pagesStore = usePagesStore()
const todoStore = useTodoListStore()

const store = {
  'data-list': todoStore,
  'pages': pagesStore,
}

export const log = params => {
  console.log(params)
}

export const say = params => {
  alert(params)
}

export const showAlert = params => {
  pagesStore.showAlert(params)
}

export const deleteTab = (key, router) => {
  let keyBefore
  let keyAfter
  const keys = Object.keys(pagesStore.tabs)
  const index = keys.indexOf(key)

  if (index !== -1) {
    keyBefore = keys.slice(0, index)
    keyAfter = keys.slice(index + 1)
  }
  if (key === 'data-list') {
    log('hapus store list -> key = data-list')
    store[key].list = []
  }
  if (key.includes('data-list/') && !key.includes('/update') && !key.includes('/add-todo')) {
    const id = key.split('/')[1]

    log(`hapus store detail -> key = data-list/:id`)

    delete store['data-list'].detail[id]
  }
  if (key.includes('data-list/') && key.includes('/update')) {
    const id = key.split('/')[2]

    log(`hapus store detail -> key = data-list/update/:id`)

    delete store["data-list"]?.detail[id]
  }
  if (key === pagesStore.currentTab && keyAfter.length != 0) {
    const path = pagesStore.tabs[keyAfter[0]].path
    
    log(`key = currentTab & keyAfter ada. Mengambil path key sesudah (${path}) dan navigasi ke path key sesudah`)

    pagesStore.currentTab = keyAfter[0]
    router.push(path)
  }
  if (key === pagesStore.currentTab && keyAfter.length == 0) {
    const path = pagesStore.tabs[keyBefore[keyBefore.length - 1]].path
    
    log(`key = currentTab & keyAfter tidak ada. Mengambil path key sebelum (${path}) dan navigasi ke path key sebelum`)

    pagesStore.currentTab = keyBefore[keyBefore.length - 1]
    router.push(path)
  }
  pagesStore.deleteTab(key)
}
 
export const resolveTabViewEveryReload = (route, lastTab, matchPages) => {
  if (route.path !== '/' && lastTab.path === route.path) {

    console.log('path terakhir sama dengan path sekarang', lastTab)
  
    const params = {
      title: lastTab.name,
      to: { name: route.path.replace('/', '') },
    }
  
    store['pages'].setTabsState(params)
  }
  
  if (!lastTab || route.path !== lastTab.path) {
    console.log('path terakhir tidak sama dengan path sekarang')
    console.log('path route sama dengan pages:', matchPages)
  
    const params = {
      title: matchPages.name,
      to: { name: matchPages.path.replace('/', '') },
    }
  
    if (route.path !== '/') store['pages'].setTabsState(params)
  }
}

export const findMatchedPages = (pagesList, route) => {
  for (let page of pagesList) {
    const routePath = page.path.replace(/:\w+/g, '\\w+')
    const regex = new RegExp(`^${routePath}$`)

    if (route.path.match(regex)) {
      return page
    }
  }

  return null
}
