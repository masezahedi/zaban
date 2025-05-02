import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, ArrowRight, Clock, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Word, getWordsForReview, reviewWord, db } from '../db/db';
import toast from 'react-hot-toast';

const LeitnerBoxPage: React.FC = () => {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [boxStats, setBoxStats] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    loadWords();
    loadBoxStats();
  }, [user]);

  const loadWords = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const wordsToReview = await getWordsForReview(user.id);
      setWords(wordsToReview);
      setCurrentWordIndex(0);
      setShowAnswer(false);
    } catch (error) {
      toast.error('خطا در بارگیری لغات');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBoxStats = async () => {
    if (!user?.id) return;

    try {
      const stats: { [key: number]: number } = {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      };

      // Count words in each box
      const allWords = await db.words.where('userId').equals(user.id).toArray();
      allWords.forEach(word => {
        if (word.box >= 1 && word.box <= 5) {
          stats[word.box]++;
        }
      });

      setBoxStats(stats);
    } catch (error) {
      console.error('Error loading box stats:', error);
    }
  };

  const handleAnswer = async (correct: boolean) => {
    if (!user?.id || !words[currentWordIndex]) return;

    try {
      await reviewWord(words[currentWordIndex].id!, user.id, correct);
      await loadBoxStats(); // Refresh stats after review
      
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        setWords([]);
        loadWords(); // Refresh words list
      }
    } catch (error) {
      toast.error('خطا در ثبت پاسخ');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-12 h-12 text-primary-500" />
          </motion.div>
          <p className="mt-4 text-gray-600">در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Link 
            to="/games" 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            <span>بازگشت به بازی‌ها</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">جعبه لایتنر</h1>
          {words.length > 0 && (
            <p className="text-gray-600">
              {currentWordIndex + 1} از {words.length} لغت
            </p>
          )}
        </div>

        {words.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card relative overflow-hidden mb-8"
            >
              <div className="absolute top-4 left-4 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                جعبه {currentWord.box}
              </div>

              <div className="text-center py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {currentWord.word}
                </h2>

                {showAnswer ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-xl text-gray-800 mb-4">{currentWord.translation}</p>
                    <p className="text-gray-600 italic">"{currentWord.usage}"</p>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="btn-primary"
                  >
                    نمایش پاسخ
                  </button>
                )}
              </div>

              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center space-x-4 space-x-reverse mt-4"
                >
                  <button
                    onClick={() => handleAnswer(false)}
                    className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
                  >
                    <XCircle className="w-5 h-5 ml-2" />
                    نادرست
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="btn bg-green-500 text-white hover:bg-green-600 focus:ring-green-400"
                  >
                    <CheckCircle className="w-5 h-5 ml-2" />
                    درست
                  </button>
                </motion.div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 ml-1" />
                    <span>دفعات مرور: {currentWord.reviewCount}</span>
                  </div>
                  <div>
                    {currentWord.lastReview && (
                      <span>آخرین مرور: {new Date(currentWord.lastReview).toLocaleDateString('fa-IR')}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((boxNumber) => (
            <motion.div
              key={boxNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: boxNumber * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Box className="w-6 h-6 text-primary-500" />
                  <h3 className="text-lg font-bold text-gray-900">جعبه {boxNumber}</h3>
                </div>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {boxStats[boxNumber] || 0} لغت
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                {boxNumber === 1 && 'مرور روزانه'}
                {boxNumber === 2 && 'مرور هر ۲ روز'}
                {boxNumber === 3 && 'مرور هر ۴ روز'}
                {boxNumber === 4 && 'مرور هر ۸ روز'}
                {boxNumber === 5 && 'لغات آموخته شده'}
              </div>
            </motion.div>
          ))}
        </div>

        {words.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center card mt-8"
          >
            <div className="mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تبریک! 🎉</h2>
            <p className="text-gray-600 mb-8">
              شما همه لغات قابل مرور را بررسی کرده‌اید.
            </p>
            <button
              onClick={loadWords}
              className="btn-primary"
            >
              بررسی مجدد
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeitnerBoxPage;