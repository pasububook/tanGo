// 単語データの型定義
export interface Word {
  id: string;
  english: string;
  japanese: string;
  remembered?: boolean;
}

// TypeScriptのコンパイラでより互換性を持たせるためのコード
const Types = {
  Word
};

export default Types;