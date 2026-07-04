import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Плагин для копирования версии
const syncVersionWithManifest = () => {
  return {
    name: 'sync-version-with-manifest',
    buildStart() {
      const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
      const manifestPath = resolve(__dirname, 'manifest.json'); // или где лежит ваш исходный manifest.json
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      
      manifest.version = pkg.version;
      
      // Перезаписываем манифест с новой версией перед сборкой
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    babel({ presets: [reactCompilerPreset()] }),
    syncVersionWithManifest()
  ],
})