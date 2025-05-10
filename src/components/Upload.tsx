import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parseTSVFile, convertToWords, saveWords } from '../utils';
import type { Word } from '../types';

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string[][]>([]);
  const [englishColumnIndex, setEnglishColumnIndex] = useState<number>(0);
  const [japaneseColumnIndex, setJapaneseColumnIndex] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ファイル選択時の処理
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsLoading(true);
    setError('');
    setFile(selectedFile);

    try {
      // TSVファイルを解析
      const data = await parseTSVFile(selectedFile);
      setFileData(data);
    } catch (err) {
      setError('ファイルの解析に失敗しました。正しいTSV形式か確認してください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 英語列のインデックスを変更
  const handleEnglishColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setEnglishColumnIndex(index);
  };

  // 日本語列のインデックスを変更
  const handleJapaneseColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setJapaneseColumnIndex(index);
  };

  // 単語データを保存して次に進む
  const handleSaveWords = () => {
    if (!fileData.length) {
      setError('ファイルが選択されていないか、データが空です。');
      return;
    }

    try {
      // データを単語形式に変換
      const words: Word[] = convertToWords(
        fileData,
        englishColumnIndex,
        japaneseColumnIndex
      );

      if (words.length === 0) {
        setError('有効な単語データが見つかりませんでした。');
        return;
      }

      // ローカルストレージに保存
      saveWords(words);
      
      // ホーム画面に戻る
      navigate('/');
    } catch (err) {
      setError('単語データの保存に失敗しました。');
      console.error(err);
    }
  };

  // 列選択のオプションを生成
  const generateColumnOptions = () => {
    if (!fileData.length || !fileData[0].length) return null;

    return fileData[0].map((header, index) => (
      <option key={index} value={index}>
        {header || `列 ${index + 1}`}
      </option>
    ));
  };

  // プレビューテーブルの表示
  const renderPreviewTable = () => {
    if (!fileData.length) return null;

    // 最初の数行だけをプレビュー表示
    const previewRows = fileData.slice(0, 5);

    return (
      <div>
        <h3>プレビュー</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="preview-table">
            <thead>
              <tr>
                {previewRows[0].map((_, index) => (
                  <th key={index}>
                    {index === englishColumnIndex ? '英語' : 
                     index === japaneseColumnIndex ? '日本語' : 
                     `列 ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} 
                      className={
                        cellIndex === englishColumnIndex ? 'english-column' :
                        cellIndex === japaneseColumnIndex ? 'japanese-column' : ''
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="upload-container">
      <Link to="/" className="nav-back">← ホームに戻る</Link>
      <h2 className="upload-title">単語データのアップロード</h2>

      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div className="upload-form">
        <label className="file-input-label">
          <span>TSVファイルを選択:</span>
          <input 
            type="file" 
            accept=".tsv,.txt"
            onChange={handleFileChange}
          />
        </label>

        {isLoading && <p>ファイルを解析中...</p>}

        {fileData.length > 0 && (
          <>
            <div className="column-selector">
              <label>
                英語列を選択:
                <select value={englishColumnIndex} onChange={handleEnglishColumnChange}>
                  {generateColumnOptions()}
                </select>
              </label>
            </div>

            <div className="column-selector">
              <label>
                日本語列を選択:
                <select value={japaneseColumnIndex} onChange={handleJapaneseColumnChange}>
                  {generateColumnOptions()}
                </select>
              </label>
            </div>

            {renderPreviewTable()}

            <button className="upload-button" onClick={handleSaveWords}>
              単語データを保存
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Upload;