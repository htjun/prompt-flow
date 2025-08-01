import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import path from 'node:path'

export default defineConfig({
  build: {
    outDir: 'dist/preload',
    lib: {
      entry: path.resolve(__dirname, 'src/preload.ts'),
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [...builtinModules],
    },
    emptyOutDir: true,
  },
})
