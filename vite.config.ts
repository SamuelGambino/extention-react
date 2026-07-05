import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { crx } from '@crxjs/vite-plugin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// 1. Определяем, для какого браузера сборка (по умолчанию chrome)
const targetBrowser = process.env.VITE_BROWSER || 'chrome'

// 2. Функция для сборки манифеста "на лету"
const getManifest = () => {
  const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
  const manifestPath = resolve(__dirname, `manifest.${targetBrowser}.json`)
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  
  // Синхронизируем версию из package.json напрямую в объект манифеста
  manifest.version = pkg.version
  
  return manifest
}

// Получаем готовый манифест для CRXJS
const finalManifest = getManifest()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: finalManifest }), // Передаем динамический манифест
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    // 3. Раскладываем сборки в разные папки dist/chrome и dist/firefox
    outDir: resolve(__dirname, `dist/${targetBrowser}`),
    emptyOutDir: true
  }
})