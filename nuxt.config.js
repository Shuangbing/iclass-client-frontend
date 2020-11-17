export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  env: {
    baseUrl: process.env.API_URL || 'http://localhost:3000'
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'iClass.buzz',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'ant-design-vue/dist/antd.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/axios'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
  ],
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.API_URL || 'http://localhost:3000',
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    vendor: [
      'socket.io-client'
    ]
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'notFound',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  }
}
