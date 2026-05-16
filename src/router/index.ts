import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import AuthLayout from '@/components/layouts/AuthLayout.vue'

import HomePage from '@/pages/HomePage.vue'
import BrowsePage from '@/pages/BrowsePage.vue'
import MovieDetailsPage from '@/pages/MovieDetailsPage.vue'
import CartPage from '@/pages/CartPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignupPage from '@/pages/SignupPage.vue'
import VerifyPage from '@/pages/VerifyPage.vue'
import UserProfilePage from '@/pages/UserProfilePage.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomePage, meta: { layout: 'default' } },
      { path: 'browse', name: 'browse', component: BrowsePage, meta: { layout: 'default' } },
      { path: 'movie/:id', name: 'movie', component: MovieDetailsPage, meta: { layout: 'default' } },
      { path: 'cart', name: 'cart', component: CartPage, meta: { layout: 'default' } },
      { path: 'profile', name: 'profile', component: UserProfilePage, meta: { requiresAuth: true, layout: 'default' } },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'login', component: LoginPage, meta: { layout: 'auth' } },
      { path: 'signup', name: 'signup', component: SignupPage, meta: { layout: 'auth' } },
      { path: 'verify', name: 'verify', component: VerifyPage, meta: { layout: 'auth' } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  // const auth = useAuthStore()
  // if (to.meta.requiresAuth && !auth.isLoggedIn) {
  //   return { name: 'login' }
  // }
})

export default router
