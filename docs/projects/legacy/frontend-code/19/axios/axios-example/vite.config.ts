import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  // proxy
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        // rewrite: (path: string) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // 打印请求和响应信息
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('请求地址:', `${options.target}${req.url}`);
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('响应状态:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
