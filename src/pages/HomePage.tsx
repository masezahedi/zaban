import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Zap, Trophy, Languages, User, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-10 h-10 text-primary-500" />,
      title: 'یادگیری موثر',
      description: 'روش‌های علمی و کارآمد برای یادگیری سریع‌تر و عمیق‌تر لغات'
    },
    {
      icon: <Zap className="w-10 h-10 text-accent-500" />,
      title: 'بازی‌وار',
      description: 'یادگیری از طریق بازی‌های جذاب و سرگرم‌کننده'
    },
    {
      icon: <Trophy className="w-10 h-10 text-secondary-500" />,
      title: 'امتیازات و دستاوردها',
      description: 'کسب امتیاز و مدال برای پیشرفت‌ها و دستاوردهای شما'
    },
    {
      icon: <Languages className="w-10 h-10 text-primary-600" />,
      title: 'چندین زبان',
      description: 'پشتیبانی از زبان‌های مختلف مانند انگلیسی، فرانسوی، اسپانیایی و غیره'
    }
  ];

  const languages = [
    { name: 'انگلیسی', flag: '🇬🇧', active: true },
    { name: 'فرانسوی', flag: '🇫🇷', active: true },
    { name: 'اسپانیایی', flag: '🇪🇸', active: true },
    { name: 'آلمانی', flag: '🇩🇪', active: true },
    { name: 'ایتالیایی', flag: '🇮🇹', coming: true },
    { name: 'روسی', flag: '🇷🇺', coming: true },
    { name: 'ژاپنی', flag: '🇯🇵', coming: true },
    { name: 'چینی', flag: '🇨🇳', coming: true }
  ];

  const testimonials = [
    {
      avatar: <User className="w-12 h-12 text-gray-700 border border-gray-300 rounded-full p-2" />,
      name: 'سارا محمدی',
      text: 'به کمک زبان‌یار تونستم در کمتر از ۳ ماه بیش از ۱۰۰۰ لغت انگلیسی رو یاد بگیرم. روش بازی‌وار واقعاً تأثیرگذاره!'
    },
    {
      avatar: <User className="w-12 h-12 text-gray-700 border border-gray-300 rounded-full p-2" />,
      name: 'علی رضایی',
      text: 'بعد از سال‌ها تلاش برای یادگیری فرانسوی، با زبان‌یار تونستم خیلی سریع پیشرفت کنم. واقعاً ممنونم!'
    },
    {
      avatar: <User className="w-12 h-12 text-gray-700 border border-gray-300 rounded-full p-2" />,
      name: 'نیما کریمی',
      text: 'رابط کاربری جذاب و بازی‌های متنوع باعث شده که هر روز با اشتیاق به یادگیری ادامه بدم. به همه توصیه می‌کنم.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center"
          >
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="heading-1 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500"
              >
                یادگیری لغات زبان را با بازی تجربه کنید!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-gray-700 mb-8"
              >
                زبان‌یار با روش‌های علمی و سرگرم‌کننده به شما کمک می‌کند تا لغات زبان‌های مختلف را به صورت اصولی و ماندگار یاد بگیرید.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/register" className="btn-primary text-center">
                  شروع رایگان
                </Link>
                <Link to="/login" className="btn-outline text-center">
                  ورود به حساب کاربری
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-8 flex items-center text-gray-600"
              >
                <CheckCircle className="w-5 h-5 text-primary-500 ml-2" />
                <span>بیش از ۱۰۰,۰۰۰ کاربر فعال</span>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
                className="glass-card p-8 relative z-10"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary-600">آموزش انگلیسی</h3>
                    <p className="text-sm text-gray-600">سطح ۳</p>
                  </div>
                  <div className="bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">
                    امتیاز: ۷۵۰
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-800 font-medium mb-2">کلمه را با تصویر مناسب مطابقت دهید:</p>
                    <div className="flex justify-center my-4">
                      <div className="text-2xl font-bold text-primary-700">Apple</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['🍎', '🍐', '🍊', '🍌'].map((emoji, index) => (
                        <button
                          key={index}
                          className={`p-4 rounded-lg text-2xl ${index === 0 ? 'bg-primary-100 border-2 border-primary-500' : 'bg-white border border-gray-200'} hover:bg-primary-50 transition-colors`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20, y: -30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 bg-accent-500 text-white p-3 rounded-lg shadow-lg z-0"
              >
                <Zap className="w-6 h-6" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20, y: 30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-0 left-0 transform -translate-x-10 translate-y-10 bg-secondary-500 text-white p-3 rounded-lg shadow-lg z-0"
              >
                <Trophy className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="heading-2 mb-4"
            >
              چرا زبان‌یار را انتخاب کنید؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              زبان‌یار با ترکیب روش‌های علمی و بازی‌وار، یادگیری زبان را به تجربه‌ای لذت‌بخش تبدیل می‌کند.
            </motion.p>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card group hover:border-primary-300 border border-transparent"
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Languages Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-4">زبان‌های قابل یادگیری</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              مجموعه‌ای از زبان‌های پرکاربرد دنیا را با روش‌های اصولی و علمی بیاموزید.
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          >
            {languages.map((lang, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`card group hover:border-primary-300 border border-transparent ${lang.coming ? 'opacity-60' : ''}`}
              >
                <div className="text-4xl mb-3">{lang.flag}</div>
                <h3 className="text-lg font-bold text-gray-800">{lang.name}</h3>
                {lang.coming ? (
                  <span className="text-xs font-medium text-secondary-500 bg-secondary-50 px-2 py-1 rounded-full mt-2 inline-block">
                    به زودی
                  </span>
                ) : (
                  <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-1 rounded-full mt-2 inline-block">
                    فعال
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 mb-4">نظرات کاربران</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ببینید کاربران ما درباره تجربه یادگیری با زبان‌یار چه می‌گویند.
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card"
              >
                <div className="flex items-center mb-4">
                  {testimonial.avatar}
                  <div className="mr-3">
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            همین امروز یادگیری زبان را شروع کنید!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg mb-8 opacity-90 max-w-2xl mx-auto"
          >
            با ثبت‌نام رایگان، به جمع بیش از ۱۰۰ هزار کاربر زبان‌یار بپیوندید و لذت یادگیری زبان با روش‌های بازی‌وار را تجربه کنید.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
              ثبت‌نام رایگان
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center mb-8">
            <BookOpen className="w-8 h-8 text-primary-500 ml-2" />
            <span className="text-xl font-bold text-gray-900">زبان‌یار</span>
          </div>
          
          <div className="text-center text-gray-600 text-sm">
            <p>تمامی حقوق برای زبان‌یار محفوظ است. &copy; ۱۴۰۴</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;