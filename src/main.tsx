import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App'

// エラーのキャッチと表示
try {
  console.log('tanGo アプリケーションを起動中...')
  
  // rootエレメントを取得
  const rootElement = document.getElementById('root')
  console.log('rootエレメント:', rootElement)
  
  if (rootElement) {
    // Reactアプリをレンダリング
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    console.log('Reactアプリをレンダリングしました')
  } else {
    console.error('rootエレメントが見つかりません！')
    document.body.innerHTML = '<div style="color: red; text-align: center; margin-top: 50px;"><h1>エラー: rootエレメントが見つかりません</h1><p>index.htmlに「id="root"」のdiv要素があることを確認してください。</p></div>'
  }
} catch (error) {
  console.error('レンダリング中にエラーが発生しました:', error)
  document.body.innerHTML = `<div style="color: red; text-align: center; margin-top: 50px;">
    <h1>エラーが発生しました</h1>
    <p>${error instanceof Error ? error.message : '不明なエラー'}</p>
    <pre>${error instanceof Error ? error.stack : ''}</pre>
  </div>`
}
