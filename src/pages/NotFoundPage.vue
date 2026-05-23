<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-base">
    <div class="max-w-md">
      <h1
        class="font-display text-[120px] font-extrabold text-gold leading-none tracking-widest mb-4"
        style="text-shadow: 0 0 40px rgba(160, 124, 40, 0.3)"
      >
        404
      </h1>

      <h2 class="font-display text-2xl font-bold text-primary tracking-wide mb-3">Page Not Found</h2>

      <p class="text-sm text-muted mb-8 font-body leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <router-link
        to="/"
        class="inline-flex items-center gap-2 text-[14px] font-semibold text-base bg-gold px-6 py-3 rounded-xl hover:bg-[#f0c85a] hover:shadow-gold-sm hover:-translate-y-px transition-all duration-200"
      >
        Return to Home
      </router-link>
    </div>
  </div>
</template>
