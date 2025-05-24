import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      }
    }
  },
  devServer: {
    port: 5000
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  typescript: {
    strict: true,
    shim: true,
  },
  vite: {
    server: {
      hmr: {
        // protocol: 'ws',
        // port: 5000,
        // clientPort: 5000,
        // path: '/__vite_ping',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/element.scss" as el;',
        },
      },
    },
  },
  css: [
    "reset-css",
    "~/assets/styles/main.scss",
    "element-plus/dist/index.css",
    "swiper/swiper-bundle.css",
  ],
  modules: [
    "@element-plus/nuxt",
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    'nuxt-viewport',
  ],
  runtimeConfig: {
    public: {
      // Axios
      apiBase: process.env.API_BASE_URL || 'https://api.vtb.family/api',
      serverBase: process.env.API_SERVER_URL || 'https://api.vtb.family',
    },
  },
  elementPlus: {
    importStyle: 'scss',
  },
  googleFonts: {
    families: {
      Raleway: {
        wght: '100..900',
      }
    },
    subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'],
    overwriting: true,
    outputDir: 'assets',
    stylePath: 'styles/fonts.css'
  },
  viewport: {
    breakpoints: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1280,
    },
    defaultBreakpoints: {
      desktop: 'lg',
      mobile: 'xs',
      tablet: 'md',
    },
    fallbackBreakpoint: 'lg'
  },
  build: {
    analyze: true, // Включить анализ размера бандла
  },
  nitro: {
    serveStatic: true,
    experimental: {
      websocket: true
    }
  },

});
