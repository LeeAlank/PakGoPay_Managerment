import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from 'path'
import {resolve} from "node:dns";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        symbolId: 'icon-[dir]-[name]'
    }),
    /*viteCompression({
        verbose:true,//控制台输出压缩结果
        disable:false,//开启还是禁用
        threshold:1024,//体积大于threshold的设置压缩
        algorithm:'gzip',//压缩算法
        ext:'gz',//文件后缀名
    })*/
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

    server: {
        host: '0.0.0.0',
        port: 5173,
        url: '/web/login',
        open: true,
        proxy: {
            "/api": {
                target: "http://0.0.0.0:8090",
                changeOrigin: true, //  用于控制请求头中的host值
                rewrite: (path) => path.replace("/api", ''),
            },

        }
    },
    build: {
        assetsDir: "assets",
        rollupOptions: {
            output: {
                manualChunks: {
                    'vue': ['vue'], // 代码分割：将Vue单独打包
                },
                /*chunkFileNames: 'js/[name]-[hash].js', // 代码分割后的 chunk 文件命名
                entryFileNames: 'js/[name]-[hash].js', // 入口文件命名
                assetFileNames: '[ext]/[name]-[hash].[ext]',*/
                /*input: {
                    main: resolve(__dirname, 'index.html'),
                    about: resolve(__dirname, 'about/index.html'), // 多页面应用
                },*/
            },
        },
    },
})

/*function resolve(dir) {
    return path.join(__dirname, dir)
}*/
