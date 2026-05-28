import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(router)

const CinemaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdf8ec',
      100: '#fbeed0',
      200: '#f6d99e',
      300: '#f0bf67',
      400: '#e8b84b',
      500: '#e8b84b',
      600: '#d79532',
      700: '#b37123',
      800: '#8f521b',
      900: '#744016',
      950: '#432109',
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: CinemaPreset,
  },
})
app.use(ToastService)

app.mount('#app')
