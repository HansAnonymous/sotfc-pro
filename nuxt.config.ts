// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      ADMIN_PASS: process.env.ADMIN_PASS
    }
  },
  modules: [
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],
  primevue: {
    /* Options */
    options: {
      unstyled: false,
      ripple: true,
      inputStyle: 'filled'
    }
  },
  css: [
    'primevue/resources/themes/lara-dark-green/theme.css',
    'primeicons/primeicons.css',
    'assets/styles.css'
  ],
  supabase: {
    redirect: false
  }
})
