import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings, Play, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Word, getWords, Category, getCategories } from '../db/db';
import toast from 'react-hot-toast';

interface GameSettings {
  wordCount: number;
  categoryId: number | 'all';
  cardsPerRow: number;
}

interface Card {
  id: string;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'word' | 'translation';
  originalId: number;
}

const MemoryGamePage: React.FC = () => {
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [settings, setSettings] = useState<GameSettings>({
    wordCount: 5,
    categoryId: 'all',
    cardsPerRow: 4
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [gameEndTime, setGameEndTime] = useState<Date | null>(null);

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
        const result = await getWords(user.id, 1, 100); // Get all words
        words = result.words;
      } else {
        const result = await getWords(user.id, 1, 100, Number(settings.categoryId));
        words = result.words;
      }

      if (words.length < settings.wordCount) {
        toast.error('تعداد لغات موجود کمتر از تعداد درخواستی است');
        return;
      }

      // Randomly select words
      const selectedWords = words
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.wordCount);

      // Create pairs of cards (word and translation)
      const cardPairs = selectedWords.flatMap((word): Card[] => [
        {
          id: `word-${word.id}`,
          content: word.word,
          isFlipped: false,
          isMatched: false,
          type: 'word',
          originalId: word.id!
        },
        {
          id: `translation-${word.id}`,
          content: word.translation,
          isFlipped: false,
          isMatched: false,
          type: 'translation',
          originalId: word.id!
        }
      ]);

      // Shuffle cards
      const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setFlippedCards([]);
      setMatchedPairs(0);
      setMoves(0);
      setGameStartTime(new Date());
      setGameEndTime(null);
      setIsSettingsOpen(false);
    } catch (error) {
      toast.error('خطا در شروع بازی');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (card: Card) => {
    if (
      card.isMatched ||
      card.isFlipped ||
      flippedCards.length >= 2 ||
      !gameStartTime ||
      gameEndTime
    ) {
      return;
    }

    const newCards = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(m => m + 1);
      
      // Check if cards match
      if (
        newFlippedCards[0].originalId === newFlippedCards[1].originalId &&
        newFlippedCards[0].type !== newFlippedCards[1].type
      ) {
        // Match found
        setTimeout(() => {
          setCards(cards.map(c =>
            c.originalId === newFlippedCards[0].originalId
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          ));
          setFlippedCards([]);
          setMatchedPairs(m => {
            const newMatchedPairs = m + 1;
            if (newMatchedPairs === settings.wordCount) {
              setGameEndTime(new Date());
            }
            return newMatchedPairs;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(c =>
            newFlippedCards.some(fc => fc.id === c.id)
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (startTime: Date, endTime: Date) => {
    const diff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">جفت‌یاب</h1>
          <p className="text-gray-600">کارت‌های مرتبط را پیدا کنید</p>
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
                  <label className="form-label">تعداد لغات</label>
                  <select
                    className="form-input"
                    value={settings.wordCount}
                    onChange={(e) => setSettings({ ...settings, wordCount: Number(e.target.value) })}
                  >
                    {[5, 8, 10, 12, 15].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

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
                  <label className="form-label">تعداد کارت در هر ردیف</label>
                  <select
                    className="form-input"
                    value={settings.cardsPerRow}
                    onChange={(e) => setSettings({ ...settings, cardsPerRow: Number(e.target.value) })}
                  >
                    {[2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
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
            >
              <div className="flex justify-center gap-8 mb-6 flex-wrap">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-gray-600">حرکت‌ها:</span>
                  <span className="font-bold text-gray-900 mr-2">{moves}</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-gray-600">جفت‌های پیدا شده:</span>
                  <span className="font-bold text-gray-900 mr-2">{matchedPairs} از {settings.wordCount}</span>
                </div>
                {gameStartTime && gameEndTime && (
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-gray-600">زمان:</span>
                    <span className="font-bold text-gray-900 mr-2">
                      {formatTime(gameStartTime, gameEndTime)}
                    </span>
                  </div>
                )}
              </div>

              <div 
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${settings.cardsPerRow}, minmax(0, 1fr))`
                }}
              >
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    className={`
                      relative aspect-[4/3] cursor-pointer
                      ${card.isMatched ? 'cursor-default' : 'cursor-pointer'}
                    `}
                    onClick={() => handleCardClick(card)}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        rotateY: card.isFlipped ? 180 : 0
                      }}
                      transition={{ duration: 0.6, type: 'spring' }}
                      className="w-full h-full relative preserve-3d"
                    >
                      {/* Front of card (hidden) */}
                      <div
                        className={`
                          absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg
                          border-2 transition-colors flex items-center justify-center
                          ${card.isMatched ? 'border-green-500' : 'border-primary-200'}
                          ${!card.isFlipped && 'hover:border-primary-500'}
                        `}
                      >
                        <div className="text-4xl font-bold text-primary-300 opacity-50">
                          {cards.indexOf(card) + 1}
                        </div>
                      </div>

                      {/* Back of card (content) */}
                      <div
                        className={`
                          absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg
                          border-2 rotateY-180 flex items-center justify-center p-4
                          ${card.isMatched ? 'border-green-500' : 'border-primary-200'}
                        `}
                      >
                        <div
                          className={`
                            text-center font-bold break-words
                            ${card.type === 'word' ? 'text-primary-600' : 'text-secondary-600'}
                          `}
                          style={{
                            fontSize: card.content.length > 10 ? '0.9rem' : '1.1rem'
                          }}
                        >
                          {card.content}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {gameEndTime && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                >
                  <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">تبریک! 🎉</h2>
                    <p className="text-gray-600 mb-6">
                      شما موفق شدید تمام جفت‌ها را پیدا کنید!
                    </p>
                    <div className="space-y-2 mb-6">
                      <p className="text-gray-800">
                        تعداد حرکت‌ها: <span className="font-bold">{moves}</span>
                      </p>
                      <p className="text-gray-800">
                        زمان: <span className="font-bold">{formatTime(gameStartTime!, gameEndTime)}</span>
                      </p>
                    </div>
                    <div className="space-x-4 space-x-reverse">
                      <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="btn-primary"
                      >
                        بازی جدید
                      </button>
                    </div>
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

export default MemoryGamePage;