import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadWords, shuffleArray, checkAnswer } from '../utils';
import type { Word } from '../types';

// クイズの問題の型定義
interface QuizQuestion {
  id: string;
  question: string; // 日本語
  answer: string;   // 英語
  userAnswer?: string;
  isCorrect?: boolean;
}

const Quiz = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [onlyWrongAnswers, setOnlyWrongAnswers] = useState(false);

  // 単語データの読み込み
  useEffect(() => {
    const loadedWords = loadWords();
    if (loadedWords.length > 0) {
      setWords(loadedWords);
      generateQuestions(loadedWords);
    }
  }, []);

  // 問題生成
  const generateQuestions = (words: Word[], onlyWrong = false) => {
    let wordPool = [...words];
    
    // 間違えた問題のみ取得
    if (onlyWrong && questions.length > 0) {
      const wrongQuestionIds = questions
        .filter(q => q.isCorrect === false)
        .map(q => q.id);
      
      wordPool = wordPool.filter(word => wrongQuestionIds.includes(word.id));
    }
    
    // 問題がなければ処理終了
    if (wordPool.length === 0) {
      setQuestions([]);
      return;
    }
    
    // 単語をシャッフル
    const shuffledWords = shuffleArray(wordPool);
    
    // 問題の作成
    const newQuestions: QuizQuestion[] = shuffledWords.map(word => ({
      id: word.id,
      question: word.japanese,
      answer: word.english,
    }));
    
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setIsFinished(false);
  };

  // 現在の問題
  const currentQuestion = questions[currentIndex];

  // 解答の提出
  const submitAnswer = () => {
    if (!currentQuestion) return;
    
    const isCorrect = checkAnswer(userAnswer, currentQuestion.answer);
    
    // 問題に解答と結果を記録
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQuestion,
      userAnswer,
      isCorrect,
    };
    
    setQuestions(updatedQuestions);
    setShowResult(true);
  };

  // 次の問題へ移動
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  // 最初からやり直す
  const handleRestart = () => {
    generateQuestions(words);
    setOnlyWrongAnswers(false);
  };

  // 間違えた問題だけやり直す
  const handleRetryWrongAnswers = () => {
    generateQuestions(words, true);
    setOnlyWrongAnswers(true);
  };

  // Enterキーで回答送信
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showResult) {
        handleNext();
      } else {
        submitAnswer();
      }
    }
  };

  // 単語が空の場合のメッセージ
  if (words.length === 0) {
    return (
      <div className="quiz-container">
        <Link to="/" className="nav-back">← ホームに戻る</Link>
        <div className="empty-message">
          <h2>単語が登録されていません</h2>
          <p>単語登録画面から単語をアップロードしてください。</p>
          <Link to="/upload" className="upload-link">単語を登録する</Link>
        </div>
      </div>
    );
  }

  // 問題がない場合（間違えた問題のみモードで全て正解した場合など）
  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <Link to="/" className="nav-back">← ホームに戻る</Link>
        <div className="quiz-results">
          <h2>問題がありません</h2>
          <p>間違えた問題はありません。おめでとうございます！</p>
          <button onClick={handleRestart} className="quiz-button">
            最初からやり直す
          </button>
        </div>
      </div>
    );
  }

  // クイズ完了画面
  if (isFinished) {
    const correctCount = questions.filter(q => q.isCorrect).length;
    const hasWrongAnswers = questions.some(q => !q.isCorrect);
    
    return (
      <div className="quiz-container">
        <Link to="/" className="nav-back">← ホームに戻る</Link>
        <div className="quiz-results">
          <h2>クイズ結果</h2>
          <div className="quiz-score">
            正解率: {correctCount} / {questions.length} 問
            ({Math.round((correctCount / questions.length) * 100)}%)
          </div>
          
          {questions.map((q, index) => (
            <div 
              key={q.id} 
              className={`quiz-answer-item ${q.isCorrect ? 'correct' : 'incorrect'}`}
              style={{
                padding: '10px', 
                margin: '5px 0',
                backgroundColor: q.isCorrect ? '#e8f5e9' : '#ffebee',
                borderRadius: '5px'
              }}
            >
              <p>問題 {index + 1}: {q.question}</p>
              <p>正解: {q.answer}</p>
              {!q.isCorrect && <p>あなたの回答: {q.userAnswer}</p>}
            </div>
          ))}
          
          <div className="quiz-action-buttons" style={{marginTop: '20px'}}>
            <button onClick={handleRestart} className="quiz-button">
              最初からやり直す
            </button>
            
            {hasWrongAnswers && (
              <button 
                onClick={handleRetryWrongAnswers} 
                className="quiz-retry-button"
                style={{marginTop: '10px'}}
              >
                間違えた問題だけやり直す
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <Link to="/" className="nav-back">← ホームに戻る</Link>
      
      <div className="quiz-progress" style={{marginBottom: '15px'}}>
        <p>問題 {currentIndex + 1} / {questions.length}</p>
        {onlyWrongAnswers && <p className="retry-mode">間違えた問題のみモード</p>}
      </div>
      
      <div className="quiz-question">
        <h3>問題: 次の日本語を英語にしてください</h3>
        <p className="question-text" style={{fontSize: '1.5rem', marginTop: '10px'}}>
          {currentQuestion?.question}
        </p>
        
        <input
          type="text"
          className="quiz-input"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="英単語を入力してください"
          disabled={showResult}
          autoFocus
        />
        
        {!showResult ? (
          <button 
            className="quiz-button" 
            onClick={submitAnswer}
            disabled={!userAnswer.trim()}
          >
            回答する
          </button>
        ) : (
          <div className="quiz-result" style={{marginTop: '15px'}}>
            <p className={currentQuestion?.isCorrect ? 'correct' : 'incorrect'} style={{
              fontWeight: 'bold',
              color: currentQuestion?.isCorrect ? 'green' : 'red'
            }}>
              {currentQuestion?.isCorrect ? '正解！' : '不正解'}
            </p>
            {!currentQuestion?.isCorrect && (
              <p className="correct-answer">
                正解: {currentQuestion?.answer}
              </p>
            )}
            <button className="quiz-button" onClick={handleNext}>
              次の問題へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;