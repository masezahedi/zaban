import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Gamepad2, ArrowRight, KeyRound, Search } from 'lucide-react';

const GamesPage: React.FC = () => {
  const games = [
    {
      id: 'leitner',
      title: 'جعبه لایتنر',
      description: 'یادگیری لغات با روش علمی جعبه لایتنر',
      icon: <Brain className="w-12 h-12 text-primary-500" />,
      link: '/leitner',
      active: true
    },
    {
      id: 'memory',
      title: 'جفت‌یاب',
      description: 'پیدا کردن جفت کارت‌های مرتبط',
      icon: <Gamepad2 className="w-12 h-12 text-secondary-500" />,
      link: '/memory',
      active: true
    },
    {
      id: 'wordle',
      title: 'وردل',
      description: 'حدس کلمه مخفی',
      icon: <KeyRound className="w-12 h-12 text-accent-500" />,
      link: '/wordle',
      active: true
    },
    {
      id: 'wordsearch',
      title: 'مارپیچ لغات',
      description: 'پیدا کردن کلمات مخفی شده در جدول',
      icon: <Search className="w-12 h-12 text-green-500" />,
      link: '/wordsearch',
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-12">
          <Link 
            to="/dashboard" 
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            <span>بازگشت به داشبورد</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">بازی‌های من</h1>
          <p className="text-gray-600">با روش‌های سرگرم‌کننده و علمی زبان یاد بگیرید</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="card relative overflow-hidden group"
            >
              <div className="absolute top-4 left-4">
                {game.comingSoon && (
                  <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                    به زودی
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center p-6">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                <p className="text-gray-600 text-center mb-6">{game.description}</p>
                
                {game.active ? (
                  <Link
                    to={game.link}
                    className="btn-primary w-full text-center"
                  >
                    شروع بازی
                  </Link>
                ) : (
                  <button
                    disabled
                    className="btn-primary w-full opacity-50 cursor-not-allowed"
                  >
                    به زودی
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesPage;