import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        symbolId: 'icon-[dir]-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

    server: {
        host: 'localhost',
        port: 5173,
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:8090",
                changeOrigin: true, //  用于控制请求头中的host值
                rewrite: (path) => path.replace("/api", ''),
            },

        }
    },
})

/*function resolve(dir) {
    return path.join(__dirname, dir)
}*/
