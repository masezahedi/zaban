import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, LogIn, UserPlus, Menu, X, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white bg-opacity-80 backdrop-blur-lg shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <BookOpen className="w-8 h-8 text-primary-500" />
          </motion.div>
          <span className="text-xl font-bold text-gray-900">زبان‌یار</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 space-x-reverse">
          {user ? (
            <>
              <span className="text-gray-700">خوش آمدید، {user.fullName}</span>
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                داشبورد
              </Link>
              <Link to="/games" className="text-gray-700 hover:text-primary-600 transition-colors">
                بازی‌های من
              </Link>
              <button
                onClick={logout}
                className="btn-outline text-sm py-2"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-1 space-x-reverse text-gray-700 hover:text-primary-600 transition-colors">
                <LogIn className="w-5 h-5" />
                <span>ورود</span>
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <UserPlus className="w-5 h-5" />
                  <span>ثبت نام</span>
                </div>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t"
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {user ? (
              <>
                <span className="text-gray-700 py-2">خوش آمدید، {user.fullName}</span>
                <Link 
                  to="/dashboard"
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-primary-600 py-2 transition-colors"
                >
                  داشبورد
                </Link>
                <Link 
                  to="/games"
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-primary-600 py-2 transition-colors"
                >
                  بازی‌های من
                </Link>
                <button
                  onClick={() => { logout(); toggleMenu(); }}
                  className="btn-outline text-sm py-2 w-full"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={toggleMenu}
                  className="flex items-center space-x-1 space-x-reverse py-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span>ورود</span>
                </Link>
                <Link 
                  to="/register"
                  onClick={toggleMenu}
                  className="btn-primary text-sm py-2 w-full text-center"
                >
                  <div className="flex items-center justify-center space-x-1 space-x-reverse">
                    <UserPlus className="w-5 h-5" />
                    <span>ثبت نام</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;