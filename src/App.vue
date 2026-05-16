<template>
  <div class="min-h-screen flex flex-col bg-base text-white relative">
    <NavBar v-if="route.meta.layout === 'default'" />

    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="currentRoute.path" />
        </transition>
      </router-view>
    </main>

    <Footer v-if="route.meta.layout === 'default'" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import NavBar from '@/components/ui/NavBar.vue'
import Footer from '@/components/ui/Footer.vue'

const route = useRoute()
</script>
