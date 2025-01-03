/* stylelint-disable liberty/use-logical-spec */
<script setup>
import navItems from '@/navigation/vertical'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { useRouter } from 'vue-router'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'

// Helpers
import { deleteTab, findMatchedPages, resolveTabViewEveryReload } from '@/helpers/index'

// Pages Store
import { usePagesStore } from '@/store/pages/usePages'

// Customizer Component
import TheCustomizer from '@/@core/components/TheCustomizer.vue'

// App Pages
import pagesList from '@/helpers/pages-list.json'

const route = useRoute()
const router = useRouter()
const pagesStore =  usePagesStore()
const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig()
const { width: windowWidth } = useWindowSize()

const lastTab = JSON.parse(localStorage.getItem('last-tab'))
const matchPages = findMatchedPages(pagesList, route)

resolveTabViewEveryReload(route, lastTab, matchPages)

function handleDeleteTab(key) {
  // using helper to help delete content depends on its key
  deleteTab(key, router)
}
</script>

<template>
  <VerticalNavLayout
    :nav-items="navItems"
  >
    <!-- SnackBar (for the whole pages) -->
    <VSnackbar
      v-model="pagesStore.isShowAlert"
      location="bottom end"
      :color="pagesStore.alertData.type"
      width="700"
      absolute
      transition="scroll-x-reverse-transition"
    >
      {{ pagesStore.alertData.message }}
      <template #actions>
        <VBtn
          variant="text"
          @click="pagesStore.isShowAlert = false"
        >
          <VIcon
            color="white"
            icon="tabler-x"
          />
        </VBtn>
      </template>
    </VSnackbar>

    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <VBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          icon
          variant="text"
          color="default"
          class="ms-n3"
          size="small"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            icon="tabler-menu-2"
            size="24"
          />
        </VBtn>

        <NavbarThemeSwitcher />

        <VSpacer />

        <UserProfile />
      </div>
    </template>

    <VTabs
      v-model="pagesStore.currentTab"
      hide-slider
      class="tabs-wrapper"
    >
      <VTab
        v-for="(item, key) in pagesStore.tabs"
        :key="key"
        tag="div"
        :value="key"
        :to="item.path"
        hide-slider
        class="tab-item"
        selected-class="active"
      >
        {{ item.name }}

        <VIcon
          v-if="key !== 'index'"
          class="ms-2"
          size="17"
          icon="tabler-x"
          color="black"
          @click.stop.prevent="handleDeleteTab(key)"
        />
      </VTab>
    </VTabs>

    <!-- 👉 Pages -->
    
    <RouterView v-slot="{ Component }">
      <Transition
        :name="appRouteTransition"
        mode="out-in"
      >
        <Component :is="Component" />
      </Transition>
    </RouterView> 
   
    
    <!--
      <VWindow v-model="pagesStore.currentTab">
      <VWindowItem
      v-for="(item, key) in pagesStore.tabs"
      :key="key"
      :value="key"
      :transition="false"
      >
      <RouterView v-if="key === pagesStore.currentTab" />
      </VWindowItem>
      </VWindow>  
    -->
   

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <TheCustomizer />
  </VerticalNavLayout>
</template>

<style scoped>
.active {
  background: white !important;
  color: black !important;
}
</style>
