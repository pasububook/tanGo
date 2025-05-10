import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadWords, saveWords, shuffleArray } from '../utils';
import type { Word } from '../types';

const Flashcards = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // 単語データの読み込み
  useEffect(() => {
    const loadedWords = loadWords();
    if (loadedWords.length === 0) {
      setIsEmpty(true);
    } else {
      // 単語をシャッフル
      setWords(shuffleArray(loadedWords));
    }
  }, []);

  // 現在表示している単語
  const currentWord = words[currentIndex];

  // カードをクリックしたときのフリップ処理
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  // 次の単語に進む
  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  // 前の単語に戻る
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  // 「覚えた」ボタンのハンドラ
  const handleRemembered = () => {
    const updatedWords = [...words];
    updatedWords[currentIndex] = {
      ...updatedWords[currentIndex],
      remembered: true
    };
    setWords(updatedWords);
    saveWords(updatedWords);
    handleNext();
  };

  // 「覚えていない」ボタンのハンドラ
  const handleNotRemembered = () => {
    const updatedWords = [...words];
    updatedWords[currentIndex] = {
      ...updatedWords[currentIndex],
      remembered: false
    };
    setWords(updatedWords);
    saveWords(updatedWords);
    handleNext();
  };

  // 最初からやり直す
  const handleRestart = () => {
    setWords(shuffleArray(words));
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
  };

  // 未学習の単語のみで再開
  const handleRestartWithUnremembered = () => {
    const unremberedWords = words.filter(word => !word.remembered);
    if (unremberedWords.length > 0) {
      setWords(shuffleArray(unremberedWords));
      setCurrentIndex(0);
      setIsFlipped(false);
      setCompleted(false);
    } else {
      // 全ての単語を学習済みの場合
      handleRestart();
    }
  };

  // 学習状況の表示
  const renderProgress = () => {
    const rememberedCount = words.filter(word => word.remembered).length;
    return (
      <div className="progress-info">
        <p>進捗: {currentIndex + 1} / {words.length} 単語</p>
        <p>記憶済み: {rememberedCount} 単語</p>
      </div>
    );
  };

  // 単語が空の場合のメッセージ
  if (isEmpty) {
    return (
      <div className="flashcard-container-wrapper">
        <Link to="/" className="nav-back">← ホームに戻る</Link>
        <div className="empty-message">
          <h2>単語が登録されていません</h2>
          <p>単語登録画面から単語をアップロードしてください。</p>
          <Link to="/upload" className="upload-link">単語を登録する</Link>
        </div>
      </div>
    );
  }

  // 学習完了時の表示
  if (completed) {
    const rememberedCount = words.filter(word => word.remembered).length;
    const totalCount = words.length;
    const unremberedCount = totalCount - rememberedCount;
    
    return (
      <div className="flashcard-container-wrapper">
        <Link to="/" className="nav-back">← ホームに戻る</Link>
        <div className="completion-screen">
          <h2>学習完了！</h2>
          <div className="completion-stats">
            <p>全単語数: {totalCount}</p>
            <p>覚えた単語: {rememberedCount}</p>
            <p>まだ覚えていない単語: {unremberedCount}</p>
          </div>
          <div className="completion-buttons">
            <button onClick={handleRestart} className="control-button">
              最初からやり直す
            </button>
            
            {unremberedCount > 0 && (
              <button 
                onClick={handleRestartWithUnremembered} 
                className="control-button not-remembered"
              >
                覚えていない単語だけやり直す
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-container-wrapper">
      <Link to="/" className="nav-back">← ホームに戻る</Link>
      
      {renderProgress()}
      
      <div className="flashcard-container">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
          onClick={handleCardClick}
        >
          <div className="flashcard-front">
            {currentWord?.english}
          </div>
          <div className="flashcard-back">
            {currentWord?.japanese}
          </div>
        </div>
      </div>
      
      <div className="flashcard-controls">
        <button 
          onClick={handlePrev} 
          className="control-button" 
          disabled={currentIndex === 0}
        >
          前へ
        </button>
        
        {isFlipped && (
          <>
            <button 
              onClick={handleNotRemembered} 
              className="control-button not-remembered"
            >
              覚えていない
            </button>
            
            <button 
              onClick={handleRemembered} 
              className="control-button remembered"
            >
              覚えた
            </button>
          </>
        )}
        
        <button 
          onClick={handleNext} 
          className="control-button" 
          disabled={currentIndex === words.length - 1}
        >
          次へ
        </button>
      </div>
      
      <p className="flashcard-hint">
        タップして単語の意味を確認、「覚えた」または「覚えていない」を選択してください。
      </p>
    </div>
  );
};

export default Flashcards;