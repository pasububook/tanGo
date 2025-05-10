import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Fast Refresh の設定をオンにする
      fastRefresh: true,
    })
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
    // ヒストリーモードのための設定
    historyApiFallback: true,
  },
  // ベースパスを設定
  base: '/'
})
