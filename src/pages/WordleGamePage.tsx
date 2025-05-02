import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings, Play, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Word, getWords, Category, getCategories } from '../db/db';
import toast from 'react-hot-toast';

interface GameSettings {
  categoryId: number | 'all';
}

const WordleGamePage: React.FC = () => {
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [settings, setSettings] = useState<GameSettings>({
    categoryId: 'all'
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [targetWord, setTargetWord] = useState<Word | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showTranslationQuiz, setShowTranslationQuiz] = useState(false);
  const [translationOptions, setTranslationOptions] = useState<string[]>([]);
  const [randomWords, setRandomWords] = useState<Word[]>([]);
  const [isPersianWord, setIsPersianWord] = useState(true);

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

  const startGame = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      let words: Word[];
      if (settings.categoryId === 'all') {
        const result = await getWords(user.id, 1, 100);
        words = result.words;
      } else {
        const result = await getWords(user.id, 1, 100, Number(settings.categoryId));
        words = result.words;
      }

      if (words.length < 4) {
        toast.error('تعداد لغات موجود کافی نیست');
        return;
      }

      // Select random word and three other random words for translation quiz
      const shuffledWords = words.sort(() => Math.random() - 0.5);
      const selectedWord = shuffledWords[0];
      const otherWords = shuffledWords.slice(1, 4);

      // Check if the word contains Persian characters
      const hasPersianChars = /^[\u0600-\u06FF\s]+$/.test(selectedWord.word);
      setIsPersianWord(hasPersianChars);

      setTargetWord(selectedWord);
      setRandomWords(otherWords);
      setGuesses([]);
      setCurrentGuess('');
      setGameStatus('playing');
      setShowTranslationQuiz(false);
      setIsSettingsOpen(false);
    } catch (error) {
      toast.error('خطا در شروع بازی');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing' || showTranslationQuiz) return;

    if (key === 'Enter') {
      if (currentGuess.length === targetWord?.word.length) {
        submitGuess();
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (
      (isPersianWord && /^[آ-ی]$/.test(key)) || 
      (!isPersianWord && /^[a-zA-Z]$/.test(key))
    ) {
      if (currentGuess.length < (targetWord?.word.length || 0)) {
        setCurrentGuess(prev => prev + (isPersianWord ? key : key.toLowerCase()));
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('Backspace');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleKeyPress('Enter');
      } else if (
        (isPersianWord && /^[آ-ی]$/.test(e.key)) ||
        (!isPersianWord && /^[a-zA-Z]$/.test(e.key))
      ) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, targetWord, gameStatus, showTranslationQuiz, isPersianWord]);

  const submitGuess = () => {
    if (!targetWord) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess.toLowerCase() === targetWord.word.toLowerCase()) {
      setShowTranslationQuiz(true);
      // Prepare translation options
      const options = [targetWord.translation, ...randomWords.map(w => w.translation)]
        .sort(() => Math.random() - 0.5);
      setTranslationOptions(options);
    } else if (newGuesses.length >= Math.min(6, targetWord.word.length + 1)) {
      setGameStatus('lost');
    }
  };

  const checkLetter = (letter: string, index: number, word: string) => {
    if (!targetWord) return 'bg-gray-200';
    
    const targetLetter = isPersianWord ? 
      targetWord.word[index] : 
      targetWord.word[index].toLowerCase();
    const currentLetter = isPersianWord ? 
      letter : 
      letter.toLowerCase();
    
    if (currentLetter === targetLetter) {
      return 'bg-green-500 text-white';
    } else if (targetWord.word.toLowerCase().includes(currentLetter)) {
      return 'bg-yellow-500 text-white';
    }
    return 'bg-gray-200';
  };

  const handleTranslationGuess = (translation: string) => {
    if (!targetWord) return;

    if (translation === targetWord.translation) {
      setGameStatus('won');
      toast.success('تبریک! شما برنده شدید! 🎉');
    } else {
      setGameStatus('lost');
      toast.error('متاسفانه اشتباه حدس زدید!');
    }
    setShowTranslationQuiz(false);
  };

  const persianKeyboard = [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ'],
    ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'],
    ['ظ', 'ط', 'ز', 'ر', 'ذ', 'د', 'پ', 'و']
  ];

  const englishKeyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const keyboard = isPersianWord ? persianKeyboard : englishKeyboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-2xl">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">وردل</h1>
          <p className="text-gray-600">کلمه مخفی را حدس بزنید</p>
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
              {/* Game Grid */}
              <div className={`grid gap-2 ${!isPersianWord ? 'direction-ltr' : ''}`}>
                {Array.from({ length: Math.min(6, (targetWord?.word.length || 0) + 1) }).map((_, rowIndex) => (
                  <div key={rowIndex} className={`flex gap-2 ${isPersianWord ? 'justify-center' : 'justify-center flex-row-reverse'}`}>
                    {Array.from({ length: targetWord?.word.length || 0 }).map((_, colIndex) => {
                      const letter = guesses[rowIndex]?.[colIndex] || (rowIndex === guesses.length ? currentGuess[colIndex] : '');
                      return (
                        <motion.div
                          key={colIndex}
                          initial={{ scale: letter ? 1.1 : 1 }}
                          animate={{ scale: 1 }}
                          className={`
                            w-12 h-12 flex items-center justify-center
                            text-lg font-bold rounded-lg border-2
                            ${guesses[rowIndex] 
                              ? checkLetter(letter, colIndex, guesses[rowIndex])
                              : 'bg-white border-gray-300'
                            }
                          `}
                        >
                          {letter}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Virtual Keyboard */}
              {gameStatus === 'playing' && !showTranslationQuiz && (
                <div className="space-y-2">
                  {keyboard.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                      {rowIndex === keyboard.length - 1 && (
                        <button
                          onClick={() => handleKeyPress('Enter')}
                          className="px-4 py-3 bg-primary-500 text-white rounded-lg font-medium"
                        >
                          ثبت
                        </button>
                      )}
                      {row.map((key) => (
                        <button
                          key={key}
                          onClick={() => handleKeyPress(key)}
                          className="w-9 h-9 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                        >
                          {key}
                        </button>
                      ))}
                      {rowIndex === keyboard.length - 1 && (
                        <button
                          onClick={() => handleKeyPress('Backspace')}
                          className="px-4 py-3 bg-gray-500 text-white rounded-lg font-medium"
                        >
                          ⌫
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Translation Quiz Modal */}
              {showTranslationQuiz && (
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
                      عالی! حالا ترجمه درست کلمه را انتخاب کنید:
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

              {/* Game Over */}
              {gameStatus !== 'playing' && !showTranslationQuiz && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                  <div className="bg-white rounded-xl p-8 max-w-md w-full">
                    <div className="mb-4">
                      {gameStatus === 'won' ? (
                        <Check className="w-12 h-12 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-12 h-12 text-red-500 mx-auto" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                      {gameStatus === 'won' ? 'تبریک! 🎉' : 'متاسفانه باختید!'}
                    </h3>
                    <p className="text-gray-600 mb-4 text-center">
                      کلمه درست: <span className="font-bold">{targetWord?.word}</span>
                      <br />
                      ترجمه: <span className="font-bold">{targetWord?.translation}</span>
                    </p>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="btn-primary w-full"
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

export default WordleGamePage;