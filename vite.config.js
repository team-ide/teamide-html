import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const { resolve } = require("path")

import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "service": resolve(__dirname, "src/service"),
      "type": resolve(__dirname, "src/type"),
      "util": resolve(__dirname, "src/util"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 21081,
    https: false,
    proxy: {
      "/api": {
        ws: true,
        target: "http://127.0.0.1:21080/teamide/",
        changeOrigin: true
      },
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    })
  ]
})
