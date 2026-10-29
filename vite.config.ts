import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // lightningcss 壓縮 KaTeX 樣式時會報錯，改用 esbuild
    cssMinify: 'esbuild',
  },
})
