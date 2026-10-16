import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { crx } from '@crxjs/vite-plugin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const targetBrowser = process.env.VITE_BROWSER || 'chrome'

const getManifest = () => {
  const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
  const manifestPath = resolve(__dirname, `manifest.${targetBrowser}.json`)
  
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  
  manifest.version = pkg.version
  
  return manifest
}

const finalManifest = getManifest()

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: finalManifest }), 
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    outDir: resolve(__dirname, `dist/${targetBrowser}`),
    emptyOutDir: true
  }
})