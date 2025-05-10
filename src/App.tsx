import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { loadWords } from './utils'
// 使用されていないインポートを削除

// コンポーネントのインポート
import Flashcards from './components/Flashcards'
import Quiz from './components/Quiz'
import Upload from './components/Upload'

// ホーム画面コンポーネント
const Home = () => {
  const [wordsCount, setWordsCount] = React.useState(0);
  
  React.useEffect(() => {
    try {
      const words = loadWords();
      setWordsCount(words.length);
      console.log('単語データを読み込みました:', words.length, '単語');
    } catch (error) {
      console.error('単語データの読み込みに失敗しました:', error);
    }
  }, []);
  
  return (
    <div className="home">
      <h1>tanGo - 英単語学習アプリ</h1>
      {wordsCount > 0 ? (
        <p className="words-count">{wordsCount}単語が登録されています</p>
      ) : (
        <p className="words-count">単語が登録されていません</p>
      )}
      <div className="menu">
        <Link to="/quiz" className="menu-button">単語クイズ</Link>
        <Link to="/flashcards" className="menu-button">単語帳</Link>
        <Link to="/upload" className="menu-button">単語登録</Link>
      </div>
    </div>
  );
};

function App() {
  console.log('Appコンポーネントがレンダリングされました');
  
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
