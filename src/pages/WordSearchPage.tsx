import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings, Play, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Word, getWords, Category, getCategories } from '../db/db';
import toast from 'react-hot-toast';

interface GameSettings {
  categoryId: number | 'all';
  gridSize: number;
}

interface Cell {
  letter: string;
  isSelected: boolean;
  isFound: boolean;
  isFirstLetter: boolean;
  row: number;
  col: number;
}

const WordSearchPage: React.FC = () => {
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [settings, setSettings] = useState<GameSettings>({
    categoryId: 'all',
    gridSize: 10
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null);
  const [currentSelection, setCurrentSelection] = useState<Cell[]>([]);
  const [isPersianMode, setIsPersianMode] = useState(false);
  const [showTranslationQuiz, setShowTranslationQuiz] = useState(false);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [translationOptions, setTranslationOptions] = useState<string[]>([]);
  const [wordStartPositions, setWordStartPositions] = useState<Map<string, { row: number; col: number }>>(new Map());

  useEffect(() => {
    if (user?.id) {
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      const userCategories = await getCategories(user!.id);
      setCategories(userCategories);
    } catch (error) {
      toast.error('خطا در بارگیری دسته‌بندی‌ها');
    }
  };

  const getRandomLetter = (persian: boolean): string => {
    if (persian) {
      const persianLetters = 'ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی';
      return persianLetters[Math.floor(Math.random() * persianLetters.length)];
    } else {
      return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  };

  const generateGrid = (words: Word[]) => {
    const size = settings.gridSize;
    const emptyGrid: Cell[][] = Array(size).fill(null).map((_, row) =>
      Array(size).fill(null).map((_, col) => ({
        letter: '',
        isSelected: false,
        isFound: false,
        isFirstLetter: false,
        row,
        col
      }))
    );

    const newWordStartPositions = new Map<string, { row: number; col: number }>();
    const hasPersianChars = /^[\u0600-\u06FF\s]+$/.test(words[0].word);
    setIsPersianMode(hasPersianChars);

    // Place words in random directions
    words.forEach(wordObj => {
      const word = hasPersianChars ? wordObj.word : wordObj.word.toUpperCase();
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        const direction = Math.floor(Math.random() * 8);
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);

        const directions = [
          [0, 1],   // right
          [1, 0],   // down
          [1, 1],   // diagonal down-right
          [-1, 1],  // diagonal up-right
          [0, -1],  // left
          [-1, 0],  // up
          [-1, -1], // diagonal up-left
          [1, -1]   // diagonal down-left
        ];

        const [dRow, dCol] = directions[direction];
        const endRow = startRow + dRow * (word.length - 1);
        const endCol = startCol + dCol * (word.length - 1);

        if (
          endRow >= 0 && endRow < size &&
          endCol >= 0 && endCol < size &&
          canPlaceWord(emptyGrid, word, startRow, startCol, dRow, dCol)
        ) {
          placeWord(emptyGrid, word, startRow, startCol, dRow, dCol);
          newWordStartPositions.set(word, { row: startRow, col: startCol });
          placed = true;
        }

        attempts++;
      }
    });

    // Mark first letters
    newWordStartPositions.forEach((pos, word) => {
      emptyGrid[pos.row][pos.col].isFirstLetter = true;
    });

    // Fill empty cells with random letters
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!emptyGrid[row][col].letter) {
          emptyGrid[row][col].letter = getRandomLetter(hasPersianChars);
        }
      }
    }

    setWordStartPositions(newWordStartPositions);
    return emptyGrid;
  };

  const canPlaceWord = (
    grid: Cell[][],
    word: string,
    startRow: number,
    startCol: number,
    dRow: number,
    dCol: number
  ): boolean => {
    for (let i = 0; i < word.length; i++) {
      const row = startRow + dRow * i;
      const col = startCol + dCol * i;
      if (grid[row][col].letter && grid[row][col].letter !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (
    grid: Cell[][],
    word: string,
    startRow: number,
    startCol: number,
    dRow: number,
    dCol: number
  ) => {
    for (let i = 0; i < word.length; i++) {
      const row = startRow + dRow * i;
      const col = startCol + dCol * i;
      grid[row][col].letter = word[i];
    }
  };

  const startGame = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      let fetchedWords: Word[];
      if (settings.categoryId === 'all') {
        const result = await getWords(user.id, 1, 100);
        fetchedWords = result.words;
      } else {
        const result = await getWords(user.id, 1, 100, Number(settings.categoryId));
        fetchedWords = result.words;
      }

      // Group words by language
      const persianWords = fetchedWords.filter(word => /^[\u0600-\u06FF\s]+$/.test(word.word));
      const englishWords = fetchedWords.filter(word => /^[a-zA-Z\s]+$/.test(word.word));

      // Select words from the larger group
      const wordsToUse = englishWords.length >= persianWords.length ? englishWords : persianWords;

      if (wordsToUse.length < 5) {
        toast.error('حداقل ۵ لغت از یک زبان برای شروع بازی نیاز است');
        return;
      }

      // Select random words
      const selectedWords = wordsToUse
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(8, wordsToUse.length));

      setWords(selectedWords);
      const newGrid = generateGrid(selectedWords);
      setGrid(newGrid);
      setFoundWords(new Set());
      setIsSettingsOpen(false);
      setShowTranslationQuiz(false);
      setCurrentWord(null);
    } catch (error) {
      toast.error('خطا در شروع بازی');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellMouseDown = (row: number, col: number) => {
    if (showTranslationQuiz) return;
    setSelectionStart({ row, col });
    setCurrentSelection([grid[row][col]]);
    const newGrid = grid.map(r => r.map(cell => ({
      ...cell,
      isSelected: cell.row === row && cell.col === col
    })));
    setGrid(newGrid);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!selectionStart || showTranslationQuiz) return;

    // Calculate direction from start to current cell
    const dRow = Math.sign(row - selectionStart.row);
    const dCol = Math.sign(col - selectionStart.col);

    // Only allow straight lines or diagonals
    if (dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol)) {
      // Calculate distance
      const distance = Math.max(
        Math.abs(row - selectionStart.row),
        Math.abs(col - selectionStart.col)
      );

      // Build selection path
      const selection: Cell[] = [];
      for (let i = 0; i <= distance; i++) {
        const currentRow = selectionStart.row + dRow * i;
        const currentCol = selectionStart.col + dCol * i;
        
        // Check bounds
        if (
          currentRow >= 0 && currentRow < settings.gridSize &&
          currentCol >= 0 && currentCol < settings.gridSize
        ) {
          selection.push(grid[currentRow][currentCol]);
        }
      }

      setCurrentSelection(selection);
      const newGrid = grid.map(r => r.map(cell => ({
        ...cell,
        isSelected: selection.some(s => s.row === cell.row && s.col === cell.col)
      })));
      setGrid(newGrid);
    }
  };

  const handleCellMouseUp = () => {
    if (!selectionStart || showTranslationQuiz) return;

    const selectedWord = currentSelection.map(cell => cell.letter).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    const foundWord = words.find(w => {
      const word = isPersianMode ? w.word : w.word.toUpperCase();
      return word === selectedWord || word === reversedWord;
    });

    if (foundWord && !foundWords.has(foundWord.word)) {
      // Show translation quiz
      setCurrentWord(foundWord);
      const incorrectOptions = words
        .filter(w => w.id !== foundWord.id)
        .map(w => w.translation)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [foundWord.translation, ...incorrectOptions]
        .sort(() => Math.random() - 0.5);
      
      setTranslationOptions(options);
      setShowTranslationQuiz(true);
    }

    // Clear selection
    const newGrid = grid.map(row => row.map(cell => ({
      ...cell,
      isSelected: false
    })));
    setGrid(newGrid);
    setSelectionStart(null);
    setCurrentSelection([]);
  };

  const handleTranslationGuess = (translation: string) => {
    if (!currentWord) return;

    if (translation === currentWord.translation) {
      // Correct translation
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(currentWord.word);
      setFoundWords(newFoundWords);

      // Mark found word cells
      const newGrid = grid.map(row => row.map(cell => ({
        ...cell,
        isFound: cell.isFound || currentSelection.some(s => s.row === cell.row && s.col === cell.col)
      })));
      setGrid(newGrid);

      if (newFoundWords.size === words.length) {
        toast.success('تبریک! همه کلمات را پیدا کردید! 🎉');
      } else {
        toast.success('آفرین! یک کلمه پیدا کردید! 🎯');
      }
    } else {
      toast.error('ترجمه اشتباه است! دوباره تلاش کنید.');
    }

    setShowTranslationQuiz(false);
    setCurrentWord(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/games" 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            <span>بازگشت به بازی‌ها</span>
          </Link>
          
          {!isSettingsOpen && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Settings className="w-5 h-5 ml-2" />
              <span>تنظیمات</span>
            </button>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مارپیچ لغات</h1>
          <p className="text-gray-600">کلمات مخفی شده را پیدا کنید</p>
        </div>

        <AnimatePresence mode="wait">
          {isSettingsOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card max-w-lg mx-auto"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">تنظیمات بازی</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">دسته‌بندی</label>
                  <select
                    className="form-input"
                    value={settings.categoryId}
                    onChange={(e) => setSettings({ ...settings, categoryId: e.target.value })}
                  >
                    <option value="all">همه لغات</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">اندازه جدول</label>
                  <select
                    className="form-input"
                    value={settings.gridSize}
                    onChange={(e) => setSettings({ ...settings, gridSize: Number(e.target.value) })}
                  >
                    {[8, 10, 12].map(size => (
                      <option key={size} value={size}>{size}×{size}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={startGame}
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      <span>در حال آماده‌سازی...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 ml-2" />
                      <span>شروع بازی</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Progress */}
              <div className="card mb-6">
                <div className="flex items-center justify-center space-x-4 space-x-reverse">
                  <span className="text-gray-600">پیشرفت:</span>
                  <span className="font-bold text-primary-600">
                    {foundWords.size} از {words.length} کلمه
                  </span>
                </div>
              </div>

              {/* Game Grid */}
              <div 
                className="card overflow-x-auto"
                onMouseLeave={handleCellMouseUp}
              >
                <div 
                  className={`grid gap-1`}
                  style={{
                    gridTemplateColumns: `repeat(${settings.gridSize}, minmax(0, 1fr))`,
                    direction: isPersianMode ? 'rtl' : 'ltr'
                  }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center
                          rounded-lg font-bold text-lg select-none cursor-pointer
                          transition-colors
                          ${cell.isFound ? 'bg-green-200 text-green-800' :
                            cell.isSelected ? 'bg-blue-200 text-blue-800' :
                            cell.isFirstLetter ? 'bg-orange-200 text-orange-800' :
                            'bg-white hover:bg-gray-100'}
                        `}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                      >
                        {cell.letter}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Words List */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">کلمات یافت شده:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {words.map((word, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg text-center ${
                        foundWords.has(word.word)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {foundWords.has(word.word) ? word.word : '???'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Translation Quiz Modal */}
              {showTranslationQuiz && currentWord && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-xl p-6 max-w-md w-full"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                      ترجمه درست کلمه «{currentWord.word}» را انتخاب کنید:
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {translationOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleTranslationGuess(option)}
                          className="btn-outline text-center py-4 w-full"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Game Complete Modal */}
              {foundWords.size === words.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                  <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check className="w-16 h-16 text-green-500 mx-auto" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">تبریک! 🎉</h2>
                    <p className="text-gray-600 mb-8">
                      شما موفق شدید تمام کلمات را پیدا کنید!
                    </p>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="btn-primary"
                    >
                      بازی جدید
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WordSearchPage;