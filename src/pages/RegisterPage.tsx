import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند.');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });
      toast.success('ثبت‌نام با موفقیت انجام شد!');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-10">
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
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">ایجاد حساب کاربری</h1>
        
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
            <label htmlFor="fullName" className="form-label">نام و نام خانوادگی</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="username" className="form-label">نام کاربری</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="form-label">ایمیل</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">رمز عبور</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label">تکرار رمز عبور</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
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
                در حال ثبت‌نام...
              </span>
            ) : (
              <span className="flex items-center space-x-1 space-x-reverse">
                <UserPlus className="w-5 h-5" />
                <span>ثبت‌نام</span>
              </span>
            )}
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;