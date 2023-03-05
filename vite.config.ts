import { defineConfig } from 'vite'
import * as Path from 'path'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react-swc'
export default defineConfig(({mode}) => {
  return {
    base: '/',
    root: `./example/${mode}`,
    plugins: [react(), vue()],
    server: {
      port: 9000
    },
    resolve: {
      alias: {
        '@happyPlayer': Path.resolve(__dirname, './src/index.ts')
      }
    }
  }
})
