// types.tsからWordインターフェースをインポート
import type { Word } from './types';
import Papa from 'papaparse';

// ローカルストレージのキー
const STORAGE_KEY = 'tanGo_words';

// 単語データをローカルストレージに保存
export const saveWords = (words: Word[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
};

// 単語データをローカルストレージから取得
export const loadWords = (): Word[] => {
  const storedWords = localStorage.getItem(STORAGE_KEY);
  if (storedWords) {
    return JSON.parse(storedWords);
  }
  return [];
};

// TSVファイルを解析する関数
export const parseTSVFile = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      delimiter: '\t', // TSV形式
      complete: (results) => {
        resolve(results.data as string[][]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// ファイルから取得したデータを単語データに変換
export const convertToWords = (data: string[][], englishColumnIndex: number, japaneseColumnIndex: number): Word[] => {
  return data
    .filter(row => row.length > Math.max(englishColumnIndex, japaneseColumnIndex) && row[englishColumnIndex] && row[japaneseColumnIndex])
    .map((row, index) => ({
      id: `word-${Date.now()}-${index}`,
      english: row[englishColumnIndex],
      japanese: row[japaneseColumnIndex],
      remembered: false,
    }));
};

// シャッフルした配列を返す
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// 回答が正しいかチェック
export const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  // 大文字小文字を無視し、前後の空白をトリムして比較
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
};