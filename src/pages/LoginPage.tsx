import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(username, password);
      toast.success('با موفقیت وارد شدید!');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('خطا در ورود. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <BookOpen className="w-8 h-8 text-primary-500" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900">زبان‌یار</span>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">ورود به حساب کاربری</h1>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-start"
          >
            <AlertCircle className="w-5 h-5 ml-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="form-label">نام کاربری یا ایمیل</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">رمز عبور</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                در حال ورود...
              </span>
            ) : (
              <span className="flex items-center space-x-1 space-x-reverse">
                <LogIn className="w-5 h-5" />
                <span>ورود</span>
              </span>
            )}
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              حساب کاربری ندارید؟{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              setUsername('demo');
              setPassword('password123');
            }}
            className="text-center w-full text-sm text-gray-600 hover:text-primary-600"
          >
            استفاده از حساب نمایشی
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;