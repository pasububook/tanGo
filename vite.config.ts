import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
    // fastRefreshオプションは新しいバージョンでは不要
  ],
  // ビルドの最適化設定
  build: {
    outDir: 'dist',
    minify: 'terser',
  },
  // 開発サーバーの設定
  server: {
    port: 5173,
    open: true, // 開発サーバー起動時にブラウザを自動で開く
    // historyApiFallbackはVite 4.x以降では不要、代わりにbase設定を使用
  },
  // ベースパスを設定
  base: './'
})
