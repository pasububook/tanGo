// 単語データの型定義
export interface Word {
  id: string;
  english: string;
  japanese: string;
  remembered?: boolean;
}

// TypeScriptのコンパイラでより互換性を持たせるためのコード
const Types = {
  Word: 'Word' // 値として文字列を使用
};

export default Types;