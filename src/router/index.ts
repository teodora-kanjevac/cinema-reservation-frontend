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
import { authService } from '@/services/authService'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage.vue'
import AdminManagementPage from '@/pages/AdminManagementPage.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomePage, meta: { layout: 'default' } },
      { path: 'browse', name: 'browse', component: BrowsePage, meta: { layout: 'default' } },
      { path: 'movie/:id', name: 'movie', component: MovieDetailsPage, meta: { layout: 'default' } },
      { path: 'cart', name: 'cart', component: CartPage, meta: { requiresAuth: true, layout: 'default' } },
      { path: 'profile', name: 'profile', component: UserProfilePage, meta: { requiresAuth: true, layout: 'default' } },
      { path: 'admin', name: 'admin', component: AdminManagementPage, meta: { requiresAuth: true, layout: 'default' } },
      {
        path: 'checkout/success',
        name: 'checkout',
        component: CheckoutSuccessPage,
        meta: { requiresAuth: true, requiresCheckoutFlag: true, layout: 'default' },
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'login', component: LoginPage, meta: { requiresGuest: true, layout: 'auth' } },
      { path: 'signup', name: 'signup', component: SignupPage, meta: { requiresGuest: true, layout: 'auth' } },
      {
        path: 'verify',
        name: 'verify',
        component: VerifyPage,
        meta: { requiresGuest: true, requiresPendingEmail: true, layout: 'auth' },
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
]

let isCheckoutAllowed = false

export function changeCheckoutAccess(flag: boolean) {
  isCheckoutAllowed = flag
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const isAuthenticated = authService.isAuthenticated()
  const hasPendingEmail = !!localStorage.getItem('pendingEmail')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return { name: 'home' }
  }

  if (to.meta.requiresPendingEmail && !hasPendingEmail) {
    return { name: 'signup' }
  }

  if (to.meta.requiresCheckoutFlag) {
    if (!isCheckoutAllowed) {
      return { name: 'home' }
    }
  }
})

export default router
