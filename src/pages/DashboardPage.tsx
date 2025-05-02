import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Settings, LogOut, History, Home, Gamepad2, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProgress, UserProgress } from '../db/db';
import toast from 'react-hot-toast';
import DashboardStats from '../components/dashboard/DashboardStats';
import LanguageProgress from '../components/dashboard/LanguageProgress';
import DailyChallenges from '../components/dashboard/DailyChallenges';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        try {
          const userProgress = await getUserProgress(user.id);
          setProgress(userProgress);
        } catch (error) {
          console.error('Error loading data:', error);
          toast.error('خطا در بارگیری اطلاعات');
        }
      }
    };
    
    loadData();
  }, [user]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-white shadow-md z-30 hidden md:block">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse mb-10">
            <BookOpen className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900">زبان‌یار</span>
          </Link>
          
          <div className="mb-8">
            <div className="bg-primary-50 rounded-lg p-4">
              <h2 className="font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center space-x-2 space-x-reverse text-gray-900 bg-primary-50 rounded-lg px-4 py-3 font-medium">
              <Home className="w-5 h-5" />
              <span>داشبورد</span>
            </Link>
            <Link to="/words" className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>مدیریت لغات</span>
            </Link>
            <Link to="/games" className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
              <Gamepad2 className="w-5 h-5" />
              <span>بازی‌های من</span>
            </Link>
            <button className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
              <Award className="w-5 h-5" />
              <span>دستاوردها</span>
            </button>
            <button className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
              <History className="w-5 h-5" />
              <span>تاریخچه</span>
            </button>
            <button className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
              <Settings className="w-5 h-5" />
              <span>تنظیمات</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 space-x-reverse text-red-600 hover:bg-red-50 rounded-lg px-4 py-3 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>خروج</span>
            </button>
          </nav>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <header className="bg-white shadow-sm py-4 px-4 flex items-center justify-between md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <BookOpen className="w-7 h-7 text-primary-500" />
          <span className="text-lg font-bold text-gray-900">زبان‌یار</span>
        </Link>
        
        <div className="w-8"></div>
      </header>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <motion.div
            initial={{ x: 250 }}
            animate={{ x: 0 }}
            className="absolute top-0 right-0 h-full w-64 bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <Link to="/" className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="w-7 h-7 text-primary-500" />
                <span className="text-lg font-bold text-gray-900">زبان‌یار</span>
              </Link>
              
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-8">
              <div className="bg-primary-50 rounded-lg p-4">
                <h2 className="font-bold text-gray-900">{user?.fullName}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link 
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 space-x-reverse text-gray-900 bg-primary-50 rounded-lg px-4 py-3 font-medium"
              >
                <Home className="w-5 h-5" />
                <span>داشبورد</span>
              </Link>
              <Link 
                to="/words"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>مدیریت لغات</span>
              </Link>
              <Link 
                to="/games"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>بازی‌های من</span>
              </Link>
              <button className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
                <Award className="w-5 h-5" />
                <span>دستاوردها</span>
              </button>
              <button className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
                <History className="w-5 h-5" />
                <span>تاریخچه</span>
              </button>
              <button className="w-full flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
                <Settings className="w-5 h-5" />
                <span>تنظیمات</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 space-x-reverse text-red-600 hover:bg-red-50 rounded-lg px-4 py-3 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>خروج</span>
              </button>
            </nav>
          </motion.div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="md:pr-64 pt-0 md:pt-8 pb-12">
        <div className="container mx-auto px-4 mt-8">
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-gray-900"
            >
              سلام، {user?.fullName}! 👋
            </motion.h1>
          </div>
          
          <DashboardStats progress={progress} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <LanguageProgress progress={progress} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DailyChallenges />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;